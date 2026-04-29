import { ArrowRight, Check, Crown, MessageCircle, Stethoscope, ClipboardList, Users, Sparkles, Loader2, ShieldAlert, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from '../lib/router';
import { Eyebrow, H2 } from '../components/Section';
import { EXTERNAL } from '../lib/links';
import { CancellationAccordion } from '../components/LegalNotice';

function MembershipCheckout() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function start(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setError('Please confirm the agreement to continue.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          source: 'membership_page',
          siteUrl: window.location.origin,
          agreements_accepted_at: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.error ?? 'Could not start checkout');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setLoading(false);
    }
  }

  const agreementCheckbox = (
    <label className="flex items-start gap-3 rounded-xl border border-steel-600 bg-steel-700/60 px-4 py-3 text-sm text-cream-100 cursor-pointer hover:border-forge-400/60 transition-colors">
      <input
        type="checkbox"
        required
        checked={agreed}
        onChange={(e) => setAgreed(e.target.checked)}
        className="mt-1 h-4 w-4 accent-forge-500 flex-none"
      />
      <span className="leading-relaxed">
        I have read and agree to the{' '}
        <span className="text-forge-300 underline underline-offset-4">Cancellation Policy</span>,{' '}
        <Link to="/terms" className="text-forge-300 underline underline-offset-4 hover:text-forge-200">Terms of Service</Link>,{' '}
        <Link to="/privacy" className="text-forge-300 underline underline-offset-4 hover:text-forge-200">Privacy Policy</Link>, and{' '}
        <Link to="/disclaimer" className="text-forge-300 underline underline-offset-4 hover:text-forge-200">Medical Disclaimer</Link>.
      </span>
    </label>
  );

  if (!open) {
    return (
      <div className="mt-7 space-y-4">
        <CancellationAccordion tone="dark" />
        {agreementCheckbox}
        <button
          onClick={() => { if (agreed) setOpen(true); }}
          disabled={!agreed}
          className="w-full btn-forge disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Begin Your Journey <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={start} className="mt-7 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name"
          className="px-4 py-3 rounded-xl bg-steel-700 text-cream-50 placeholder:text-cream-200/40 border border-steel-600 focus:outline-none focus:border-forge-400" />
        <input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name"
          className="px-4 py-3 rounded-xl bg-steel-700 text-cream-50 placeholder:text-cream-200/40 border border-steel-600 focus:outline-none focus:border-forge-400" />
      </div>
      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
        className="w-full px-4 py-3 rounded-xl bg-steel-700 text-cream-50 placeholder:text-cream-200/40 border border-steel-600 focus:outline-none focus:border-forge-400" />

      <CancellationAccordion tone="dark" />

      {agreementCheckbox}

      {error && <p className="text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={loading || !agreed} className="w-full btn-forge disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Opening secure checkout...</> : <>Continue to secure checkout <ArrowRight className="w-4 h-4" /></>}
      </button>
      <p className="text-xs text-cream-200/50 text-center">Powered by Stripe. Cancel anytime with 30 days&rsquo; notice.</p>
    </form>
  );
}

const features = [
  { icon: Stethoscope, t: 'Monthly 1:1 Coaching Check-In', d: 'In-depth progress review and personalized plan optimization with your dedicated coach — real human expertise, never a chatbot.' },
  { icon: MessageCircle, t: 'Direct Messaging Support', d: 'Questions answered in hours, not days. Bridge the gap between visits.' },
  { icon: ClipboardList, t: 'Personalized Roadmap', d: 'Built from your intake, labs, and goals. Updated every quarter.' },
  { icon: Crown, t: 'Access To Every Treatment', d: 'GLP, TRT, peptides, sexual wellness, hair, skin, performance — one membership.' },
  { icon: Users, t: 'Coaching & Accountability', d: 'Your team holds the line when you can\'t. Lifestyle, training, food, sleep.' },
  { icon: Sparkles, t: 'Member Pricing On Add-Ons', d: 'Labs, peptides, NAD+, and aesthetic add-ons at member rates.' },
];

export default function Membership() {
  return (
    <>
      <section className="bg-steel-900 text-cream-50 py-24 px-5 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-forge-glow" />
        <div className="container-tf relative grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <Eyebrow>The Membership</Eyebrow>
            <H2 light><span className="text-metallic-gold">$99/month</span>. Everything begins here.</H2>
            <p className="mt-6 text-lg text-cream-200/80">
              One door. One relationship. One team that knows your file and treats you like a human. No bouncing between clinics, no losing context, no getting lost in a chart.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link to="/book" className="btn-forge">Book Your 15-Minute Call <ArrowRight className="w-4 h-4" /></Link>
              <a href={EXTERNAL.founderPay} target="_blank" rel="noreferrer" className="btn-ghost-light">Founders Edition</a>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-metallic-gold/30 via-metallic-gold/10 to-steel-800 p-1">
              <div className="rounded-3xl bg-steel-800 p-10 border border-steel-700" style={{borderImage: 'linear-gradient(135deg, #b8895a 0%, #d4a86a 50%, #8a5a37 100%) 1'}}>
                <div className="flex items-start justify-between gap-3 mb-5">
                  <Crown className="w-10 h-10 text-forge-400" />
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forge-500/15 border border-forge-400/40 text-forge-300 text-[10px] uppercase tracking-[0.2em] font-semibold">
                    <Star className="w-3 h-3" /> <span className="text-metallic-gold">Founders Offer</span>
                  </span>
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-forge-300 mb-3">Core Membership</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-display text-7xl text-metallic-gold">$99</span>
                  <span className="text-metallic-gold text-lg">/month</span>
                </div>
                <ul className="space-y-3">
                  {['Monthly 1:1 coaching check-in', 'Unlimited messaging', 'Personalized roadmap', 'Coaching access', 'Member pricing on labs & meds', 'Cancel anytime'].map((b) => (
                    <li key={b} className="flex items-center gap-3 text-cream-100">
                      <Check className="w-5 h-5 flex-none icon-metallic-gold" strokeWidth={3} />
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-2xl border border-forge-400/40 bg-gradient-to-br from-forge-500/15 via-forge-500/5 to-transparent p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Star className="w-4 h-4 text-forge-300" />
                    <p className="text-xs uppercase tracking-[0.25em] font-semibold"><span className="text-metallic-gold">Founders Offer</span></p>
                  </div>
                  <p className="text-sm text-cream-100/90 leading-relaxed">
                    Missed the $49 lifetime enrollment? <span className="text-cream-50 font-semibold">Don&rsquo;t make the same mistake twice.</span>
                  </p>
                  <p className="mt-2 text-sm text-cream-100/90 leading-relaxed">
                    Your entire first <span className="text-cream-50 font-semibold">$99 monthly membership fee</span> will be credited 100% toward your first coaching package or service upgrade.
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] font-semibold"><span className="text-metallic-gold">First 10 Members Only.</span></p>
                </div>

                <p className="mt-5 flex items-start gap-2 text-[11px] leading-relaxed text-cream-200/60">
                  <ShieldAlert className="w-3.5 h-3.5 text-forge-300/80 mt-0.5 flex-none" />
                  <span>
                    TrueForge provides wellness coaching and educational support &mdash; not medical advice, diagnosis, or treatment. Consult a qualified healthcare provider before changing any health regimen.{' '}
                    <Link to="/disclaimer" className="text-forge-300 underline underline-offset-2 hover:text-forge-200">Read full disclaimer</Link>.
                  </span>
                </p>

                <MembershipCheckout />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf">
          <div className="max-w-3xl mb-14">
            <Eyebrow>What's Inside</Eyebrow>
            <H2>The membership covers the relationship. Treatments are layered on as you need them.</H2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.t} className="card-lift bg-white p-7 rounded-2xl border border-cream-200">
                <div className="w-12 h-12 rounded-xl bg-forge-500/10 flex items-center justify-center mb-5">
                  <f.icon className="w-5 h-5 text-forge-500" />
                </div>
                <h3 className="font-display text-xl mb-2">{f.t}</h3>
                <p className="text-steel-600">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tf max-w-4xl">
          <Eyebrow>How It Works</Eyebrow>
          <H2>Four steps. Two weeks. A different life.</H2>
          <div className="mt-12 space-y-4">
            {[
              { n: '01', t: 'Free 15-minute consult', d: <span>We screen for fit and get clear on what you actually want.</span> },
              { n: '02', t: 'Start membership', d: <span><span className="text-metallic-gold font-semibold">$99/month.</span> Founders edition available.</span> },
              { n: '03', t: 'Intake + labs', d: <span>You complete the patient intake, we order labs if indicated.</span> },
              { n: '04', t: 'Build your stack', d: <span>Clinician designs your protocol. You start. We adjust monthly.</span> },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-6 bg-white p-7 rounded-2xl border border-cream-200">
                <div className="font-display text-4xl text-forge-500">{s.n}</div>
                <div>
                  <h3 className="font-display text-xl text-steel-900">{s.t}</h3>
                  <p className="text-steel-600 mt-1">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf max-w-3xl text-center">
          <H2>Stop renting answers. Own your health.</H2>
          <p className="mt-5 text-steel-600 text-lg"><span className="text-metallic-gold font-semibold">$99/month</span> is less than most people spend on takeout. The difference is what you walk away with twelve months from now.</p>
          <div className="mt-9"><Link to="/book" className="btn-forge">Book Your 15-Minute Call <ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>
    </>
  );
}
