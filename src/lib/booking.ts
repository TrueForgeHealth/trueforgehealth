const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export type Slot = { start: string; end: string; label: string };
export type AvailabilityResponse = { ok: true; timezone: string; days: Record<string, Slot[]> };

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${ANON}`,
  apikey: ANON,
};

export async function fetchAvailability(days = 30): Promise<AvailabilityResponse> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/appointments-availability?days=${days}`, { headers });
  if (!res.ok) throw new Error(`Availability error ${res.status}`);
  return res.json();
}

export type BookInput = {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  goal: string;
  notes?: string;
  scheduled_at: string;
  duration_minutes?: number;
  source?: string;
};

export type BookResponse = {
  ok: true;
  appointment: {
    id: string;
    scheduled_at: string;
    timezone: string;
    zoom_link: string;
    when_label: string;
  };
};

export async function bookAppointment(input: BookInput): Promise<BookResponse> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/appointments-book`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...input, siteUrl: window.location.origin }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Booking failed');
  return data;
}

export type ManageResponse = { ok: true; status: 'confirmed' | 'cancelled' };

export async function manageAppointment(id: string, token: string, action: 'confirm' | 'cancel'): Promise<ManageResponse> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/appointments-manage`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ id, token, action }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Action failed');
  return data;
}

export function formatDayHeader(dateKey: string, tz: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const noon = new Date(Date.UTC(y, m - 1, d, 16));
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'long', month: 'long', day: 'numeric' }).format(noon);
}

export function formatShortDay(dateKey: string, tz: string): { wd: string; mon: string; day: string } {
  const [y, m, d] = dateKey.split('-').map(Number);
  const noon = new Date(Date.UTC(y, m - 1, d, 16));
  return {
    wd: new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }).format(noon),
    mon: new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'short' }).format(noon),
    day: new Intl.DateTimeFormat('en-US', { timeZone: tz, day: 'numeric' }).format(noon),
  };
}
