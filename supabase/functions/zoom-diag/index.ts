const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ZOOM_ACCOUNT_ID = Deno.env.get("ZOOM_ACCOUNT_ID") ?? "";
const ZOOM_CLIENT_ID = Deno.env.get("ZOOM_CLIENT_ID") ?? "";
const ZOOM_CLIENT_SECRET = Deno.env.get("ZOOM_CLIENT_SECRET") ?? "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  try {
    const present = {
      ZOOM_ACCOUNT_ID: Boolean(ZOOM_ACCOUNT_ID),
      ZOOM_CLIENT_ID: Boolean(ZOOM_CLIENT_ID),
      ZOOM_CLIENT_SECRET: Boolean(ZOOM_CLIENT_SECRET),
    };
    if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) {
      return new Response(JSON.stringify({ ok: false, present, reason: "missing env" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const basic = btoa(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`);
    const tokenRes = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(ZOOM_ACCOUNT_ID)}`,
      { method: "POST", headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" } },
    );
    const tokenText = await tokenRes.text();
    let token: string | null = null;
    try { token = JSON.parse(tokenText).access_token ?? null; } catch (_) { /* ignore */ }
    if (!tokenRes.ok || !token) {
      return new Response(JSON.stringify({ ok: false, present, token_status: tokenRes.status, token_body: tokenText }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const start = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const meetRes = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: "TrueForge Diagnostic", type: 2, start_time: start, duration: 15, timezone: "America/New_York",
        settings: { join_before_host: true, waiting_room: false, approval_type: 2, audio: "both", auto_recording: "none" },
      }),
    });
    const meetText = await meetRes.text();
    return new Response(JSON.stringify({
      ok: meetRes.ok, present, token_status: tokenRes.status, meeting_status: meetRes.status, meeting_body: meetText,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
