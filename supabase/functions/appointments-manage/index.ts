import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

type Body = { id?: string; token?: string; action?: "confirm" | "cancel" };

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  try {
    const body: Body = req.method === "POST" ? await req.json() : Object.fromEntries(new URL(req.url).searchParams);
    const id = (body.id ?? "").trim();
    const token = (body.token ?? "").trim();
    const action = body.action;
    if (!id || !token || (action !== "confirm" && action !== "cancel")) {
      return new Response(JSON.stringify({ error: "Missing id, token, or action." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: appt } = await sb
      .from("appointments")
      .select("id, status, scheduled_at, timezone, zoom_link, confirmation_token, cancellation_token")
      .eq("id", id)
      .maybeSingle();
    if (!appt) {
      return new Response(JSON.stringify({ error: "Appointment not found." }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const expectedToken = action === "confirm" ? appt.confirmation_token : appt.cancellation_token;
    if (token !== expectedToken) {
      return new Response(JSON.stringify({ error: "Invalid token." }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "confirm") {
      if (appt.status === "cancelled") {
        return new Response(JSON.stringify({ error: "This appointment was cancelled." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      await sb.from("appointments").update({ status: "confirmed", updated_at: new Date().toISOString() }).eq("id", id);
      return new Response(JSON.stringify({ ok: true, status: "confirmed", appointment: appt }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await sb.from("appointments").update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("id", id);
    return new Response(JSON.stringify({ ok: true, status: "cancelled", appointment: appt }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("manage error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
