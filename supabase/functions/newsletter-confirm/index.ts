import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const FROM = Deno.env.get("NEWSLETTER_FROM") ?? "TrueForge Health <hello@trueforgehealth.com>";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

async function sendWelcomeEmail(email: string, unsubscribeUrl: string) {
  if (!RESEND_API_KEY) return { skipped: true };
  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:auto;padding:32px;background:#FBF7EF;color:#1B1B1B;border-radius:16px;">
      <h1 style="font-size:26px;margin:0 0 12px;color:#1B1B1B;">You're in.</h1>
      <p style="color:#444;line-height:1.6;">Welcome to the TrueForge list. You'll get protocols, transformation stories, and members-first drops — never spam, never sold.</p>
      <p style="color:#444;line-height:1.6;">If anything ever feels off, just hit reply. A real human reads every message.</p>
      <p style="color:#666;font-size:12px;margin-top:32px;line-height:1.5;">We hate spam too. <a href="${unsubscribeUrl}" style="color:#B8895A;">Unsubscribe anytime.</a></p>
    </div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [email], subject: "Welcome to TrueForge", html }),
  });
  if (!res.ok) console.error("Resend welcome error:", res.status, await res.text());
  return { ok: res.ok };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  try {
    const url = new URL(req.url);
    let token = url.searchParams.get("token");
    if (!token && req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      token = body.token ?? null;
    }
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing token" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: row } = await sb
      .from("newsletter_subscribers")
      .select("id, email, status, unsubscribe_token")
      .eq("confirmation_token", token)
      .maybeSingle();

    if (!row) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let alreadyConfirmed = false;
    if (row.status === "confirmed") {
      alreadyConfirmed = true;
    } else {
      const { error } = await sb
        .from("newsletter_subscribers")
        .update({ status: "confirmed", confirmed_at: new Date().toISOString(), unsubscribed_at: null })
        .eq("id", row.id);
      if (error) throw error;

      const siteUrl = url.searchParams.get("siteUrl") ?? req.headers.get("origin") ?? "";
      const unsubscribeUrl = `${siteUrl.replace(/\/$/, "")}/#/newsletter/unsubscribe?token=${row.unsubscribe_token}`;
      await sendWelcomeEmail(row.email, unsubscribeUrl);
    }

    return new Response(JSON.stringify({ ok: true, email: row.email, already_confirmed: alreadyConfirmed }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("confirm error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
