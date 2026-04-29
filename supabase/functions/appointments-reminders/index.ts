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
const APP_URL = Deno.env.get("APP_URL") ?? "https://trueforgehealth.com";

type Appt = {
  id: string;
  email: string;
  first_name: string;
  scheduled_at: string;
  timezone: string;
  status: string;
  zoom_link: string;
  cancellation_token: string;
  confirmation_token: string;
  member_joined_at: string | null;
};

function fmtWhen(iso: string, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz, weekday: "long", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true, timeZoneName: "short",
  }).format(new Date(iso));
}

function shell(inner: string): string {
  return `<div style="font-family:Georgia,serif;max-width:560px;margin:auto;padding:32px;background:#FBF7EF;color:#1B1B1B;border-radius:16px;">${inner}<p style="color:#999;font-size:12px;margin-top:24px;">TrueForge Health &amp; Wellness</p></div>`;
}

function btn(href: string, label: string, color = "#B8895A"): string {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#FBF7EF;padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:600;letter-spacing:0.02em;">${label}</a>`;
}

async function send(to: string, subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) return { ok: false, error: "RESEND_API_KEY not set" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Resend error:", res.status, text);
    return { ok: false, error: text };
  }
  return { ok: true };
}

function tplPreCall(a: Appt, kind: string): { subject: string; html: string } {
  const when = fmtWhen(a.scheduled_at, a.timezone);
  const confirmUrl = `${APP_URL}/#/book/manage?id=${a.id}&t=${a.confirmation_token}&action=confirm`;
  const cancelUrl = `${APP_URL}/#/book/manage?id=${a.id}&t=${a.cancellation_token}&action=cancel`;
  const headlines: Record<string, { sub: string; head: string; lede: string }> = {
    remind_3d: {
      sub: "Confirm your TrueForge call (3 days out)",
      head: "Your call is in 3 days.",
      lede: "Quick favor — please confirm you're still good for our 15-minute discovery call. One click below.",
    },
    remind_24h: {
      sub: "Reminder: Your TrueForge call is tomorrow",
      head: "See you tomorrow.",
      lede: "Final confirmation. Tap below if you're locked in, or reschedule if life moved.",
    },
    remind_2h: {
      sub: "Your TrueForge call is in 2 hours",
      head: "We're on in 2 hours.",
      lede: "Last check-in before we meet. The Zoom link is below — we'll resend it 10 minutes before too.",
    },
    remind_10m: {
      sub: "Your TrueForge call starts in 10 minutes",
      head: "10 minutes out.",
      lede: "Here's your Zoom link. Grab water, find a quiet spot, and we'll meet you there.",
    },
  };
  const t = headlines[kind] ?? headlines.remind_24h;
  const showZoomBig = kind === "remind_10m" || kind === "remind_2h";
  const inner = `
    <h1 style="font-size:24px;margin:0 0 12px;">${t.head}</h1>
    <p style="color:#444;line-height:1.6;">Hi ${a.first_name || "there"} — ${t.lede}</p>
    <div style="margin:20px 0;padding:18px 20px;background:#FFF;border:1px solid #EFE6D4;border-radius:12px;">
      <p style="margin:0 0 8px;"><strong>When:</strong> ${when}</p>
      <p style="margin:0;"><strong>Zoom:</strong> <a href="${a.zoom_link}" style="color:#A36F43;font-weight:600;">${a.zoom_link}</a></p>
    </div>
    ${showZoomBig
      ? `<p style="margin:24px 0 8px;">${btn(a.zoom_link, "Join Zoom Now", "#1B1B1B")}</p>`
      : `<p style="margin:24px 0 8px;">${btn(confirmUrl, "Confirm Attendance")}</p>`}
    <p style="margin:8px 0 0;font-size:14px;"><a href="${cancelUrl}" style="color:#666;text-decoration:underline;">Need to cancel or reschedule?</a></p>`;
  return { subject: t.sub, html: shell(inner) };
}

function tplPostThanks(a: Appt): { subject: string; html: string } {
  const inner = `
    <h1 style="font-size:24px;margin:0 0 12px;">Thanks for the conversation${a.first_name ? `, ${a.first_name}` : ""}.</h1>
    <p style="color:#444;line-height:1.6;">Whatever you decide next, you came in honest about your goals — that's the part most people skip.</p>
    <p style="color:#444;line-height:1.6;">If you'd like to keep the conversation going or get a written plan, membership unlocks both. No pressure either way.</p>
    <p style="margin:24px 0 8px;">${btn(`${APP_URL}/#/membership`, "See Membership")}</p>
    <p style="color:#666;font-size:13px;line-height:1.5;margin-top:18px;">— The TrueForge Team</p>`;
  return { subject: "Thanks for the conversation", html: shell(inner) };
}

function tplNurture3d(a: Appt): { subject: string; html: string } {
  const inner = `
    <h1 style="font-size:22px;margin:0 0 12px;">Still mulling it over?</h1>
    <p style="color:#444;line-height:1.6;">It's normal. Most TrueForge members took 1–2 weeks to commit. We're not going anywhere.</p>
    <p style="color:#444;line-height:1.6;">If a follow-up call would help, reply to this email and we'll set time aside. If you'd rather start with the membership and skip the back-and-forth, here's the door:</p>
    <p style="margin:24px 0 8px;">${btn(`${APP_URL}/#/membership`, "Start Membership")}</p>
    <p style="color:#666;font-size:13px;line-height:1.5;margin-top:18px;">— The TrueForge Team</p>`;
  return { subject: "Just checking in after our call", html: shell(inner) };
}

function tplNurture7d(a: Appt): { subject: string; html: string } {
  const inner = `
    <h1 style="font-size:22px;margin:0 0 12px;">One last note from me.</h1>
    <p style="color:#444;line-height:1.6;">If TrueForge isn't the right fit, that's a fine answer. But if you've been waiting for a sign to invest in your health — this is it.</p>
    <p style="color:#444;line-height:1.6;">Take the quiz to see exactly where you'd start, or jump straight to membership.</p>
    <p style="margin:24px 0 8px;">
      ${btn(`${APP_URL}/#/quiz`, "Take The Quiz")}
      &nbsp;
      <a href="${APP_URL}/#/membership" style="color:#A36F43;text-decoration:underline;font-weight:600;">Start Membership</a>
    </p>
    <p style="color:#666;font-size:13px;line-height:1.5;margin-top:18px;">— The TrueForge Team</p>`;
  return { subject: "One last note from TrueForge", html: shell(inner) };
}

async function processPreCall(sb: ReturnType<typeof createClient>, kind: "remind_3d" | "remind_24h" | "remind_2h" | "remind_10m", windowStart: Date, windowEnd: Date) {
  const { data, error } = await sb
    .from("appointments")
    .select("id,email,first_name,scheduled_at,timezone,status,zoom_link,confirmation_token,cancellation_token,member_joined_at")
    .gte("scheduled_at", windowStart.toISOString())
    .lt("scheduled_at", windowEnd.toISOString())
    .in("status", ["scheduled", "confirmed"]);
  if (error) {
    console.error("query error", kind, error);
    return 0;
  }
  let sent = 0;
  for (const a of (data ?? []) as Appt[]) {
    const { data: prior } = await sb
      .from("appointment_reminders")
      .select("id")
      .eq("appointment_id", a.id)
      .eq("kind", kind)
      .maybeSingle();
    if (prior) continue;
    const tpl = tplPreCall(a, kind);
    const r = await send(a.email, tpl.subject, tpl.html);
    await sb.from("appointment_reminders").insert({
      appointment_id: a.id, kind, status: r.ok ? "sent" : "failed", error: r.error ?? "",
    });
    if (r.ok) sent++;
  }
  return sent;
}

async function processPostCall(sb: ReturnType<typeof createClient>) {
  const now = new Date();
  const lookback = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const { data } = await sb
    .from("appointments")
    .select("id,email,first_name,scheduled_at,timezone,status,zoom_link,confirmation_token,cancellation_token,member_joined_at")
    .gte("scheduled_at", lookback.toISOString())
    .lte("scheduled_at", now.toISOString())
    .neq("status", "cancelled");

  let sent = 0;
  for (const a of (data ?? []) as Appt[]) {
    if (a.member_joined_at) continue;
    const ageHours = (now.getTime() - new Date(a.scheduled_at).getTime()) / 3600000;
    const stages: { kind: "post_thanks" | "post_nurture_3d" | "post_nurture_7d"; minH: number; tpl: (a: Appt) => { subject: string; html: string } }[] = [
      { kind: "post_thanks", minH: 0.5, tpl: tplPostThanks },
      { kind: "post_nurture_3d", minH: 72, tpl: tplNurture3d },
      { kind: "post_nurture_7d", minH: 168, tpl: tplNurture7d },
    ];
    for (const s of stages) {
      if (ageHours < s.minH) continue;
      const { data: prior } = await sb
        .from("appointment_reminders")
        .select("id")
        .eq("appointment_id", a.id)
        .eq("kind", s.kind)
        .maybeSingle();
      if (prior) continue;
      const tpl = s.tpl(a);
      const r = await send(a.email, tpl.subject, tpl.html);
      await sb.from("appointment_reminders").insert({
        appointment_id: a.id, kind: s.kind, status: r.ok ? "sent" : "failed", error: r.error ?? "",
      });
      if (r.ok) sent++;
    }
  }
  return sent;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  try {
    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
    const now = Date.now();
    const min = 60 * 1000;

    const counts = {
      remind_3d: await processPreCall(sb, "remind_3d", new Date(now + (3 * 24 * 60 - 30) * min), new Date(now + (3 * 24 * 60 + 30) * min)),
      remind_24h: await processPreCall(sb, "remind_24h", new Date(now + (24 * 60 - 30) * min), new Date(now + (24 * 60 + 30) * min)),
      remind_2h: await processPreCall(sb, "remind_2h", new Date(now + (120 - 15) * min), new Date(now + (120 + 15) * min)),
      remind_10m: await processPreCall(sb, "remind_10m", new Date(now + (10 - 5) * min), new Date(now + (10 + 5) * min)),
      post: await processPostCall(sb),
    };

    return new Response(JSON.stringify({ ok: true, counts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("reminders error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
