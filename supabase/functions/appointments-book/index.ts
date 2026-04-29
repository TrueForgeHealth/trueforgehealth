import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = Deno.env.get("NEWSLETTER_FROM") ?? "TrueForge Health <hello@trueforgehealth.com>";
const ZOOM_DEFAULT_LINK = Deno.env.get("ZOOM_DEFAULT_LINK") ?? "https://zoom.us/j/2112110220";
const ZOOM_ACCOUNT_ID = Deno.env.get("ZOOM_ACCOUNT_ID") ?? "";
const ZOOM_CLIENT_ID = Deno.env.get("ZOOM_CLIENT_ID") ?? "";
const ZOOM_CLIENT_SECRET = Deno.env.get("ZOOM_CLIENT_SECRET") ?? "";

async function zoomAccessToken(): Promise<string | null> {
  if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) return null;
  try {
    const basic = btoa(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`);
    const res = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(ZOOM_ACCOUNT_ID)}`, {
      method: "POST",
      headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/x-www-form-urlencoded" },
    });
    const data = await res.json();
    if (!res.ok) { console.error("Zoom token error", res.status, data); return null; }
    return data.access_token ?? null;
  } catch (e) { console.error("Zoom token exception", e); return null; }
}

async function createZoomMeeting(token: string, topic: string, startIso: string, durationMin: number): Promise<string | null> {
  try {
    const res = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        topic, type: 2, start_time: startIso, duration: durationMin, timezone: "America/New_York",
        settings: { join_before_host: true, waiting_room: false, approval_type: 2, audio: "both", auto_recording: "none" },
      }),
    });
    const data = await res.json();
    if (!res.ok) { console.error("Zoom create error", res.status, data); return null; }
    return (data.join_url as string | undefined) ?? null;
  } catch (e) { console.error("Zoom create exception", e); return null; }
}

type Body = {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  goal?: string;
  notes?: string;
  scheduled_at?: string;
  duration_minutes?: number;
  source?: string;
  siteUrl?: string;
};

function fmtWhen(iso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short",
  }).format(new Date(iso));
}

function emailShell(inner: string): string {
  return `<div style="font-family:Georgia,serif;max-width:560px;margin:auto;padding:32px;background:#FBF7EF;color:#1B1B1B;border-radius:16px;">${inner}<p style="color:#999;font-size:12px;margin-top:24px;">TrueForge Health &amp; Wellness</p></div>`;
}

function btn(href: string, label: string, color = "#B8895A"): string {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#FBF7EF;padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:600;letter-spacing:0.02em;">${label}</a>`;
}

async function sendEmail(to: string, subject: string, html: string): Promise<{ ok: boolean; status: number; error?: string }> {
  if (!RESEND_API_KEY) return { ok: false, status: 0, error: "RESEND_API_KEY not set" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  const text = await res.text();
  if (!res.ok) console.error("Resend error:", res.status, text);
  return { ok: res.ok, status: res.status, error: res.ok ? undefined : text };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  try {
    const body: Body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();
    const first_name = (body.first_name ?? "").trim().slice(0, 80);
    const last_name = (body.last_name ?? "").trim().slice(0, 80);
    const phone = (body.phone ?? "").trim().slice(0, 40);
    const goal = (body.goal ?? "").trim().slice(0, 120);
    const notes = (body.notes ?? "").trim().slice(0, 1000);
    const source = (body.source ?? "").trim().slice(0, 80);
    const scheduled_at = (body.scheduled_at ?? "").trim();
    const duration = Math.min(240, Math.max(5, body.duration_minutes ?? 15));
    const siteUrl = (body.siteUrl ?? "").trim() || (req.headers.get("origin") ?? "");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const startDate = new Date(scheduled_at);
    if (isNaN(startDate.getTime())) {
      return new Response(JSON.stringify({ error: "Invalid scheduled_at." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (startDate.getTime() < Date.now() + 30 * 60 * 1000) {
      return new Response(JSON.stringify({ error: "That slot is no longer available." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

    let zoomLink = ZOOM_DEFAULT_LINK;
    const zoomToken = await zoomAccessToken();
    if (zoomToken) {
      const topic = `TrueForge Discovery Call - ${first_name || email}`;
      const created = await createZoomMeeting(zoomToken, topic, startDate.toISOString(), duration);
      if (created) zoomLink = created;
    }

    const { data: clash } = await sb
      .from("appointments")
      .select("id")
      .eq("scheduled_at", startDate.toISOString())
      .in("status", ["scheduled", "confirmed"])
      .maybeSingle();
    if (clash) {
      return new Response(JSON.stringify({ error: "That slot was just taken. Please pick another." }), {
        status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let lead_id: string | null = null;
    const { data: lead } = await sb
      .from("leads")
      .insert({ email, first_name, last_name, phone, source_page: source || "/book", interest: goal })
      .select("id")
      .maybeSingle();
    lead_id = lead?.id ?? null;

    const { data: appt, error: apptErr } = await sb
      .from("appointments")
      .insert({
        email, first_name, last_name, phone, goal, notes,
        scheduled_at: startDate.toISOString(),
        duration_minutes: duration,
        timezone: "America/New_York",
        kind: "discovery_15",
        source: source || "/book",
        zoom_link: zoomLink,
        lead_id,
      })
      .select("id, confirmation_token, cancellation_token, scheduled_at, timezone, zoom_link")
      .maybeSingle();
    if (apptErr || !appt) throw apptErr ?? new Error("Failed to create appointment");

    const base = (siteUrl || "").replace(/\/$/, "");
    const confirmUrl = `${base}/#/book/manage?id=${appt.id}&t=${appt.confirmation_token}&action=confirm`;
    const cancelUrl = `${base}/#/book/manage?id=${appt.id}&t=${appt.cancellation_token}&action=cancel`;

    const when = fmtWhen(appt.scheduled_at, appt.timezone);
    const inner = `
      <h1 style="font-size:24px;margin:0 0 12px;color:#1B1B1B;">Your TrueForge discovery call is booked.</h1>
      <p style="color:#444;line-height:1.6;">Hi ${first_name || "there"} — thanks for booking. Here are your details:</p>
      <div style="margin:20px 0;padding:18px 20px;background:#FFF;border:1px solid #EFE6D4;border-radius:12px;">
        <p style="margin:0 0 8px;"><strong>When:</strong> ${when}</p>
        <p style="margin:0 0 8px;"><strong>Duration:</strong> ${duration} minutes</p>
        <p style="margin:0;"><strong>Zoom:</strong> <a href="${appt.zoom_link}" style="color:#A36F43;">${appt.zoom_link}</a></p>
      </div>
      <p style="color:#444;line-height:1.6;">We'll send reminders 3 days, 24 hours, 2 hours, and 10 minutes before your call. The 10-minute reminder includes the Zoom link again so it's easy to find.</p>
      <p style="margin:24px 0 8px;">${btn(confirmUrl, "Confirm Attendance")}</p>
      <p style="margin:8px 0 0;font-size:14px;"><a href="${cancelUrl}" style="color:#666;text-decoration:underline;">Need to cancel or reschedule?</a></p>
      <p style="color:#666;font-size:13px;margin-top:24px;line-height:1.5;">Talk soon,<br/>The TrueForge Team</p>`;
    const html = emailShell(inner);
    const sendResult = await sendEmail(email, "Your TrueForge discovery call is booked", html);
    await sb.from("appointment_reminders").insert({
      appointment_id: appt.id,
      kind: "confirmation",
      status: sendResult.ok ? "sent" : "failed",
      error: sendResult.error ?? "",
    });

    return new Response(
      JSON.stringify({
        ok: true,
        appointment: {
          id: appt.id,
          scheduled_at: appt.scheduled_at,
          timezone: appt.timezone,
          zoom_link: appt.zoom_link,
          when_label: when,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("book error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
