import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

type Rule = { weekday: number; start_minute: number; end_minute: number; slot_minutes: number; timezone: string };
type Blackout = { starts_at: string; ends_at: string };
type Appt = { scheduled_at: string; duration_minutes: number };
type Slot = { start: string; end: string; label: string };

// Convert a wall-clock time in a given IANA tz to UTC ISO.
// Approach: build the candidate UTC instant, format it in the tz, measure offset, correct.
function zonedDateToUTC(year: number, month: number, day: number, hour: number, minute: number, tz: string): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  // Format guess back in tz to find its wall time.
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(guess).map((p) => [p.type, p.value]));
  const asWall = Date.UTC(
    parseInt(parts.year), parseInt(parts.month) - 1, parseInt(parts.day),
    parseInt(parts.hour) % 24, parseInt(parts.minute), parseInt(parts.second),
  );
  const wantedWall = Date.UTC(year, month - 1, day, hour, minute, 0);
  const offset = asWall - guess.getTime();
  return new Date(wantedWall - offset);
}

// Get weekday (0=Sun..6=Sat) of a UTC date as observed in tz.
function weekdayInTz(d: Date, tz: string): number {
  const wd = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(d);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
}

function ymdInTz(d: Date, tz: string): { y: number; m: number; day: number } {
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" });
  const parts = Object.fromEntries(fmt.formatToParts(d).map((p) => [p.type, p.value]));
  return { y: parseInt(parts.year), m: parseInt(parts.month), day: parseInt(parts.day) };
}

function fmtSlotLabel(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour: "numeric", minute: "2-digit", hour12: true,
  }).format(d);
}

function generateSlots(rules: Rule[], blackouts: Blackout[], booked: Appt[], days: number): Record<string, Slot[]> {
  const out: Record<string, Slot[]> = {};
  if (!rules.length) return out;
  const tz = rules[0].timezone || "America/New_York";
  const now = new Date();
  const minLead = 60 * 60 * 1000; // 1 hour lead time

  const blocked = new Set<number>();
  for (const b of booked) {
    blocked.add(new Date(b.scheduled_at).getTime());
  }

  for (let i = 0; i < days; i++) {
    const cursor = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const { y, m, day } = ymdInTz(cursor, tz);
    const wd = weekdayInTz(cursor, tz);
    const dayRules = rules.filter((r) => r.weekday === wd);
    if (!dayRules.length) continue;

    const slots: Slot[] = [];
    for (const rule of dayRules) {
      for (let mins = rule.start_minute; mins + rule.slot_minutes <= rule.end_minute; mins += rule.slot_minutes) {
        const startUTC = zonedDateToUTC(y, m, day, Math.floor(mins / 60), mins % 60, tz);
        const startMs = startUTC.getTime();
        if (startMs < now.getTime() + minLead) continue;
        if (blocked.has(startMs)) continue;
        const inBlackout = blackouts.some((b) => {
          const bs = new Date(b.starts_at).getTime();
          const be = new Date(b.ends_at).getTime();
          return startMs >= bs && startMs < be;
        });
        if (inBlackout) continue;
        const endUTC = new Date(startMs + rule.slot_minutes * 60 * 1000);
        slots.push({
          start: startUTC.toISOString(),
          end: endUTC.toISOString(),
          label: fmtSlotLabel(startUTC, tz),
        });
      }
    }
    if (slots.length) {
      slots.sort((a, b) => a.start.localeCompare(b.start));
      const dateKey = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      out[dateKey] = slots;
    }
  }
  return out;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const days = Math.min(60, Math.max(7, parseInt(url.searchParams.get("days") ?? "30")));

    const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
    const [{ data: rules }, { data: blackouts }, { data: booked }] = await Promise.all([
      sb.from("availability_rules").select("weekday,start_minute,end_minute,slot_minutes,timezone").eq("active", true),
      sb.from("availability_blackouts").select("starts_at,ends_at").gte("ends_at", new Date().toISOString()),
      sb.from("appointments").select("scheduled_at,duration_minutes")
        .gte("scheduled_at", new Date().toISOString())
        .in("status", ["scheduled", "confirmed"]),
    ]);

    const slotsByDay = generateSlots((rules ?? []) as Rule[], (blackouts ?? []) as Blackout[], (booked ?? []) as Appt[], days);
    const tz = (rules && rules[0]?.timezone) || "America/New_York";

    return new Response(JSON.stringify({ ok: true, timezone: tz, days: slotsByDay }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("availability error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
