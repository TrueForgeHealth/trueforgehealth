import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const PLAN_AMOUNT_USD: Record<string, number> = {
  monthly_99: 99,
};

interface RewardRequest {
  trainer_id: string;
  referred_email: string;
  membership_id: string;
}

async function requireAdminOrService(req: Request): Promise<{ ok: true } | { ok: false; res: Response }> {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  if (!token) {
    return { ok: false, res: new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    }) };
  }
  if (token === SERVICE_ROLE) return { ok: true };

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
  // admin_users.id is the user's UUID (matches auth.uid())
  const { data: row } = await admin.from("admin_users").select("id").eq("id", userData.user.id).maybeSingle();
  if (!row) {
    return { ok: false, res: new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    }) };
  }
  return { ok: true };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const gate = await requireAdminOrService(req);
    if (!gate.ok) return gate.res;

    const client = createClient(SUPABASE_URL, SERVICE_ROLE);

    const body = (await req.json().catch(() => ({}))) as Partial<RewardRequest>;
    const { trainer_id, referred_email, membership_id } = body;

    if (!trainer_id || !referred_email || !membership_id) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: membership, error: membershipError } = await client
      .from("member_profiles")
      .select("id, email, membership_plan, membership_status")
      .eq("id", membership_id)
      .maybeSingle();

    if (membershipError || !membership) {
      return new Response(JSON.stringify({ error: "Membership not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (String(membership.email ?? "").toLowerCase() !== String(referred_email).toLowerCase()) {
      return new Response(JSON.stringify({ error: "Referred email does not match membership" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (membership.membership_status !== "active") {
      return new Response(JSON.stringify({ error: "Membership is not active" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const planKey = String(membership.membership_plan ?? "");
    const membershipAmount = PLAN_AMOUNT_USD[planKey];
    if (!membershipAmount) {
      return new Response(JSON.stringify({ error: "Unknown membership plan" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: trainer, error: trainerError } = await client
      .from("trainers")
      .select("custom_reward_percentage, total_rewards_earned, successful_conversions")
      .eq("id", trainer_id)
      .maybeSingle();

    if (trainerError || !trainer) {
      return new Response(JSON.stringify({ error: "Trainer not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: existingReward } = await client
      .from("trainer_referral_rewards")
      .select("id")
      .eq("trainer_id", trainer_id)
      .eq("membership_id", membership_id)
      .maybeSingle();

    if (existingReward) {
      return new Response(JSON.stringify({ error: "Reward already recorded for this membership" }), {
        status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rewardPercentage = trainer.custom_reward_percentage ?? 15;
    const rewardAmount = Math.round((membershipAmount * rewardPercentage)) / 100;

    const { data: reward, error: rewardError } = await client
      .from("trainer_referral_rewards")
      .insert({
        trainer_id,
        referred_email: String(referred_email).toLowerCase(),
        referred_member_id: membership_id,
        membership_id,
        reward_percentage: rewardPercentage,
        reward_amount: rewardAmount,
        membership_fee: membershipAmount,
        status: "earned",
      })
      .select()
      .maybeSingle();

    if (rewardError || !reward) {
      console.error("calculate-referral-rewards reward insert failed", rewardError);
      return new Response(JSON.stringify({ error: "Failed to record reward" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await client
      .from("trainers")
      .update({
        successful_conversions: (trainer.successful_conversions || 0) + 1,
        total_rewards_earned: (trainer.total_rewards_earned || 0) + rewardAmount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", trainer_id);

    return new Response(
      JSON.stringify({ success: true, reward, rewardAmount, rewardPercentage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("calculate-referral-rewards error", err);
    return new Response(
      JSON.stringify({ error: "Reward calculation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
