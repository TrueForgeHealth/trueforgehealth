import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const REFERRAL_GOAL = 3;

const TIERS = [
  { id: "member", label: "Forge Member",  minLifetime: 0 },
  { id: "forge",  label: "Forge Plus",    minLifetime: 500 },
  { id: "elite",  label: "Forge Elite",   minLifetime: 2000 },
];

// Canonical earn rules — these are displayed in the portal and also enforced here
const EARN_RULES = [
  { source: "monthly_membership", points: 100,  label: "Active $99 membership",           cadence: "monthly" },
  { source: "referral",           points: 250,  label: "Successful member referral",       cadence: "per event" },
  { source: "coaching_checkin",   points: 250,  label: "Monthly coaching check-in",        cadence: "monthly" },
  { source: "questionnaire",      points: 100,  label: "Completed health questionnaire",   cadence: "per form" },
];

const REDEMPTIONS = [
  { points: 500,  value_usd: 25, label: "$25 service credit" },
  { points: 1000, value_usd: 50, label: "$50 service credit" },
];

function generateCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function tierFor(lifetime: number): string {
  let current = TIERS[0].id;
  for (const t of TIERS) if (lifetime >= t.minLifetime) current = t.id;
  return current;
}

async function ensureLoyaltyAccount(
  sb: ReturnType<typeof createClient>,
  userId: string,
): Promise<{ points_balance: number; points_lifetime: number; tier: string }> {
  const { data: existing } = await sb
    .from("loyalty_accounts")
    .select("points_balance, points_lifetime, tier")
    .eq("id", userId)
    .maybeSingle();
  if (existing) return existing as { points_balance: number; points_lifetime: number; tier: string };
  await sb.from("loyalty_accounts").insert({ id: userId });
  return { points_balance: 0, points_lifetime: 0, tier: "member" };
}

async function awardMonthlyMembership(
  sb: ReturnType<typeof createClient>,
  userId: string,
  email: string,
) {
  const { data: profile } = await sb
    .from("member_profiles")
    .select("membership_status")
    .or(`id.eq.${userId},email.ilike.${email}`)
    .maybeSingle();
  if (!profile || profile.membership_status !== "active") return;

  const monthKey = new Date().toISOString().slice(0, 7);
  const referenceId = `monthly:${monthKey}`;

  const { data: already } = await sb
    .from("loyalty_transactions")
    .select("id")
    .eq("user_id", userId)
    .eq("source", "monthly_membership")
    .eq("reference_id", referenceId)
    .maybeSingle();
  if (already) return;

  await sb.from("loyalty_transactions").insert({
    user_id: userId,
    points: 100,
    reason: `Monthly membership reward (${monthKey})`,
    source: "monthly_membership",
    reference_id: referenceId,
  });

  const { data: account } = await sb
    .from("loyalty_accounts")
    .select("points_balance, points_lifetime")
    .eq("id", userId)
    .maybeSingle();
  if (!account) return;

  const newLifetime = (account.points_lifetime ?? 0) + 100;
  await sb.from("loyalty_accounts").update({
    points_balance: (account.points_balance ?? 0) + 100,
    points_lifetime: newLifetime,
    tier: tierFor(newLifetime),
    updated_at: new Date().toISOString(),
  }).eq("id", userId);
}

async function ensureReferralLink(
  sb: ReturnType<typeof createClient>,
  email: string,
): Promise<string> {
  let { data: subscriber } = await sb
    .from("newsletter_subscribers")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  if (!subscriber) {
    const { data: inserted } = await sb
      .from("newsletter_subscribers")
      .insert({ email, source: "portal_loyalty", status: "confirmed", confirmed_at: new Date().toISOString() })
      .select("id, status")
      .maybeSingle();
    subscriber = inserted ?? null;
  } else if (subscriber.status !== "confirmed") {
    await sb
      .from("newsletter_subscribers")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString(), unsubscribed_at: null })
      .eq("id", subscriber.id);
  }
  if (!subscriber) throw new Error("Could not create subscriber");

  const { data: existingLink } = await sb
    .from("referral_links")
    .select("code")
    .eq("subscriber_id", subscriber.id)
    .maybeSingle();
  if (existingLink?.code) return existingLink.code as string;

  let code = generateCode();
  for (let i = 0; i < 5; i++) {
    const { error } = await sb.from("referral_links").insert({ subscriber_id: subscriber.id, code });
    if (!error) return code;
    code = generateCode();
  }
  throw new Error("Failed to generate unique referral code");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SERVICE_ROLE, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser(token);
    if (userErr || !userData?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = userData.user.id;
    const email = userData.user.email.toLowerCase();
    const body = await req.json().catch(() => ({} as { siteUrl?: string }));
    const siteUrl = (body.siteUrl ?? req.headers.get("origin") ?? "https://trueforgehealth.com").replace(/\/$/, "");

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    await ensureLoyaltyAccount(sb, userId);
    await awardMonthlyMembership(sb, userId, email);

    const { data: account } = await sb
      .from("loyalty_accounts")
      .select("points_balance, points_lifetime, tier, updated_at")
      .eq("id", userId)
      .maybeSingle();

    const { data: transactions } = await sb
      .from("loyalty_transactions")
      .select("id, points, reason, source, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    const code = await ensureReferralLink(sb, email);
    const { data: link } = await sb
      .from("referral_links")
      .select("code, click_count, share_count, converted_count")
      .eq("code", code)
      .maybeSingle();

    const { count: signupCount } = await sb
      .from("referral_events")
      .select("id", { count: "exact", head: true })
      .eq("referral_code", code)
      .eq("event_type", "signup");

    const referralUrl = `${siteUrl}/?ref=${code}`;
    const conversions = Math.max(link?.converted_count ?? 0, signupCount ?? 0);

    return new Response(
      JSON.stringify({
        ok: true,
        account: {
          points_balance: account?.points_balance ?? 0,
          points_lifetime: account?.points_lifetime ?? 0,
          tier: account?.tier ?? "member",
        },
        tiers: TIERS,
        earnRules: EARN_RULES,
        redemptions: REDEMPTIONS,
        transactions: transactions ?? [],
        referral: {
          code,
          referralUrl,
          clickCount: link?.click_count ?? 0,
          shareCount: link?.share_count ?? 0,
          signupCount: signupCount ?? 0,
          conversions,
          goal: REFERRAL_GOAL,
          goalReached: conversions >= REFERRAL_GOAL,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("member-loyalty error", e);
    return new Response(JSON.stringify({ error: "Failed to load loyalty data" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
