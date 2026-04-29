import { useEffect, useState } from 'react';
import {
  Lock, LogOut, User, ShoppingBag, MessageSquare, FileText, Calendar,
  Trash2, Send, Save, ShieldCheck, ArrowRight, Layers, Pill, Sparkles, ExternalLink,
  CheckCircle2, Gift, Award, Flame, TrendingUp,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { Link, useRouter } from '../lib/router';
import { Eyebrow, H2 } from '../components/Section';
import { supabase, CartItem, MemberProfile } from '../lib/supabase';
import { EXTERNAL, QUESTIONNAIRES, QuestionnaireSlug } from '../lib/links';
import { ReferralShare } from '../components/ReferralShare';

type Tab = 'overview' | 'profile' | 'cart' | 'messages' | 'documents' | 'loyalty';

function GateCard() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const fn = mode === 'in' ? signIn : signUp;
    const { error } = await fn(email, password);
    if (error) setErr(error);
    setLoading(false);
  };

  return (
    <section className="min-h-[80vh] bg-steel-900 text-cream-50 flex items-center justify-center px-5 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-forge-glow" />
      <div className="relative w-full max-w-md">
        <div className="bg-steel-800 border border-steel-700 rounded-3xl p-10 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-forge-500/20 border border-forge-500/40 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-forge-300" />
          </div>
          <Eyebrow>Member Portal</Eyebrow>
          <H2 light><span className="text-metallic-gold">Welcome Back.</span></H2>
          <p className="mt-4 text-cream-200/70 text-sm">Sign in to your TrueForge member portal — your file, your cart, your care team.</p>
          <form onSubmit={submit} className="mt-7 space-y-3">
            <input required type="email" placeholder="Member email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-steel-900 border border-steel-700 text-cream-50 focus:border-forge-500 focus:outline-none" />
            <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-steel-900 border border-steel-700 text-cream-50 focus:border-forge-500 focus:outline-none" />
            {err && <p className="text-sm text-red-400">{err}</p>}
            <button disabled={loading} className="w-full btn-forge disabled:opacity-50">{loading ? 'Working...' : mode === 'in' ? 'Sign In' : 'Create Account'}</button>
          </form>
          <div className="mt-5 text-center text-sm text-cream-200/60">
            {mode === 'in' ? (
              <>New here? <button onClick={() => setMode('up')} className="text-forge-300 font-semibold">Create account</button></>
            ) : (
              <>Already a member? <button onClick={() => setMode('in')} className="text-forge-300 font-semibold">Sign in</button></>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfilePanel({ userId, email }: { userId: string; email: string }) {
  const [profile, setProfile] = useState<Partial<MemberProfile>>({
    first_name: '', last_name: '', phone: '', dob: '', state: '', primary_goal: '', notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('member_profiles').select('*').eq('id', userId).maybeSingle();
      if (data) setProfile(data);
      setLoading(false);
    })();
  }, [userId]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const payload = { ...profile, id: userId, updated_at: new Date().toISOString() };
    await supabase.from('member_profiles').upsert(payload);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="text-steel-500">Loading profile...</div>;

  return (
    <div className="bg-white border border-cream-200 rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-2xl text-steel-900">Personal Information</h3>
        <span className="text-xs text-steel-500">{email}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="First name" value={profile.first_name || ''} onChange={(v) => setProfile({ ...profile, first_name: v })} />
        <Field label="Last name" value={profile.last_name || ''} onChange={(v) => setProfile({ ...profile, last_name: v })} />
        <Field label="Phone" value={profile.phone || ''} onChange={(v) => setProfile({ ...profile, phone: v })} />
        <Field label="Date of birth" type="date" value={profile.dob || ''} onChange={(v) => setProfile({ ...profile, dob: v })} />
        <Field label="State" value={profile.state || ''} onChange={(v) => setProfile({ ...profile, state: v })} />
        <Field label="Primary goal" value={profile.primary_goal || ''} onChange={(v) => setProfile({ ...profile, primary_goal: v })} placeholder="e.g. lose 40 lbs, restore energy" />
      </div>
      <div className="mt-4">
        <label className="text-xs uppercase tracking-wider text-steel-500 font-semibold">Notes for your clinician</label>
        <textarea
          value={profile.notes || ''} onChange={(e) => setProfile({ ...profile, notes: e.target.value })}
          rows={4}
          className="mt-2 w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forge-500 focus:outline-none"
          placeholder="Anything you want your care team to know going into your next visit"
        />
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={save} disabled={saving} className="btn-forge"><Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save changes'}</button>
        {saved && <span className="text-forge-600 text-sm">Saved.</span>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-steel-500 font-semibold">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-2 w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forge-500 focus:outline-none" />
    </label>
  );
}

function CartPanel({ userId }: { userId: string }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('cart_items').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    setItems((data || []) as CartItem[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, [userId]);

  const remove = async (id: string) => {
    await supabase.from('cart_items').delete().eq('id', id);
    setItems(items.filter((i) => i.id !== id));
  };

  const total = items.reduce((s, i) => s + i.price, 0);

  if (loading) return <div className="text-steel-500">Loading cart...</div>;

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      <div className="bg-white border border-cream-200 rounded-3xl p-8 shadow-sm">
        <h3 className="font-display text-2xl text-steel-900 mb-2">Prospective Protocols</h3>
        <p className="text-steel-600 text-sm mb-6">A working list of products and stacks you're considering. Bring this to your next consult — your clinician will review fit, dosing, and interactions.</p>

        {items.length === 0 ? (
          <div className="border-2 border-dashed border-cream-200 rounded-2xl p-10 text-center">
            <ShoppingBag className="w-10 h-10 text-steel-400 mx-auto mb-4" />
            <p className="text-steel-600 mb-5">Your cart is empty. Start exploring the member price list to add items.</p>
            <Link to="/member/pricing" className="btn-forge">Browse Member Pricing <ArrowRight className="w-4 h-4" /></Link>
          </div>
        ) : (
          <ul className="divide-y divide-cream-200">
            {items.map((i) => (
              <li key={i.id} className="py-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${i.kind === 'stack' ? 'bg-forge-500/15' : 'bg-cream-200'}`}>
                    {i.kind === 'stack' ? <Layers className="w-5 h-5 text-forge-600" /> : <Pill className="w-5 h-5 text-steel-700" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-steel-900 truncate">{i.product}</p>
                    <p className="text-sm text-steel-500 truncate">{i.concentration}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-steel-500">
                      {i.pharmacy && <span className="uppercase tracking-wider">{i.pharmacy}</span>}
                      {i.category && <span>{i.category}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-display text-xl text-forge-600">${i.price}</span>
                  <button onClick={() => remove(i.id)} className="text-steel-400 hover:text-red-500 transition" aria-label="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className="bg-steel-900 text-cream-50 rounded-3xl p-7 shadow-sm h-fit sticky top-28">
        <p className="text-xs uppercase tracking-[0.3em] text-forge-300 mb-2">Discussion Total</p>
        <p className="font-display text-5xl mb-1">${total}</p>
        <p className="text-cream-200/60 text-sm mb-6">Estimated. Final pricing confirmed by your clinician based on labs and protocol fit.</p>
        <Link to="/book" className="w-full btn-forge mb-3">Bring Cart To Consult <ArrowRight className="w-4 h-4" /></Link>
        <Link to="/member/pricing" className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-cream-50/30 text-cream-100 hover:bg-cream-50 hover:text-steel-900 transition text-sm">
          Add more from price list
        </Link>
        <div className="mt-6 pt-6 border-t border-steel-700 text-xs text-cream-200/60 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-forge-400 mb-2" />
          Saving items here is for planning only. Nothing is purchased or prescribed until your clinician approves it.
        </div>
      </aside>
    </div>
  );
}

type Msg = { id: string; from_role: string; body: string; created_at: string };

function MessagesPanel({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('portal_messages').select('*').eq('user_id', userId).order('created_at', { ascending: true });
      setMessages((data || []) as Msg[]);
    })();
  }, [userId]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    const { data } = await supabase.from('portal_messages').insert({ user_id: userId, from_role: 'member', body }).select('*').maybeSingle();
    if (data) setMessages([...messages, data as Msg]);
    setBody('');
    setSending(false);
  };

  return (
    <div className="bg-white border border-cream-200 rounded-3xl p-8 shadow-sm flex flex-col h-[60vh]">
      <h3 className="font-display text-2xl text-steel-900 mb-1">Care Team Messages</h3>
      <p className="text-steel-600 text-sm mb-6">Non-urgent. Replies typically within one business day. For emergencies, call 911.</p>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.length === 0 ? (
          <p className="text-steel-500 text-center py-12">No messages yet. Drop a note below — your care team will respond soon.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.from_role === 'member' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${m.from_role === 'member' ? 'bg-forge-500 text-cream-50' : 'bg-cream-100 text-steel-800'}`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.body}</p>
                <p className={`text-[10px] mt-1 ${m.from_role === 'member' ? 'text-cream-50/70' : 'text-steel-500'}`}>
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={send} className="mt-5 pt-5 border-t border-cream-200 flex gap-3">
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Type your message..."
          className="flex-1 px-4 py-3 rounded-full border border-cream-200 focus:border-forge-500 focus:outline-none" />
        <button disabled={sending || !body.trim()} className="btn-forge disabled:opacity-50">
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

function DocumentsPanel({ userId, email }: { userId: string; email: string }) {
  const [completed, setCompleted] = useState<Set<QuestionnaireSlug>>(new Set());
  const [busy, setBusy] = useState<QuestionnaireSlug | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from('questionnaire_completions')
      .select('slug, completed_at')
      .eq('user_id', userId)
      .not('completed_at', 'is', null);
    const set = new Set<QuestionnaireSlug>();
    (data || []).forEach((r) => set.add(r.slug as QuestionnaireSlug));
    setCompleted(set);
  };
  useEffect(() => { load(); }, [userId]);

  const markComplete = async (slug: QuestionnaireSlug) => {
    setBusy(slug);
    await supabase.from('questionnaire_completions').insert({
      user_id: userId, email, slug, completed_at: new Date().toISOString(),
    });
    setBusy(null);
    setCompleted(new Set([...completed, slug]));
  };

  const requestNew = async (slug: QuestionnaireSlug) => {
    setBusy(slug);
    await supabase.from('questionnaire_completions').insert({
      user_id: userId, email, slug,
    });
    const next = new Set(completed);
    next.delete(slug);
    setCompleted(next);
    setBusy(null);
  };

  const docs = [
    { t: 'Patient Intake Form', d: 'Hosted securely with our clinical partner.', href: EXTERNAL.intake },
    { t: 'Schedule a Consult', d: 'Book your next clinician visit.', href: '#/book' },
    { t: 'Founders Edition Enrollment', d: 'Lock in legacy pricing.', href: EXTERNAL.founderPay },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-cream-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
          <h3 className="font-display text-2xl text-steel-900">Health Questionnaires</h3>
          <Link to="/questionnaires" className="text-sm text-forge-600 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
            Open full view <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-steel-600 text-sm mb-6">
          Your clinician uses these to design your protocol. Fill out the ones that match your goals — or fill them all to be safe. You can request a fresh copy any time.
        </p>
        <ul className="space-y-3">
          {QUESTIONNAIRES.map((q) => {
            const done = completed.has(q.slug);
            return (
              <li key={q.slug} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-cream-200 hover:border-forge-300 transition">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center ${done ? 'bg-forge-500 text-cream-50' : 'bg-forge-500/10 text-forge-500'}`}>
                    {done ? <CheckCircle2 className="w-5 h-5" /> : <ClipboardListIcon />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-steel-900">{q.title}</p>
                    <p className="text-sm text-steel-500">{q.blurb}</p>
                    {done && <p className="text-xs text-forge-600 font-semibold mt-1">Marked complete</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={q.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-steel-900 text-cream-50 hover:bg-forge-500 transition text-sm font-semibold">
                    Open <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {done ? (
                    <button onClick={() => requestNew(q.slug)} disabled={busy === q.slug} className="px-4 py-2 rounded-full border border-steel-300 text-steel-700 hover:border-steel-800 transition text-sm">
                      {busy === q.slug ? '...' : 'Request new'}
                    </button>
                  ) : (
                    <button onClick={() => markComplete(q.slug)} disabled={busy === q.slug} className="px-4 py-2 rounded-full border border-forge-500 text-forge-600 hover:bg-forge-500 hover:text-cream-50 transition text-sm font-semibold">
                      {busy === q.slug ? '...' : 'Mark done'}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="bg-white border border-cream-200 rounded-3xl p-8 shadow-sm">
        <h3 className="font-display text-2xl text-steel-900 mb-2">Quick Links</h3>
        <p className="text-steel-600 text-sm mb-6">Lab orders and prescription records will appear here once available.</p>
        <ul className="divide-y divide-cream-200">
          {docs.map((d) => (
            <li key={d.t}>
              <a href={d.href} target="_blank" rel="noreferrer" className="flex items-center justify-between py-4 hover:bg-cream-50 -mx-3 px-3 rounded-xl transition">
                <div className="flex items-center gap-4">
                  <FileText className="w-5 h-5 text-forge-500" />
                  <div>
                    <p className="font-medium text-steel-900">{d.t}</p>
                    <p className="text-sm text-steel-500">{d.d}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-steel-400" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ClipboardListIcon() {
  return <FileText className="w-5 h-5" />;
}

type LoyaltyTx = {
  id: string;
  points: number;
  reason: string;
  source: string;
  created_at: string;
};

type LoyaltyData = {
  account: { points_balance: number; points_lifetime: number; tier: string };
  tiers: { id: string; label: string; minLifetime: number }[];
  earnRules: { source: string; points: number; label: string; cadence: string }[];
  redemptions: { points: number; value_usd: number; label: string }[];
  transactions: LoyaltyTx[];
  referral: {
    code: string;
    referralUrl: string;
    clickCount: number;
    shareCount: number;
    signupCount: number;
    conversions: number;
    goal: number;
    goalReached: boolean;
  };
};

function LoyaltyPanel() {
  const [data, setData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data: sess } = await supabase.auth.getSession();
        const token = sess.session?.access_token;
        if (!token) throw new Error('Not signed in');
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/member-loyalty`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ siteUrl: window.location.origin }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || 'Failed to load loyalty data');
        if (!cancelled) setData(json as LoyaltyData);
      } catch (e) {
        if (!cancelled) setErr((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <div className="bg-white border border-cream-200 rounded-3xl p-8 shadow-sm text-steel-500">Loading loyalty...</div>;
  }
  if (err || !data) {
    return (
      <div className="bg-white border border-cream-200 rounded-3xl p-8 shadow-sm">
        <h3 className="font-display text-2xl text-steel-900 mb-2">Forge Rewards</h3>
        <p className="text-red-500 text-sm">{err ?? 'Could not load loyalty data.'}</p>
      </div>
    );
  }

  const { account, tiers, earnRules, redemptions, transactions, referral } = data;
  const tierIdx = Math.max(0, tiers.findIndex((t) => t.id === account.tier));
  const nextTier = tiers[tierIdx + 1];
  const tierLabel = tiers[tierIdx]?.label ?? 'Forge Member';
  const toNext = nextTier ? Math.max(0, nextTier.minLifetime - account.points_lifetime) : 0;
  const tierPct = nextTier
    ? Math.min(100, Math.round(((account.points_lifetime - tiers[tierIdx].minLifetime) / Math.max(1, nextTier.minLifetime - tiers[tierIdx].minLifetime)) * 100))
    : 100;

  const referralPct = Math.min(100, Math.round((referral.conversions / Math.max(1, referral.goal)) * 100));

  return (
    <div className="space-y-6">
      {/* Hero: points + tier */}
      <div className="bg-gradient-to-br from-steel-900 via-steel-800 to-steel-900 text-cream-50 rounded-3xl p-8 md:p-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-forge-500/25 rounded-full blur-3xl" />
        <div className="relative grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-forge-500/15 border border-forge-500/30 text-forge-300 text-xs uppercase tracking-[0.2em]">
              <Flame className="w-3 h-3" /> Forge Rewards
            </div>
            <p className="text-cream-200/70 text-sm uppercase tracking-[0.2em]">Points balance</p>
            <p className="font-display text-6xl md:text-7xl text-metallic mt-1 leading-none">{account.points_balance.toLocaleString()}</p>
            <p className="mt-2 text-cream-200/60 text-sm">{account.points_lifetime.toLocaleString()} lifetime points earned</p>
            <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-steel-800/70 border border-forge-500/30">
              <Award className="w-4 h-4 text-forge-300" />
              <span className="text-sm font-semibold">{tierLabel}</span>
            </div>
          </div>

          <div className="bg-steel-800/60 border border-steel-700 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cream-200/60">Tier Progress</p>
              <TrendingUp className="w-4 h-4 text-forge-300" />
            </div>
            {nextTier ? (
              <>
                <p className="text-cream-50 text-sm">
                  <span className="font-semibold">{toNext.toLocaleString()}</span> points to <span className="text-forge-300">{nextTier.label}</span>
                </p>
                <div className="mt-3 h-2 rounded-full bg-steel-700 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-forge-500 to-forge-300 transition-all duration-700" style={{ width: `${tierPct}%` }} />
                </div>
                <p className="mt-2 text-[11px] text-cream-200/50">Top tier unlocks priority booking & exclusive drops.</p>
              </>
            ) : (
              <p className="text-cream-50 text-sm">You're at the top tier. Welcome to Forge Elite.</p>
            )}
          </div>
        </div>
      </div>

      {/* Earn + Redeem */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-cream-200 rounded-3xl p-7 shadow-sm">
          <h4 className="font-display text-2xl text-steel-900 mb-1">How to earn</h4>
          <p className="text-steel-600 text-sm mb-5">Stack points through everyday membership activity.</p>
          <ul className="space-y-3">
            {earnRules.map((r) => (
              <li key={r.source} className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-cream-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-forge-500/10 text-forge-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-steel-900 truncate">{r.label}</p>
                    <p className="text-xs text-steel-500 capitalize">{r.cadence}</p>
                  </div>
                </div>
                <span className="font-display text-xl text-forge-600 flex-shrink-0">+{r.points}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-cream-200 rounded-3xl p-7 shadow-sm">
          <h4 className="font-display text-2xl text-steel-900 mb-1">Redeem points</h4>
          <p className="text-steel-600 text-sm mb-5">Apply credits at your next visit. Ask your care team to redeem.</p>
          <ul className="space-y-3">
            {redemptions.map((r) => {
              const enough = account.points_balance >= r.points;
              return (
                <li key={r.points} className={`flex items-center justify-between gap-4 p-4 rounded-2xl border ${enough ? 'border-forge-500/40 bg-forge-500/5' : 'border-cream-200'}`}>
                  <div>
                    <p className="font-medium text-steel-900">{r.label}</p>
                    <p className="text-xs text-steel-500">{r.points} pts</p>
                  </div>
                  <span className={`text-sm font-semibold ${enough ? 'text-forge-600' : 'text-steel-400'}`}>
                    {enough ? 'Available' : `${r.points - account.points_balance} more`}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[11px] text-steel-500">Points never expire while your membership is active.</p>
        </div>
      </div>

      {/* Referral block */}
      <div className="bg-gradient-to-br from-steel-900 via-steel-800 to-steel-900 text-cream-50 rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-forge-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-forge-500/15 border border-forge-500/30 text-forge-300 text-xs uppercase tracking-[0.2em]">
            <Gift className="w-3 h-3" /> Referrals
          </div>
          <h4 className="font-display text-2xl md:text-3xl">Earn <span className="text-metallic">250 points</span> per successful referral</h4>
          <p className="mt-2 text-cream-200/70 max-w-xl text-sm">
            Plus, hit {referral.goal} confirmed signups and unlock <span className="text-forge-300 font-semibold">5% off your first coaching package or service upgrade</span>.
          </p>

          <div className="mt-6 grid sm:grid-cols-3 gap-3 max-w-xl">
            <LoyaltyStat label="Confirmed" value={`${referral.conversions} / ${referral.goal}`} />
            <LoyaltyStat label="Signups" value={String(referral.signupCount)} />
            <LoyaltyStat label="Clicks" value={String(referral.clickCount)} />
          </div>

          <div className="mt-5 max-w-xl">
            <div className="h-2 rounded-full bg-steel-700 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-forge-500 to-forge-300 transition-all duration-700" style={{ width: `${referralPct}%` }} />
            </div>
            <p className="mt-2 text-xs text-cream-200/60">
              {referral.goalReached
                ? 'Reward unlocked. Mention it to your care team at your next visit.'
                : `${referral.goal - referral.conversions} more to unlock your bonus reward.`}
            </p>
          </div>

          <ReferralShare referralCode={referral.code} referralUrl={referral.referralUrl} />
        </div>
      </div>

      {/* Activity */}
      <div className="bg-white border border-cream-200 rounded-3xl p-7 shadow-sm">
        <h4 className="font-display text-2xl text-steel-900 mb-1">Recent activity</h4>
        <p className="text-steel-600 text-sm mb-5">Your latest points earned and redeemed.</p>
        {transactions.length === 0 ? (
          <div className="border-2 border-dashed border-cream-200 rounded-2xl p-8 text-center text-steel-500 text-sm">
            No activity yet. Stay active on your protocol — points accrue automatically.
          </div>
        ) : (
          <ul className="divide-y divide-cream-200">
            {transactions.map((t) => (
              <li key={t.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-steel-900 truncate">{t.reason || t.source}</p>
                  <p className="text-xs text-steel-500">{new Date(t.created_at).toLocaleDateString()} - {t.source.replace(/_/g, ' ')}</p>
                </div>
                <span className={`font-display text-lg ${t.points >= 0 ? 'text-forge-600' : 'text-steel-700'}`}>
                  {t.points >= 0 ? '+' : ''}{t.points}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function LoyaltyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-steel-800/60 border border-steel-700 rounded-2xl px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-cream-200/60">{label}</p>
      <p className="font-display text-2xl text-cream-50 mt-1">{value}</p>
    </div>
  );
}

function Overview({ email, cartCount, onTab }: { email: string; cartCount: number; onTab: (t: Tab) => void }) {
  const tiles: { tab: Tab; icon: typeof User; t: string; d: string; chip?: string }[] = [
    { tab: 'profile', icon: User, t: 'Personal Info', d: 'Update your contact, goals, and notes for your clinician.' },
    { tab: 'cart', icon: ShoppingBag, t: 'Prospective Cart', d: 'Save protocols and stacks to discuss at your next visit.', chip: cartCount > 0 ? `${cartCount} item${cartCount === 1 ? '' : 's'}` : undefined },
    { tab: 'messages', icon: MessageSquare, t: 'Care Team', d: 'Send your care team a non-urgent message.' },
    { tab: 'documents', icon: FileText, t: 'Forms & Questionnaires', d: 'Intake, health questionnaires, and quick links.' },
    { tab: 'loyalty', icon: Gift, t: 'Forge Rewards', d: 'Track points, tier, redemptions, and your referral link.' },
  ];
  return (
    <>
      <div className="bg-gradient-to-br from-steel-900 via-steel-800 to-steel-900 text-cream-50 rounded-3xl p-8 md:p-10 mb-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-forge-500/20 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.3em] text-forge-300 mb-2">Welcome back</p>
          <h3 className="font-display text-3xl md:text-4xl">{email}</h3>
          <p className="mt-3 text-cream-200/70 max-w-xl">Your member portal — your file, your cart, your care team. Everything you need between visits.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/member/pricing" className="btn-forge">Browse Member Pricing <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/book" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-cream-50/30 text-cream-50 hover:bg-cream-50 hover:text-steel-900 transition font-semibold">
              <Calendar className="w-4 h-4" /> Book Visit
            </Link>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {tiles.map((t) => (
          <button key={t.tab} onClick={() => onTab(t.tab)} className="text-left card-lift bg-white border border-cream-200 rounded-3xl p-7">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-forge-500/10 flex items-center justify-center">
                <t.icon className="w-5 h-5 text-forge-500" />
              </div>
              {t.chip && <span className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-forge-500 text-cream-50">{t.chip}</span>}
            </div>
            <h4 className="font-display text-xl mb-1 text-steel-900">{t.t}</h4>
            <p className="text-sm text-steel-600">{t.d}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-forge-600 text-sm font-semibold">Open <ArrowRight className="w-3 h-3" /></span>
          </button>
        ))}
      </div>
    </>
  );
}

export default function Portal() {
  const { session, loading, signOut } = useAuth();
  const { path } = useRouter();
  const initial: Tab = path === '/portal/cart' ? 'cart'
    : path === '/portal/profile' ? 'profile'
    : path === '/portal/messages' ? 'messages'
    : path === '/portal/documents' ? 'documents'
    : 'overview';
  const [tab, setTab] = useState<Tab>(initial);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { count } = await supabase.from('cart_items').select('id', { count: 'exact', head: true }).eq('user_id', session.user.id);
      setCartCount(count || 0);
    })();
  }, [session, tab]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-steel-500">Loading...</div>;
  if (!session) return <GateCard />;

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'cart', label: 'Cart', icon: ShoppingBag },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'documents', label: 'Forms', icon: FileText },
    { id: 'loyalty', label: 'Rewards', icon: Gift },
  ];

  return (
    <>
      <section className="bg-steel-900 text-cream-50 py-14 px-5 md:px-10">
        <div className="container-tf">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-forge-500/15 border border-forge-500/30 text-forge-300 text-xs uppercase tracking-[0.2em]">
                <ShieldCheck className="w-3 h-3" /> Member Portal
              </div>
              <H2 light>TrueForge <span className="text-metallic">Portal.</span></H2>
            </div>
            <button onClick={signOut} className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream-50/30 text-cream-100 hover:bg-cream-50 hover:text-steel-900 transition text-sm">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition ${tab === t.id ? 'bg-forge-500 text-cream-50' : 'bg-steel-800 text-cream-200/70 border border-steel-700 hover:border-forge-500'}`}>
                <t.icon className="w-4 h-4" /> {t.label}
                {t.id === 'cart' && cartCount > 0 && (
                  <span className={`ml-1 text-[10px] rounded-full px-2 py-0.5 ${tab === t.id ? 'bg-cream-50 text-forge-600' : 'bg-forge-500 text-cream-50'}`}>{cartCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-50 px-5 md:px-10 py-12 min-h-[60vh]">
        <div className="container-tf">
          {tab === 'overview' && <Overview email={session.user.email || ''} cartCount={cartCount} onTab={setTab} />}
          {tab === 'profile' && <ProfilePanel userId={session.user.id} email={session.user.email || ''} />}
          {tab === 'cart' && <CartPanel userId={session.user.id} />}
          {tab === 'messages' && <MessagesPanel userId={session.user.id} />}
          {tab === 'documents' && <DocumentsPanel userId={session.user.id} email={session.user.email || ''} />}
          {tab === 'loyalty' && <LoyaltyPanel />}
        </div>
      </section>
    </>
  );
}
