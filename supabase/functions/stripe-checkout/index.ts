const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const STRIPE_SECRET_KEY = (Deno.env.get("STRIPE_SECRET_KEY") ?? "").trim();
const PRICE_ID = (Deno.env.get("PRICE_ID") ?? "").trim();
const APP_URL = (Deno.env.get("APP_URL") ?? "").trim();

type Body = {
  email?: string;
  first_name?: string;
  last_name?: string;
  appointment_id?: string;
  source?: string;
  siteUrl?: string;
};

function form(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  try {
    if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not set");
    if (!PRICE_ID) throw new Error("PRICE_ID not set");

    const body: Body = await req.json().catch(() => ({}));
    const email = (body.email ?? "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const first_name = (body.first_name ?? "").trim().slice(0, 80);
    const last_name = (body.last_name ?? "").trim().slice(0, 80);
    const siteUrl = (body.siteUrl ?? "").trim() || APP_URL || (req.headers.get("origin") ?? "");
    const base = siteUrl.replace(/\/$/, "");

    const params: Record<string, string> = {
      "mode": "subscription",
      "payment_method_types[0]": "card",
      "line_items[0][price]": PRICE_ID,
      "line_items[0][quantity]": "1",
      "customer_email": email,
      "allow_promotion_codes": "true",
      "subscription_data[metadata][source]": (body.source ?? "membership_page").slice(0, 80),
      "subscription_data[metadata][first_name]": first_name,
      "subscription_data[metadata][last_name]": last_name,
      "metadata[email]": email,
      "metadata[first_name]": first_name,
      "metadata[last_name]": last_name,
      "metadata[appointment_id]": (body.appointment_id ?? "").slice(0, 64),
      "success_url": `${base}/#/portal?welcome=1&session_id={CHECKOUT_SESSION_ID}`,
      "cancel_url": `${base}/#/membership?canceled=1`,
    };

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form(params),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Stripe checkout error", data);
      return new Response(JSON.stringify({ error: data?.error?.message ?? "Stripe error" }), {
        status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ id: data.id, url: data.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("stripe-checkout error", e);
    return new Response(JSON.stringify({ error: String((e as Error).message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
