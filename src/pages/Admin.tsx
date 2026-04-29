import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, LogOut, Users, Calendar, ClipboardList, ShoppingBag, MessageSquare, FileText, Search, RefreshCw, Lock, ArrowRight, Video, Clock, Plus, Trash2, TrendingUp, Download, CreditCard as Edit2, Check, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { Link, useRouter } from '../lib/router';
import { Eyebrow, H2 } from '../components/Section';
import { supabase } from '../lib/supabase';

type Tab = 'appointments' | 'availability' | 'leads' | 'consultations' | 'quizzes' | 'members' | 'carts' | 'messages' | 'questionnaires' | 'trainers' | 'referrals';

type Trainer = { id: string; name: string; email: string; referral_code: string; custom_reward_percentage: number | null; total_referrals: number; successful_conversions: number; total_rewards_earned: number; created_at: string };
type TrainerReward = { id: string; trainer_id: string; referred_email: string; referred_member_id: string | null; reward_percentage: number; reward_amount: number; membership_fee: number; status: string; created_at: string; trainer_name?: string };
type Trainer_Data = Trainer & { conversion_rate: number };

type Lead = { id: string; email: string; first_name: string; last_name: string; phone: string; source_page: string; interest: string; notes: string; created_at: string };
type Consultation = { id: string; lead_id: string | null; email: string; goal: string; status: string; created_at: string };
type Quiz = { id: string; email: string; recommendation: string; answers: Record<string, unknown>; created_at: string };
type Member = { id: string; first_name: string; last_name: string; phone: string; state: string; primary_goal: string; updated_at: string };
type Cart = { id: string; user_id: string; product: string; concentration: string; pharmacy: string; category: string; price: number; kind: string; created_at: string };
type Msg = { id: string; user_id: string; from_role: string; body: string; created_at: string };
type Qc = { id: string; user_id: string | null; email: string; slug: string; requested_at: string; completed_at: string | null };

const TABS: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'appointments', label: 'Appointments', icon: Video },
  { id: 'availability', label: 'Availability', icon: Clock },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'consultations', label: 'Consultations', icon: Calendar },
  { id: 'quizzes', label: 'Quiz Responses', icon: ClipboardList },
  { id: 'members', label: 'Members', icon: ShieldCheck },
  { id: 'carts', label: 'Carts', icon: ShoppingBag },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'questionnaires', label: 'Questionnaires', icon: FileText },
  { id: 'trainers', label: 'Trainers', icon: Users },
  { id: 'referrals', label: 'Referrals', icon: TrendingUp },
];

export default function Admin() {
  const { session, loading, isAdmin, signOut } = useAuth();
  const { navigate } = useRouter();
  const [tab, setTab] = useState<Tab>('appointments');
  const [q, setQ] = useState('');

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-steel-500">Loading...</div>;
  }
  if (!session) {
    return (
      <section className="min-h-[70vh] bg-steel-900 text-cream-50 flex items-center justify-center px-5 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-forge-glow opacity-60" />
        <div className="relative max-w-md w-full bg-steel-800 border border-steel-700 rounded-3xl p-10 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-forge-500/20 border border-forge-500/40 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-forge-300" />
          </div>
          <Eyebrow>Admin Console</Eyebrow>
          <H2 light>Sign in <span className="text-metallic">required.</span></H2>
          <p className="mt-3 text-cream-200/70 text-sm">This area is restricted to TrueForge admins.</p>
          <button onClick={() => navigate('/login')} className="mt-6 btn-forge w-full">Go to Sign In <ArrowRight className="w-4 h-4" /></button>
        </div>
      </section>
    );
  }
  if (!isAdmin) {
    return (
      <section className="min-h-[70vh] bg-cream-50 flex items-center justify-center px-5 py-24">
        <div className="max-w-md w-full bg-white border border-cream-200 rounded-3xl p-10 shadow-xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-forge-500/10 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-6 h-6 text-forge-500" />
          </div>
          <Eyebrow>Admin Console</Eyebrow>
          <H2>Not authorized.</H2>
          <p className="mt-3 text-steel-600 text-sm">Your account ({session.user.email}) does not have admin access. Ask the system owner to add you to the <code className="px-1.5 py-0.5 rounded bg-cream-100 text-steel-800 text-xs">admin_users</code> table.</p>
          <Link to="/portal" className="mt-6 btn-forge w-full">Go to Member Portal <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-steel-900 text-cream-50 py-14 px-5 md:px-10">
        <div className="container-tf">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full bg-forge-500/15 border border-forge-500/30 text-forge-300 text-xs uppercase tracking-[0.2em]">
                <ShieldCheck className="w-3 h-3" /> Admin Console
              </div>
              <H2 light>TrueForge <span className="text-metallic">Admin.</span></H2>
              <p className="mt-3 text-cream-200/70 text-sm">Signed in as {session.user.email}</p>
            </div>
            <button onClick={signOut} className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream-50/30 text-cream-100 hover:bg-cream-50 hover:text-steel-900 transition text-sm">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition ${tab === t.id ? 'bg-forge-500 text-cream-50' : 'bg-steel-800 text-cream-200/70 border border-steel-700 hover:border-forge-500'}`}>
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream-50 px-5 md:px-10 py-12 min-h-[60vh]">
        <div className="container-tf">
          <div className="mb-6 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-steel-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by any field..."
              className="w-full pl-11 pr-4 py-3 rounded-full border border-cream-200 bg-white focus:border-forge-500 focus:outline-none text-sm" />
          </div>
          {tab === 'appointments' && <AppointmentsTable q={q} />}
          {tab === 'availability' && <AvailabilityPanel />}
          {tab === 'leads' && <LeadsTable q={q} />}
          {tab === 'consultations' && <ConsultationsTable q={q} />}
          {tab === 'quizzes' && <QuizzesTable q={q} />}
          {tab === 'members' && <MembersTable q={q} />}
          {tab === 'carts' && <CartsTable q={q} />}
          {tab === 'messages' && <MessagesTable q={q} />}
          {tab === 'questionnaires' && <QuestionnairesTable q={q} />}
          {tab === 'trainers' && <TrainersTable q={q} />}
          {tab === 'referrals' && <ReferralsAnalytics q={q} />}
        </div>
      </section>
    </>
  );
}

function useTable<T>(table: string, order = 'created_at') {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from(table).select('*').order(order, { ascending: false }).limit(500);
    if (error) setError(error.message);
    setRows((data || []) as T[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [table]);
  return { rows, loading, error, reload: load };
}

function TableShell({ title, count, loading, error, onReload, children, empty }: { title: string; count: number; loading: boolean; error: string | null; onReload: () => void; children: React.ReactNode; empty: string }) {
  return (
    <div className="bg-white border border-cream-200 rounded-3xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-cream-200">
        <div>
          <h3 className="font-display text-xl text-steel-900">{title}</h3>
          <p className="text-xs text-steel-500">{loading ? 'Loading...' : `${count} row${count === 1 ? '' : 's'}`}</p>
        </div>
        <button onClick={onReload} className="inline-flex items-center gap-2 text-sm text-steel-600 hover:text-forge-600 transition">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>
      {error && <div className="p-5 bg-red-50 text-red-700 text-sm border-b border-red-100">{error}</div>}
      {!loading && count === 0 ? (
        <div className="p-10 text-center text-steel-500 text-sm">{empty}</div>
      ) : (
        <div className="overflow-x-auto">{children}</div>
      )}
    </div>
  );
}

function fmt(d: string) { return new Date(d).toLocaleString(); }
function match(q: string, ...fields: (string | number | null | undefined)[]) {
  if (!q) return true;
  const s = q.toLowerCase();
  return fields.some((f) => String(f ?? '').toLowerCase().includes(s));
}

function LeadsTable({ q }: { q: string }) {
  const { rows, loading, error, reload } = useTable<Lead>('leads');
  const filtered = useMemo(() => rows.filter((r) => match(q, r.email, r.first_name, r.last_name, r.phone, r.interest, r.source_page, r.notes)), [rows, q]);
  return (
    <TableShell title="Leads" count={filtered.length} loading={loading} error={error} onReload={reload} empty="No leads captured yet.">
      <table className="w-full text-sm">
        <thead className="bg-cream-50 text-steel-500 uppercase text-xs tracking-wider">
          <tr>
            <Th>Created</Th><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Interest</Th><Th>Source</Th><Th>Notes</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="border-t border-cream-200 hover:bg-cream-50">
              <Td>{fmt(r.created_at)}</Td>
              <Td>{[r.first_name, r.last_name].filter(Boolean).join(' ') || '-'}</Td>
              <Td>{r.email || '-'}</Td>
              <Td>{r.phone || '-'}</Td>
              <Td>{r.interest || '-'}</Td>
              <Td>{r.source_page || '-'}</Td>
              <Td className="max-w-xs truncate">{r.notes || '-'}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function ConsultationsTable({ q }: { q: string }) {
  const { rows, loading, error, reload } = useTable<Consultation>('consultations');
  const filtered = useMemo(() => rows.filter((r) => match(q, r.email, r.goal, r.status)), [rows, q]);
  return (
    <TableShell title="Consultations" count={filtered.length} loading={loading} error={error} onReload={reload} empty="No consultations booked yet.">
      <table className="w-full text-sm">
        <thead className="bg-cream-50 text-steel-500 uppercase text-xs tracking-wider">
          <tr><Th>Created</Th><Th>Email</Th><Th>Goal</Th><Th>Status</Th><Th>Lead</Th></tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="border-t border-cream-200 hover:bg-cream-50">
              <Td>{fmt(r.created_at)}</Td>
              <Td>{r.email || '-'}</Td>
              <Td className="max-w-xs truncate">{r.goal || '-'}</Td>
              <Td><span className="px-2 py-0.5 rounded-full bg-forge-500/10 text-forge-600 text-xs font-semibold">{r.status}</span></Td>
              <Td className="font-mono text-xs text-steel-500">{r.lead_id?.slice(0, 8) || '-'}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function QuizzesTable({ q }: { q: string }) {
  const { rows, loading, error, reload } = useTable<Quiz>('quiz_responses');
  const filtered = useMemo(() => rows.filter((r) => match(q, r.email, r.recommendation)), [rows, q]);
  return (
    <TableShell title="Quiz Responses" count={filtered.length} loading={loading} error={error} onReload={reload} empty="No quiz responses yet.">
      <table className="w-full text-sm">
        <thead className="bg-cream-50 text-steel-500 uppercase text-xs tracking-wider">
          <tr><Th>Created</Th><Th>Email</Th><Th>Recommendation</Th><Th>Answers</Th></tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="border-t border-cream-200 hover:bg-cream-50 align-top">
              <Td>{fmt(r.created_at)}</Td>
              <Td>{r.email || '-'}</Td>
              <Td>{r.recommendation || '-'}</Td>
              <Td><pre className="text-xs bg-cream-50 rounded-lg p-2 max-w-md overflow-x-auto">{JSON.stringify(r.answers, null, 2)}</pre></Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function MembersTable({ q }: { q: string }) {
  const { rows, loading, error, reload } = useTable<Member>('member_profiles', 'updated_at');
  const filtered = useMemo(() => rows.filter((r) => match(q, r.first_name, r.last_name, r.phone, r.state, r.primary_goal)), [rows, q]);
  return (
    <TableShell title="Member Profiles" count={filtered.length} loading={loading} error={error} onReload={reload} empty="No members yet.">
      <table className="w-full text-sm">
        <thead className="bg-cream-50 text-steel-500 uppercase text-xs tracking-wider">
          <tr><Th>Updated</Th><Th>Name</Th><Th>Phone</Th><Th>State</Th><Th>Primary Goal</Th><Th>User ID</Th></tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="border-t border-cream-200 hover:bg-cream-50">
              <Td>{fmt(r.updated_at)}</Td>
              <Td>{[r.first_name, r.last_name].filter(Boolean).join(' ') || '-'}</Td>
              <Td>{r.phone || '-'}</Td>
              <Td>{r.state || '-'}</Td>
              <Td className="max-w-xs truncate">{r.primary_goal || '-'}</Td>
              <Td className="font-mono text-xs text-steel-500">{r.id.slice(0, 8)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function CartsTable({ q }: { q: string }) {
  const { rows, loading, error, reload } = useTable<Cart>('cart_items');
  const filtered = useMemo(() => rows.filter((r) => match(q, r.product, r.concentration, r.pharmacy, r.category, r.kind)), [rows, q]);
  return (
    <TableShell title="Cart Items" count={filtered.length} loading={loading} error={error} onReload={reload} empty="No cart items yet.">
      <table className="w-full text-sm">
        <thead className="bg-cream-50 text-steel-500 uppercase text-xs tracking-wider">
          <tr><Th>Created</Th><Th>User</Th><Th>Kind</Th><Th>Product</Th><Th>Concentration</Th><Th>Pharmacy</Th><Th>Category</Th><Th>Price</Th></tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="border-t border-cream-200 hover:bg-cream-50">
              <Td>{fmt(r.created_at)}</Td>
              <Td className="font-mono text-xs text-steel-500">{r.user_id.slice(0, 8)}</Td>
              <Td>{r.kind}</Td>
              <Td>{r.product}</Td>
              <Td>{r.concentration || '-'}</Td>
              <Td>{r.pharmacy || '-'}</Td>
              <Td>{r.category || '-'}</Td>
              <Td className="font-display text-forge-600">${r.price}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function MessagesTable({ q }: { q: string }) {
  const { rows, loading, error, reload } = useTable<Msg>('portal_messages');
  const filtered = useMemo(() => rows.filter((r) => match(q, r.body, r.from_role)), [rows, q]);
  return (
    <TableShell title="Portal Messages" count={filtered.length} loading={loading} error={error} onReload={reload} empty="No portal messages yet.">
      <table className="w-full text-sm">
        <thead className="bg-cream-50 text-steel-500 uppercase text-xs tracking-wider">
          <tr><Th>Created</Th><Th>User</Th><Th>From</Th><Th>Body</Th></tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="border-t border-cream-200 hover:bg-cream-50 align-top">
              <Td>{fmt(r.created_at)}</Td>
              <Td className="font-mono text-xs text-steel-500">{r.user_id.slice(0, 8)}</Td>
              <Td><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.from_role === 'member' ? 'bg-cream-200 text-steel-700' : 'bg-forge-500/10 text-forge-600'}`}>{r.from_role}</span></Td>
              <Td className="max-w-xl whitespace-pre-wrap">{r.body}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function QuestionnairesTable({ q }: { q: string }) {
  const { rows, loading, error, reload } = useTable<Qc>('questionnaire_completions');
  const filtered = useMemo(() => rows.filter((r) => match(q, r.email, r.slug)), [rows, q]);
  return (
    <TableShell title="Questionnaire Completions" count={filtered.length} loading={loading} error={error} onReload={reload} empty="No questionnaire activity yet.">
      <table className="w-full text-sm">
        <thead className="bg-cream-50 text-steel-500 uppercase text-xs tracking-wider">
          <tr><Th>Requested</Th><Th>Completed</Th><Th>Slug</Th><Th>Email</Th><Th>User</Th></tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r.id} className="border-t border-cream-200 hover:bg-cream-50">
              <Td>{fmt(r.requested_at)}</Td>
              <Td>{r.completed_at ? <span className="text-forge-600 font-semibold">{fmt(r.completed_at)}</span> : <span className="text-steel-400">Pending</span>}</Td>
              <Td>{r.slug || '-'}</Td>
              <Td>{r.email || '-'}</Td>
              <Td className="font-mono text-xs text-steel-500">{r.user_id?.slice(0, 8) || '-'}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

type Appointment = {
  id: string; email: string; first_name: string; last_name: string; phone: string;
  goal: string; scheduled_at: string; duration_minutes: number; status: string;
  zoom_link: string; kind: string; timezone: string; created_at: string;
};
type AvailabilityRule = {
  id: string; weekday: number; start_minute: number; end_minute: number;
  slot_minutes: number; timezone: string; active: boolean;
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function fmtAppt(iso: string, tz: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz, weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(new Date(iso));
}
function minutesToHHMM(m: number) {
  const h = Math.floor(m / 60); const mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}
function hhmmToMinutes(s: string) {
  const [h, m] = s.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function AppointmentsTable({ q }: { q: string }) {
  const { rows, loading, error, reload } = useTable<Appointment>('appointments', 'scheduled_at');
  const [updating, setUpdating] = useState<string | null>(null);
  const filtered = useMemo(() =>
    rows.filter((r) => match(q, r.email, r.first_name, r.last_name, r.phone, r.goal, r.status, r.kind)),
    [rows, q]);

  const upcoming = filtered.filter((r) => new Date(r.scheduled_at).getTime() >= Date.now() - 60 * 60 * 1000);
  const past = filtered.filter((r) => new Date(r.scheduled_at).getTime() < Date.now() - 60 * 60 * 1000);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await supabase.from('appointments').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    setUpdating(null);
    reload();
  };

  return (
    <div className="space-y-6">
      <ApptSection title="Upcoming" appts={upcoming} loading={loading} error={error} onReload={reload} updating={updating} updateStatus={updateStatus} empty="No upcoming appointments." />
      <ApptSection title="Past & cancelled" appts={past} loading={loading} error={null} onReload={reload} updating={updating} updateStatus={updateStatus} empty="No past appointments." muted />
    </div>
  );
}

function ApptSection({ title, appts, loading, error, onReload, updating, updateStatus, empty, muted }: {
  title: string; appts: Appointment[]; loading: boolean; error: string | null; onReload: () => void;
  updating: string | null; updateStatus: (id: string, status: string) => void; empty: string; muted?: boolean;
}) {
  return (
    <TableShell title={title} count={appts.length} loading={loading} error={error} onReload={onReload} empty={empty}>
      <table className="w-full text-sm">
        <thead className="bg-cream-50 text-steel-500 uppercase text-xs tracking-wider">
          <tr>
            <Th>When</Th><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Goal</Th><Th>Status</Th><Th>Zoom</Th><Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {appts.map((a) => (
            <tr key={a.id} className={`border-t border-cream-200 hover:bg-cream-50 ${muted ? 'opacity-70' : ''}`}>
              <Td>{fmtAppt(a.scheduled_at, a.timezone)}</Td>
              <Td>{[a.first_name, a.last_name].filter(Boolean).join(' ') || '-'}</Td>
              <Td>{a.email}</Td>
              <Td>{a.phone || '-'}</Td>
              <Td className="max-w-xs truncate">{a.goal || '-'}</Td>
              <Td><StatusPill status={a.status} /></Td>
              <Td>{a.zoom_link ? <a href={a.zoom_link} target="_blank" rel="noreferrer" className="text-forge-600 underline text-xs">Open</a> : '-'}</Td>
              <Td>
                <div className="flex gap-1.5">
                  {a.status !== 'completed' && (
                    <button disabled={updating === a.id} onClick={() => updateStatus(a.id, 'completed')} className="px-2 py-1 rounded-md text-xs bg-forge-500/10 text-forge-700 hover:bg-forge-500/20 disabled:opacity-50">Complete</button>
                  )}
                  {a.status !== 'cancelled' && (
                    <button disabled={updating === a.id} onClick={() => updateStatus(a.id, 'cancelled')} className="px-2 py-1 rounded-md text-xs bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50">Cancel</button>
                  )}
                  {a.status !== 'no_show' && new Date(a.scheduled_at).getTime() < Date.now() && (
                    <button disabled={updating === a.id} onClick={() => updateStatus(a.id, 'no_show')} className="px-2 py-1 rounded-md text-xs bg-cream-100 text-steel-700 hover:bg-cream-200 disabled:opacity-50">No-show</button>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableShell>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    scheduled: 'bg-cream-200 text-steel-700',
    confirmed: 'bg-forge-500/15 text-forge-700',
    completed: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-700',
    no_show: 'bg-amber-100 text-amber-800',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status] ?? 'bg-cream-100 text-steel-600'}`}>{status}</span>;
}

function AvailabilityPanel() {
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState({ weekday: 1, start: '16:00', end: '20:00', slot: 15 });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('availability_rules').select('*').order('weekday').order('start_minute');
    if (error) setError(error.message);
    setRules((data ?? []) as AvailabilityRule[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const startMin = hhmmToMinutes(draft.start);
    const endMin = hhmmToMinutes(draft.end);
    if (endMin <= startMin) {
      setError('End must be after start.');
      setSaving(false);
      return;
    }
    const { error } = await supabase.from('availability_rules').insert({
      weekday: draft.weekday, start_minute: startMin, end_minute: endMin,
      slot_minutes: draft.slot, timezone: 'America/New_York', active: true,
    });
    if (error) setError(error.message);
    setSaving(false);
    load();
  };

  const toggleActive = async (r: AvailabilityRule) => {
    await supabase.from('availability_rules').update({ active: !r.active }).eq('id', r.id);
    load();
  };

  const removeRule = async (id: string) => {
    await supabase.from('availability_rules').delete().eq('id', id);
    load();
  };

  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
      <div className="bg-white border border-cream-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-cream-200">
          <div>
            <h3 className="font-display text-xl text-steel-900">Weekly availability</h3>
            <p className="text-xs text-steel-500">{loading ? 'Loading...' : `${rules.length} rule${rules.length === 1 ? '' : 's'} (America/New_York)`}</p>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 text-sm text-steel-600 hover:text-forge-600 transition">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
        {error && <div className="p-4 bg-red-50 text-red-700 text-sm border-b border-red-100">{error}</div>}
        <table className="w-full text-sm">
          <thead className="bg-cream-50 text-steel-500 uppercase text-xs tracking-wider">
            <tr><Th>Day</Th><Th>Start</Th><Th>End</Th><Th>Slot</Th><Th>Status</Th><Th></Th></tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} className="border-t border-cream-200">
                <Td>{WEEKDAYS[r.weekday]}</Td>
                <Td>{minutesToHHMM(r.start_minute)}</Td>
                <Td>{minutesToHHMM(r.end_minute)}</Td>
                <Td>{r.slot_minutes} min</Td>
                <Td>
                  <button onClick={() => toggleActive(r)} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${r.active ? 'bg-forge-500/15 text-forge-700' : 'bg-cream-200 text-steel-600'}`}>
                    {r.active ? 'Active' : 'Paused'}
                  </button>
                </Td>
                <Td>
                  <button onClick={() => removeRule(r.id)} className="text-red-600 hover:text-red-700 inline-flex items-center gap-1 text-xs">
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </Td>
              </tr>
            ))}
            {rules.length === 0 && !loading && (
              <tr><td colSpan={6} className="p-10 text-center text-steel-500 text-sm">No rules yet. Add one to open up your calendar.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={addRule} className="bg-steel-900 text-cream-50 rounded-3xl p-7 shadow-sm h-fit">
        <p className="text-xs uppercase tracking-[0.25em] text-forge-300">Add Window</p>
        <h3 className="font-display text-2xl mt-1 mb-5">New availability rule</h3>
        <label className="block text-xs uppercase tracking-wider text-cream-200/70 mb-1">Day</label>
        <select value={draft.weekday} onChange={(e) => setDraft({ ...draft, weekday: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl bg-steel-800 border border-steel-700 text-cream-50 mb-3">
          {WEEKDAYS.map((w, i) => <option key={i} value={i}>{w}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-200/70 mb-1">Start</label>
            <input type="time" value={draft.start} onChange={(e) => setDraft({ ...draft, start: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-steel-800 border border-steel-700 text-cream-50" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-cream-200/70 mb-1">End</label>
            <input type="time" value={draft.end} onChange={(e) => setDraft({ ...draft, end: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-steel-800 border border-steel-700 text-cream-50" />
          </div>
        </div>
        <label className="block text-xs uppercase tracking-wider text-cream-200/70 mb-1">Slot length</label>
        <select value={draft.slot} onChange={(e) => setDraft({ ...draft, slot: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl bg-steel-800 border border-steel-700 text-cream-50 mb-5">
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={45}>45 minutes</option>
          <option value={60}>60 minutes</option>
        </select>
        <button disabled={saving} className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-forge-500 hover:bg-forge-600 text-cream-50 font-semibold transition disabled:opacity-50">
          <Plus className="w-4 h-4" /> {saving ? 'Saving...' : 'Add Rule'}
        </button>
        <p className="mt-4 text-[11px] text-cream-200/50 leading-relaxed">Times are stored in <strong>America/New_York</strong>. Existing bookings are not affected if you change rules later.</p>
      </form>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left font-semibold px-4 py-3 whitespace-nowrap">{children}</th>;
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-steel-700 whitespace-nowrap ${className}`}>{children}</td>;
}

// ========== TRAINERS MANAGEMENT ==========
function TrainersTable({ q }: { q: string }) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Trainer> | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrainer, setNewTrainer] = useState({ name: '', email: '', referral_code: '', custom_reward_percentage: null as number | null });
  const [addError, setAddError] = useState<string | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('trainers').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message);
    setTrainers((data || []) as Trainer[]);
    setLoading(false);
  };

  const addNewTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSubmitting(true);

    // Validate
    if (!newTrainer.name.trim()) {
      setAddError('Name is required');
      setAddSubmitting(false);
      return;
    }
    if (!newTrainer.email.trim()) {
      setAddError('Email is required');
      setAddSubmitting(false);
      return;
    }
    if (!newTrainer.referral_code.trim()) {
      setAddError('Referral code is required');
      setAddSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from('trainers').insert([{
        name: newTrainer.name.trim(),
        email: newTrainer.email.trim(),
        referral_code: newTrainer.referral_code.trim(),
        custom_reward_percentage: newTrainer.custom_reward_percentage,
      }]);

      if (error) throw error;

      await loadTrainers();
      setShowAddForm(false);
      setNewTrainer({ name: '', email: '', referral_code: '', custom_reward_percentage: null });
    } catch (err) {
      setAddError((err as Error).message);
    } finally {
      setAddSubmitting(false);
    }
  };

  const startEdit = (trainer: Trainer) => {
    setEditId(trainer.id);
    setEditData({ ...trainer });
  };

  const saveEdit = async () => {
    if (!editId || !editData) return;
    try {
      const { error } = await supabase.from('trainers').update(editData).eq('id', editId);
      if (error) throw error;
      await loadTrainers();
      setEditId(null);
      setEditData(null);
    } catch (err) {
      alert('Error saving: ' + (err as Error).message);
    }
  };

  const generateNewCode = async (trainerId: string) => {
    const newCode = 'tf_' + Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      const { error } = await supabase.from('trainers').update({ referral_code: newCode }).eq('id', trainerId);
      if (error) throw error;
      await loadTrainers();
    } catch (err) {
      alert('Error generating code: ' + (err as Error).message);
    }
  };

  const filtered = trainers.filter(t =>
    t.name.toLowerCase().includes(q.toLowerCase()) ||
    t.email.toLowerCase().includes(q.toLowerCase()) ||
    t.referral_code.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {showAddForm && (
        <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm">
          <h3 className="font-semibold text-steel-900 mb-4">Add New Trainer</h3>
          <form onSubmit={addNewTrainer} className="space-y-4">
            {addError && <p className="text-red-600 text-sm font-medium">{addError}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-steel-600 mb-2">Name *</label>
                <input type="text" value={newTrainer.name} onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })} className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-forge-500 bg-white" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-steel-600 mb-2">Email *</label>
                <input type="email" value={newTrainer.email} onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })} className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-forge-500 bg-white" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-steel-600 mb-2">Referral Code *</label>
                <input type="text" value={newTrainer.referral_code} onChange={(e) => setNewTrainer({ ...newTrainer, referral_code: e.target.value })} placeholder="e.g., tf_ABC123" className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-forge-500 bg-white" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-steel-600 mb-2">Custom Reward % (optional)</label>
                <input type="number" step="0.01" min="0" max="100" value={newTrainer.custom_reward_percentage || ''} onChange={(e) => setNewTrainer({ ...newTrainer, custom_reward_percentage: e.target.value ? parseFloat(e.target.value) : null })} placeholder="Leave blank for 15% default" className="w-full px-3 py-2 border border-cream-200 rounded-lg focus:outline-none focus:border-forge-500 bg-white" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={addSubmitting} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-forge-500 text-white hover:bg-forge-600 disabled:opacity-50 font-medium text-sm">
                <Plus className="w-4 h-4" /> {addSubmitting ? 'Adding...' : 'Add Trainer'}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-cream-200 text-steel-700 hover:bg-cream-50 font-medium text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showAddForm && (
        <div className="mb-4">
          <button onClick={() => setShowAddForm(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-forge-500 text-white hover:bg-forge-600 font-medium text-sm">
            <Plus className="w-4 h-4" /> Add Trainer
          </button>
        </div>
      )}
      <TableShell title="Trainers" count={filtered.length} loading={loading} error={error} onReload={loadTrainers} empty="No trainers yet. Add one above.">
        <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-cream-100 border-b border-cream-200">
            <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Referral Code</Th>
            <Th>Reward %</Th>
            <Th>Referrals</Th>
            <Th>Conversions</Th>
            <Th>Earned</Th>
            <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-cream-100/50">
                {editId === t.id ? (
                  <>
                    <Td><input type="text" value={editData?.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="px-2 py-1 border rounded bg-white" /></Td>
                    <Td><input type="email" value={editData?.email || ''} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="px-2 py-1 border rounded bg-white" /></Td>
                    <Td>
                      <div className="flex gap-2 items-center">
                        <input type="text" value={editData?.referral_code || ''} onChange={(e) => setEditData({ ...editData, referral_code: e.target.value })} className="px-2 py-1 border rounded bg-white w-24" />
                        <button onClick={() => generateNewCode(t.id)} className="text-xs px-2 py-1 rounded bg-steel-500 text-white hover:bg-steel-600 whitespace-nowrap">Generate</button>
                      </div>
                    </Td>
                    <Td><input type="number" step="0.01" value={editData?.custom_reward_percentage || ''} onChange={(e) => setEditData({ ...editData, custom_reward_percentage: e.target.value ? parseFloat(e.target.value) : null })} className="px-2 py-1 border rounded bg-white w-20" placeholder="15" /></Td>
                    <Td>{t.total_referrals}</Td>
                    <Td>{t.successful_conversions}</Td>
                    <Td>${t.total_rewards_earned.toFixed(2)}</Td>
                    <Td className="flex gap-2">
                      <button onClick={saveEdit} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-forge-500 text-white text-xs hover:bg-forge-600"><Check className="w-3 h-3" /> Save</button>
                      <button onClick={() => setEditId(null)} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-steel-300 text-steel-800 text-xs hover:bg-steel-400"><X className="w-3 h-3" /> Cancel</button>
                    </Td>
                  </>
                ) : (
                  <>
                    <Td>{t.name}</Td>
                    <Td>{t.email}</Td>
                    <Td className="font-mono text-xs bg-steel-100 px-2 py-1 rounded">{t.referral_code}</Td>
                    <Td>{t.custom_reward_percentage ? t.custom_reward_percentage.toFixed(1) : '15.0'}%</Td>
                    <Td>{t.total_referrals}</Td>
                    <Td>{t.successful_conversions}</Td>
                    <Td>${t.total_rewards_earned.toFixed(2)}</Td>
                    <Td><button onClick={() => startEdit(t)} className="inline-flex items-center gap-1 px-3 py-1 rounded bg-forge-100 text-forge-700 text-xs hover:bg-forge-200"><Edit2 className="w-3 h-3" /> Edit</button></Td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </TableShell>
    </div>
  );
}

// ========== REFERRALS ANALYTICS ==========
function ReferralsAnalytics({ q }: { q: string }) {
  const [trainers, setTrainers] = useState<Trainer_Data[]>([]);
  const [rewards, setRewards] = useState<TrainerReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [trainersRes, rewardsRes] = await Promise.all([
        supabase.from('trainers').select('*').order('total_rewards_earned', { ascending: false }),
        supabase.from('trainer_referral_rewards').select('*,trainer_id').order('created_at', { ascending: false }),
      ]);

      if (trainersRes.error) throw trainersRes.error;
      if (rewardsRes.error) throw rewardsRes.error;

      const trainersData = (trainersRes.data || []) as Trainer[];
      const rewardsData = (rewardsRes.data || []) as TrainerReward[];

      // Add conversion rate to trainers
      const enrichedTrainers: Trainer_Data[] = trainersData.map(t => ({
        ...t,
        conversion_rate: t.total_referrals > 0 ? (t.successful_conversions / t.total_referrals) * 100 : 0,
      }));

      // Map trainer names to rewards
      const enrichedRewards = rewardsData.map(r => ({
        ...r,
        trainer_name: enrichedTrainers.find(t => t.id === r.trainer_id)?.name || 'Unknown',
      }));

      setTrainers(enrichedTrainers);
      setRewards(enrichedRewards);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const totalReferrals = trainers.reduce((sum, t) => sum + t.total_referrals, 0);
  const totalConversions = trainers.reduce((sum, t) => sum + t.successful_conversions, 0);
  const totalRewardsPaid = trainers.reduce((sum, t) => sum + t.total_rewards_earned, 0);
  const conversionRate = totalReferrals > 0 ? ((totalConversions / totalReferrals) * 100).toFixed(1) : '0';

  const rewardFiltered = rewards.filter(r =>
    r.trainer_name.toLowerCase().includes(q.toLowerCase()) ||
    r.referred_email.toLowerCase().includes(q.toLowerCase())
  );

  const exportCSV = () => {
    const csv = [
      ['Trainer', 'Email', 'Referral Code', 'Total Referrals', 'Successful Conversions', 'Conversion Rate %', 'Total Rewards Earned'],
      ...trainers.map(t => [
        t.name, t.email, t.referral_code, t.total_referrals, t.successful_conversions,
        t.conversion_rate.toFixed(1), '$' + t.total_rewards_earned.toFixed(2),
      ]),
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referral-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-center text-steel-500 py-8">Loading analytics...</div>;
  if (error) return <div className="text-center text-red-600 py-8">Error: {error}</div>;

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Referrals" value={totalReferrals.toString()} />
        <MetricCard label="Successful Conversions" value={totalConversions.toString()} />
        <MetricCard label="Conversion Rate" value={conversionRate + '%'} />
        <MetricCard label="Rewards Owed to Trainers" value={'$' + totalRewardsPaid.toFixed(2)} />
      </div>

      {/* Trainer Leaderboard */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm">
        <h3 className="font-semibold text-steel-900 mb-4">Trainer Leaderboard</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 border-b border-cream-200">
              <tr>
              <Th>Trainer</Th>
              <Th>Referrals</Th>
              <Th>Conversions</Th>
              <Th>Conv. Rate %</Th>
              <Th>Rewards Owed</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {trainers.slice(0, 10).map((t) => (
                <tr key={t.id} className="hover:bg-cream-50">
                  <Td className="font-medium text-steel-900">{t.name}</Td>
                  <Td>{t.total_referrals}</Td>
                  <Td className="text-forge-600 font-medium">{t.successful_conversions}</Td>
                  <Td>{t.conversion_rate.toFixed(1)}%</Td>
                  <Td className="font-medium text-forge-600">${t.total_rewards_earned.toFixed(2)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Rewards List */}
      <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-steel-900">Referral Activity</h3>
          <button onClick={exportCSV} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-forge-500 text-white text-xs hover:bg-forge-600 font-medium">
            <Download className="w-3 h-3" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream-50 border-b border-cream-200">
              <tr>
              <Th>Trainer</Th>
              <Th>Referred Email</Th>
              <Th>Reward %</Th>
              <Th>Reward Amount</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {rewardFiltered.slice(0, 50).map((r) => (
                <tr key={r.id} className="hover:bg-cream-50">
                  <Td className="font-medium text-steel-900">{r.trainer_name}</Td>
                  <Td className="text-xs">{r.referred_email}</Td>
                  <Td>{r.reward_percentage.toFixed(1)}%</Td>
                  <Td className="text-forge-600 font-medium">${r.reward_amount.toFixed(2)}</Td>
                  <Td><span className={`px-2 py-1 rounded text-xs font-semibold ${r.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span></Td>
                  <Td className="text-xs text-steel-500">{new Date(r.created_at).toLocaleDateString()}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-cream-200 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wider text-steel-500 mb-2">{label}</p>
      <p className="text-2xl font-semibold text-steel-900">{value}</p>
    </div>
  );
}
