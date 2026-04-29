import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

function form(params: Record<string, string | string[]>): string {
  const out: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) v.forEach((vv, i) => out.push(`${encodeURIComponent(`${k}[${i}]`)}=${encodeURIComponent(vv)}`));
    else out.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  }
  return out.join("&");
}

async function requireAdmin(req: Request): Promise<{ ok: true } | { ok: false; res: Response }> {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  if (!token) {
    return { ok: false, res: new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    }) };
  }
  const userClient = createClient(SUPABASE_URL, SERVICE_ROLE, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser(token);
  if (userErr || !userData?.user) {
    return { ok: false, res: new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    }) };
  }
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: row } = await admin.from("admin_users").select("user_id").eq("user_id", userData.user.id).maybeSingle();
  if (!row) {
    return { ok: false, res: new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    }) };
  }
  return { ok: true };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  try {
    const gate = await requireAdmin(req);
    if (!gate.ok) return gate.res;

    if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
    const webhookUrl = `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/stripe-webhook`;

    const list = await fetch("https://api.stripe.com/v1/webhook_endpoints?limit=100", {
      headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
    });
    const listData = await list.json();
    if (!list.ok) throw new Error(`List failed: ${JSON.stringify(listData)}`);

    const existing = (listData.data as Array<{ id: string; url: string; status: string }>).find((e) => e.url === webhookUrl);
    if (existing) {
      return new Response(JSON.stringify({
        ok: true,
        already_exists: true,
        endpoint_id: existing.id,
        url: existing.url,
        note: "Webhook endpoint already registered. Stripe only reveals the signing secret on creation. If you need a fresh secret, delete this endpoint in the Stripe dashboard and re-run this function.",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const create = await fetch("https://api.stripe.com/v1/webhook_endpoints", {
      method: "POST",
      headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form({
        url: webhookUrl,
        "enabled_events": [
          "checkout.session.completed",
          "customer.subscription.updated",
          "customer.subscription.deleted",
          "invoice.payment_failed",
        ],
        description: "TrueForge membership webhook",
      }),
    });
    const created = await create.json();
    if (!create.ok) throw new Error(`Create failed: ${JSON.stringify(created)}`);

    return new Response(JSON.stringify({
      ok: true,
      endpoint_id: created.id,
      url: created.url,
      webhook_secret: created.secret,
      next_step: "Copy webhook_secret into Supabase Edge Function secrets as STRIPE_WEBHOOK_SECRET, then redeploy stripe-webhook.",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("stripe-bootstrap error", e);
    return new Response(JSON.stringify({ error: "Bootstrap failed" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
