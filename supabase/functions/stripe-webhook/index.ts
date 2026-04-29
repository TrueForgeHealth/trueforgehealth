import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, Stripe-Signature",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const FROM = Deno.env.get("NEWSLETTER_FROM") ?? "TrueForge Health <hello@trueforgehealth.com>";
const APP_URL = Deno.env.get("APP_URL") ?? "";

const INTAKE_URL = "https://service.prescribery.com/PatientSetUp/?agent=BryanEasterling&role=nci-sales-agent&agent_id=1179";
const Q_WEIGHT = "https://staff.prescribery.com/short/wkMNjld7jeEK";
const Q_HORMONE = "https://staff.prescribery.com/short/QJy4zwZMDejn";
const Q_SEXUAL = "https://staff.prescribery.com/short/JWaV7EPL241G";

async function hmacSha256Hex(key: string, msg: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(msg));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function verifyStripeSignature(payload: string, header: string, secret: string, toleranceSec = 300): Promise<boolean> {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(",").map((kv) => {
    const [k, ...rest] = kv.split("="); return [k.trim(), rest.join("=").trim()];
  }));
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - parseInt(t, 10)) > toleranceSec) return false;
  const expected = await hmacSha256Hex(secret, `${t}.${payload}`);
  return timingSafeEqual(expected, v1);
}

function shell(inner: string): string {
  return `<div style="font-family:Georgia,serif;max-width:600px;margin:auto;padding:32px;background:#FBF7EF;color:#1B1B1B;border-radius:16px;">${inner}<p style="color:#999;font-size:12px;margin-top:24px;">TrueForge Health &amp; Wellness</p></div>`;
}
function btn(href: string, label: string, color = "#B8895A"): string {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#FBF7EF;padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:600;letter-spacing:0.02em;">${label}</a>`;
}
function linkRow(href: string, label: string): string {
  return `<a href="${href}" style="display:block;padding:14px 18px;margin:10px 0;background:#FFF;border:1px solid #EFE6D4;border-radius:12px;color:#A36F43;text-decoration:none;font-weight:600;">${label} -&gt;</a>`;
}

async function sendWelcomeEmail(to: string, first_name: string): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) return { ok: false, error: "RESEND_API_KEY not set" };
  const portalUrl = `${(APP_URL || "https://trueforgehealth.com").replace(/\/$/, "")}/#/portal?welcome=1`;
  const inner = `
    <h1 style="font-size:26px;margin:0 0 12px;">Welcome to TrueForge, ${first_name || "there"}.</h1>
    <p style="color:#444;line-height:1.6;">Your membership is active. Here's exactly what to do next so we can build your protocol fast.</p>
    <h3 style="margin:24px 0 6px;font-size:18px;">Step 1 - Complete your patient intake</h3>
    <p style="color:#555;line-height:1.6;margin:0 0 10px;">This is the secure form your clinician needs before your first visit.</p>
    ${linkRow(INTAKE_URL, "Open Patient Intake")}
    <h3 style="margin:24px 0 6px;font-size:18px;">Step 2 - Fill out the questionnaire(s) that match your goal</h3>
    <p style="color:#555;line-height:1.6;margin:0 0 10px;">Pick whichever apply. You can do all three; many members do.</p>
    ${linkRow(Q_WEIGHT, "Weight Loss / GLP Questionnaire")}
    ${linkRow(Q_HORMONE, "Hormone Optimization / TRT Questionnaire")}
    ${linkRow(Q_SEXUAL, "Sexual Wellness Questionnaire")}
    <h3 style="margin:24px 0 6px;font-size:18px;">Step 3 - Visit your member portal</h3>
    <p style="color:#555;line-height:1.6;margin:0 0 14px;">Track your protocol, message your clinician, and manage visits.</p>
    <p>${btn(portalUrl, "Open Member Portal")}</p>
    <p style="color:#666;font-size:13px;margin-top:24px;line-height:1.5;">Welcome aboard.<br/>The TrueForge Team</p>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject: "Welcome to TrueForge - your next steps", html: shell(inner) }),
  });
  const text = await res.text();
  if (!res.ok) console.error("Resend welcome error", res.status, text);
  return { ok: res.ok, error: res.ok ? undefined : text };
}

async function fetchStripeSession(id: string): Promise<Record<string, unknown> | null> {
  if (!STRIPE_SECRET_KEY) return null;
  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(id)}?expand[]=subscription&expand[]=customer`, {
    headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
  });
  if (!res.ok) { console.error("Stripe session fetch failed", res.status, await res.text()); return null; }
  return await res.json();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  try {
    if (!STRIPE_WEBHOOK_SECRET) {
      console.error("stripe-webhook refused: STRIPE_WEBHOOK_SECRET is not configured");
      return new Response(JSON.stringify({ error: "Webhook not configured" }), {
        status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const raw = await req.text();
    const sig = req.headers.get("stripe-signature") ?? "";
    const ok = await verifyStripeSignature(raw, sig, STRIPE_WEBHOOK_SECRET);
    if (!ok) return new Response("Invalid signature", { status: 400, headers: corsHeaders });
    const event: { id: string; type: string; data?: { object?: Record<string, unknown> } } = JSON.parse(raw);

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: existing } = await sb.from("stripe_events").select("id").eq("id", event.id).maybeSingle();
    if (existing) return new Response(JSON.stringify({ ok: true, duplicate: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    await sb.from("stripe_events").insert({ id: event.id, type: event.type, payload: event as unknown as Record<string, unknown> });

    if (event.type === "checkout.session.completed") {
      const session = (event.data?.object ?? {}) as Record<string, unknown>;
      const sessionId = String(session.id ?? "");
      let full = session;
      if (sessionId) {
        const fetched = await fetchStripeSession(sessionId);
        if (fetched) full = fetched;
      }

      const customer = full.customer as Record<string, unknown> | string | undefined;
      const customer_id = typeof customer === "string" ? customer : (customer?.id as string | undefined) ?? "";
      const subscription = full.subscription as Record<string, unknown> | string | undefined;
      const subscription_id = typeof subscription === "string" ? subscription : (subscription?.id as string | undefined) ?? "";
      const subStatus = typeof subscription === "object" ? (subscription?.status as string | undefined) : undefined;
      const periodEndUnix = typeof subscription === "object" ? (subscription?.current_period_end as number | undefined) : undefined;
      const customerDetails = (full.customer_details ?? {}) as Record<string, unknown>;
      const meta = (full.metadata ?? {}) as Record<string, string>;
      const email = String(meta.email ?? customerDetails.email ?? full.customer_email ?? "").toLowerCase();
      const first_name = String(meta.first_name ?? "");
      const last_name = String(meta.last_name ?? "");
      const appointment_id = String(meta.appointment_id ?? "") || null;

      if (!email) {
        console.error("checkout.session.completed missing email", { sessionId });
        return new Response(JSON.stringify({ ok: false, error: "missing email" }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const profilePayload = {
        email,
        first_name,
        last_name,
        stripe_customer_id: customer_id,
        stripe_subscription_id: subscription_id,
        membership_status: subStatus ?? "active",
        membership_plan: "monthly_99",
        membership_started_at: new Date().toISOString(),
        current_period_end: periodEndUnix ? new Date(periodEndUnix * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      };

      const { data: existingProfile } = await sb
        .from("member_profiles")
        .select("id")
        .ilike("email", email)
        .maybeSingle();

      let memberId: string | null = existingProfile?.id ?? null;
      if (memberId) {
        await sb.from("member_profiles").update(profilePayload).eq("id", memberId);
      } else {
        const { data: inserted } = await sb
          .from("member_profiles")
          .insert(profilePayload)
          .select("id")
          .maybeSingle();
        memberId = inserted?.id ?? null;
      }

      const events: Array<Record<string, unknown>> = [
        { user_id: memberId, email, event: "membership_started", appointment_id,
          payload: { stripe_customer_id: customer_id, stripe_subscription_id: subscription_id, session_id: sessionId } },
      ];

      const welcome = await sendWelcomeEmail(email, first_name);
      if (welcome.ok) {
        events.push({ user_id: memberId, email, event: "intake_sent", appointment_id, payload: { url: INTAKE_URL } });
        events.push({ user_id: memberId, email, event: "questionnaire_sent", appointment_id,
          payload: { urls: [Q_WEIGHT, Q_HORMONE, Q_SEXUAL] } });
      } else {
        events.push({ user_id: memberId, email, event: "intake_sent", appointment_id,
          payload: { url: INTAKE_URL, email_error: welcome.error ?? "" } });
      }
      await sb.from("member_onboarding_events").insert(events);

      // Award 100 loyalty points for becoming an active member (idempotent)
      if (memberId) {
        const loyaltyRefId = `membership_start:${sessionId}`;
        const { data: alreadyAwarded } = await sb
          .from("loyalty_transactions")
          .select("id")
          .eq("user_id", memberId)
          .eq("reference_id", loyaltyRefId)
          .maybeSingle();

        if (!alreadyAwarded) {
          // Ensure account row exists
          const { data: acct } = await sb
            .from("loyalty_accounts")
            .select("points_balance, points_lifetime")
            .eq("id", memberId)
            .maybeSingle();

          if (!acct) {
            await sb.from("loyalty_accounts").insert({ id: memberId });
          }

          await sb.from("loyalty_transactions").insert({
            user_id: memberId,
            points: 100,
            reason: "Welcome — membership activated",
            source: "monthly_membership",
            reference_id: loyaltyRefId,
          });

          const cur = acct ?? { points_balance: 0, points_lifetime: 0 };
          const newLifetime = (cur.points_lifetime ?? 0) + 100;
          const newBalance = (cur.points_balance ?? 0) + 100;
          const tier = newLifetime >= 2000 ? "elite" : newLifetime >= 500 ? "forge" : "member";
          await sb.from("loyalty_accounts").upsert({
            id: memberId,
            points_balance: newBalance,
            points_lifetime: newLifetime,
            tier,
            updated_at: new Date().toISOString(),
          });
        }
      }

      return new Response(JSON.stringify({ ok: true, member_id: memberId }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, ignored: event.type }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("stripe-webhook error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
