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

type Body = { email?: string; source?: string; siteUrl?: string; referralCode?: string };

function generateCode(length = 8): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  for (const b of bytes) code += chars[b % chars.length];
  return code;
}

async function sendConfirmationEmail(email: string, confirmUrl: string) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set; skipping confirmation email send for", email);
    return { skipped: true };
  }
  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:auto;padding:32px;background:#FBF7EF;color:#1B1B1B;border-radius:16px;">
      <h1 style="font-size:24px;margin:0 0 12px;color:#1B1B1B;">Confirm your spot on the TrueForge list.</h1>
      <p style="color:#444;line-height:1.55;">You asked to receive insights, protocols, and member-only updates from TrueForge Health &amp; Wellness. Tap the button below to confirm your email — once you do, you're in.</p>
      <p style="margin:28px 0;"><a href="${confirmUrl}" style="display:inline-block;background:#B8895A;color:#FBF7EF;padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:600;letter-spacing:0.02em;">Confirm Subscription</a></p>
      <p style="color:#666;font-size:13px;line-height:1.5;">If you didn't sign up, you can safely ignore this. We hate spam too — unsubscribe anytime.</p>
      <p style="color:#999;font-size:12px;margin-top:24px;">TrueForge Health &amp; Wellness</p>
    </div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [email],
      subject: "Confirm your TrueForge subscription",
      html,
    }),
  });
  const text = await res.text();
  if (!res.ok) console.error("Resend error:", res.status, text);
  return { ok: res.ok, status: res.status };
}

async function ensureReferralLink(sb: ReturnType<typeof createClient>, subscriberId: string): Promise<string> {
  const { data: existing } = await sb
    .from("referral_links")
    .select("code")
    .eq("subscriber_id", subscriberId)
    .maybeSingle();
  if (existing?.code) return existing.code;

  let code = generateCode();
  let attempts = 0;
  while (attempts < 5) {
    const { error } = await sb
      .from("referral_links")
      .insert({ subscriber_id: subscriberId, code });
    if (!error) return code;
    code = generateCode();
    attempts++;
  }
  throw new Error("Failed to generate unique referral code");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body: Body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();
    const source = (body.source ?? "").trim().slice(0, 80);
    const siteUrl = (body.siteUrl ?? "").trim() || (req.headers.get("origin") ?? "");
    const referredBy = (body.referralCode ?? "").trim().toLowerCase().slice(0, 20);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: existing } = await sb
      .from("newsletter_subscribers")
      .select("id, email, status, confirmation_token, unsubscribe_token")
      .eq("email", email)
      .maybeSingle();

    let row = existing;
    let isNewSignup = false;
    if (!row) {
      const { data, error } = await sb
        .from("newsletter_subscribers")
        .insert({ email, source, status: "pending" })
        .select("id, email, status, confirmation_token, unsubscribe_token")
        .maybeSingle();
      if (error) throw error;
      row = data;
      isNewSignup = true;
    } else if (row.status === "unsubscribed") {
      const { data, error } = await sb
        .from("newsletter_subscribers")
        .update({ status: "pending", source, unsubscribed_at: null })
        .eq("id", row.id)
        .select("id, email, status, confirmation_token, unsubscribe_token")
        .maybeSingle();
      if (error) throw error;
      row = data;
      isNewSignup = true;
    }

    if (!row) throw new Error("Failed to load subscriber row");

    if (row.status === "confirmed") {
      const referralCode = await ensureReferralLink(sb, row.id);
      const referralUrl = `${siteUrl.replace(/\/$/, "")}/?ref=${referralCode}`;
      return new Response(JSON.stringify({ ok: true, already_confirmed: true, referralCode, referralUrl }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const confirmUrl = `${siteUrl.replace(/\/$/, "")}/#/newsletter/confirm?token=${row.confirmation_token}`;
    const sendResult = await sendConfirmationEmail(email, confirmUrl);

    // Track referral conversion event
    if (referredBy && isNewSignup) {
      await sb.from("referral_events").insert({
        referral_code: referredBy,
        event_type: "signup",
        metadata: { new_subscriber_id: row.id, email },
      });
      await sb.from("referral_links")
        .update({ converted_count: sb.rpc("increment", {}) as unknown as number })
        .eq("code", referredBy);
    }

    // Generate referral link for the new subscriber
    const referralCode = await ensureReferralLink(sb, row.id);
    const referralUrl = `${siteUrl.replace(/\/$/, "")}/?ref=${referralCode}`;

    return new Response(JSON.stringify({ ok: true, pending: true, sent: !sendResult.skipped, referralCode, referralUrl }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("subscribe error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
