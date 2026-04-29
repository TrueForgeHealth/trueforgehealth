import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Calendar, CheckCircle2, ShieldCheck, Clock, Video, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Eyebrow, H2 } from '../components/Section';
import { Link, useRouter } from '../lib/router';
import { fetchAvailability, bookAppointment, formatShortDay, type Slot } from '../lib/booking';

type Step = 'pick' | 'details' | 'done';

export default function Book() {
  const { navigate } = useRouter();
  const [tz, setTz] = useState('America/New_York');
  const [days, setDays] = useState<Record<string, Slot[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [chosen, setChosen] = useState<Slot | null>(null);
  const [step, setStep] = useState<Step>('pick');
  const [pageOffset, setPageOffset] = useState(0);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', goal: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ when_label: string; zoom_link: string; id: string } | null>(null);

  useEffect(() => {
    fetchAvailability(45)
      .then((r) => {
        setTz(r.timezone);
        setDays(r.days);
        const firstDay = Object.keys(r.days).sort()[0] ?? null;
        setActiveDay(firstDay);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const dayKeys = useMemo(() => Object.keys(days).sort(), [days]);
  const visibleDays = dayKeys.slice(pageOffset, pageOffset + 7);
  const slots = activeDay ? days[activeDay] ?? [] : [];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chosen) return;
    setSubmitting(true);
    setError(null);
    try {
      const r = await bookAppointment({
        ...form,
        scheduled_at: chosen.start,
        duration_minutes: 15,
        source: '/book',
      });
      setConfirmation(r.appointment);
      setStep('done');
      sessionStorage.setItem('tf_email', form.email);
      sessionStorage.setItem('tf_goal', form.goal);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-steel-900 text-cream-50 py-20 md:py-24 px-5 md:px-10">
        <div className="container-tf max-w-4xl">
          <Eyebrow>Free Discovery Call</Eyebrow>
          <H2 light>Book your <span className="text-metallic">15-minute call.</span></H2>
          <p className="mt-6 text-lg text-cream-200/80 max-w-2xl">
            One short conversation. We screen for fit, answer your questions, and tell you the truth — even if that means we're not the right move.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5 text-sm text-cream-200/70">
            <div className="inline-flex items-center gap-2"><Clock className="w-4 h-4 text-forge-300" /> 15 minutes</div>
            <div className="inline-flex items-center gap-2"><Video className="w-4 h-4 text-forge-300" /> Zoom — link emailed</div>
            <div className="inline-flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-forge-300" /> No commitment</div>
          </div>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf max-w-5xl">
          {step === 'done' && confirmation ? (
            <Confirmation confirmation={confirmation} email={form.email} firstName={form.first_name} navigate={navigate} />
          ) : (
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10">
              <div className="bg-white border border-cream-200 rounded-3xl shadow-xl overflow-hidden">
                <div className="p-6 md:p-8 border-b border-cream-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-steel-500">Step 1</p>
                    <h3 className="font-display text-2xl mt-1">Pick a time</h3>
                    <p className="text-xs text-steel-500 mt-1">All times shown in {tz.replace('_', ' ')}</p>
                  </div>
                  {dayKeys.length > 7 && (
                    <div className="flex items-center gap-2">
                      <button
                        disabled={pageOffset === 0}
                        onClick={() => setPageOffset(Math.max(0, pageOffset - 7))}
                        className="w-9 h-9 rounded-full border border-cream-200 hover:border-forge-500 flex items-center justify-center disabled:opacity-30 transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        disabled={pageOffset + 7 >= dayKeys.length}
                        onClick={() => setPageOffset(Math.min(dayKeys.length - 7, pageOffset + 7))}
                        className="w-9 h-9 rounded-full border border-cream-200 hover:border-forge-500 flex items-center justify-center disabled:opacity-30 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="p-16 flex flex-col items-center gap-3 text-steel-500">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-sm">Loading availability...</span>
                  </div>
                ) : error && !confirmation ? (
                  <div className="p-10 text-center text-sm text-red-700 bg-red-50 border-t border-red-100">{error}</div>
                ) : dayKeys.length === 0 ? (
                  <div className="p-12 text-center">
                    <Calendar className="w-8 h-8 text-steel-300 mx-auto mb-3" />
                    <p className="text-steel-700 font-medium">No open slots in the next 45 days.</p>
                    <p className="text-steel-500 text-sm mt-1">Email <a className="text-forge-600 underline" href="mailto:hello@trueforgehealth.com">hello@trueforgehealth.com</a> and we'll find time.</p>
                  </div>
                ) : (
                  <>
                    <div className="p-5 md:p-6 grid grid-cols-7 gap-2">
                      {visibleDays.map((dk) => {
                        const { wd, mon, day } = formatShortDay(dk, tz);
                        const count = days[dk]?.length ?? 0;
                        const isActive = dk === activeDay;
                        return (
                          <button
                            key={dk}
                            onClick={() => { setActiveDay(dk); setChosen(null); }}
                            className={`flex flex-col items-center py-3 rounded-2xl border transition ${isActive ? 'border-forge-500 bg-forge-500/10' : 'border-cream-200 hover:border-forge-300 hover:bg-cream-100'}`}
                          >
                            <span className="text-[10px] uppercase tracking-widest text-steel-500">{wd}</span>
                            <span className={`font-display text-2xl mt-0.5 ${isActive ? 'text-forge-600' : 'text-steel-900'}`}>{day}</span>
                            <span className="text-[10px] text-steel-500">{mon}</span>
                            <span className={`mt-2 text-[10px] font-semibold ${count > 0 ? 'text-forge-600' : 'text-steel-300'}`}>{count} open</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="px-6 md:px-8 pb-8 pt-2">
                      {slots.length === 0 ? (
                        <p className="text-sm text-steel-500 text-center py-6">No times open this day. Try another.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                          {slots.map((s) => {
                            const picked = chosen?.start === s.start;
                            return (
                              <button
                                key={s.start}
                                onClick={() => { setChosen(s); setStep('details'); }}
                                className={`px-3 py-3 rounded-xl text-sm font-semibold border transition ${picked ? 'bg-forge-500 text-cream-50 border-forge-500' : 'bg-white border-cream-300 text-steel-800 hover:border-forge-500 hover:text-forge-600'}`}
                              >
                                {s.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="bg-steel-900 text-cream-50 rounded-3xl p-7 md:p-8 shadow-xl">
                <p className="text-xs uppercase tracking-[0.25em] text-forge-300">Step 2</p>
                <h3 className="font-display text-2xl mt-1 mb-1">Your details</h3>
                <p className="text-cream-200/70 text-sm mb-6">{chosen ? `Selected: ${chosen.label}` : 'Select a time on the left first.'}</p>
                <form onSubmit={submit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input required disabled={!chosen} placeholder="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="px-4 py-3 rounded-xl bg-steel-800 border border-steel-700 focus:border-forge-500 focus:outline-none text-cream-50 placeholder-cream-200/40 disabled:opacity-50" />
                    <input required disabled={!chosen} placeholder="Last name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="px-4 py-3 rounded-xl bg-steel-800 border border-steel-700 focus:border-forge-500 focus:outline-none text-cream-50 placeholder-cream-200/40 disabled:opacity-50" />
                  </div>
                  <input required disabled={!chosen} type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-steel-800 border border-steel-700 focus:border-forge-500 focus:outline-none text-cream-50 placeholder-cream-200/40 disabled:opacity-50" />
                  <input required disabled={!chosen} type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-steel-800 border border-steel-700 focus:border-forge-500 focus:outline-none text-cream-50 placeholder-cream-200/40 disabled:opacity-50" />
                  <select required disabled={!chosen} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-steel-800 border border-steel-700 focus:border-forge-500 focus:outline-none text-cream-50 disabled:opacity-50">
                    <option value="">What brought you in?</option>
                    <option>Weight Loss / GLP</option>
                    <option>Hormone Optimization / TRT</option>
                    <option>Sexual Wellness</option>
                    <option>Hair & Skin</option>
                    <option>Performance / Recovery</option>
                    <option>Not sure yet</option>
                  </select>
                  <textarea disabled={!chosen} placeholder="Anything we should know? (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-xl bg-steel-800 border border-steel-700 focus:border-forge-500 focus:outline-none text-cream-50 placeholder-cream-200/40 disabled:opacity-50 resize-none" />
                  <button disabled={!chosen || submitting} className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-forge-500 hover:bg-forge-600 text-cream-50 font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed">
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</> : <><Calendar className="w-4 h-4" /> Confirm {chosen ? chosen.label : 'time'}</>}
                  </button>
                  {error && <p className="text-sm text-red-300 mt-2">{error}</p>}
                  <p className="text-[11px] text-cream-200/50 text-center pt-1">A confirmation email with your Zoom link will arrive immediately.</p>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {step !== 'done' && (
        <section className="section bg-cream-100">
          <div className="container-tf max-w-4xl text-center">
            <Eyebrow>What happens on the call</Eyebrow>
            <H2>Honest, focused, useful.</H2>
            <div className="mt-10 grid md:grid-cols-3 gap-5">
              {[
                { icon: ShieldCheck, t: 'We screen for fit', d: "Not everyone is a fit for every protocol. We're upfront about that." },
                { icon: CheckCircle2, t: 'You get a real plan', d: 'A clear next step — or a referral to someone better suited if needed.' },
                { icon: Clock, t: '15 minutes total', d: "Respectful of your time. Most leave the call with clarity they couldn't buy." },
              ].map((s) => (
                <div key={s.t} className="bg-white rounded-2xl p-6 border border-cream-200 text-left">
                  <div className="w-11 h-11 rounded-xl bg-forge-500/10 flex items-center justify-center mb-3">
                    <s.icon className="w-5 h-5 text-forge-500" />
                  </div>
                  <h4 className="font-semibold text-steel-900">{s.t}</h4>
                  <p className="text-sm text-steel-600 mt-1">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Confirmation({ confirmation, email, firstName, navigate }: { confirmation: { when_label: string; zoom_link: string; id: string }; email: string; firstName: string; navigate: (to: string) => void }) {
  return (
    <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-stretch">
      <div className="bg-white border border-cream-200 rounded-3xl p-8 md:p-10 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-forge-500/10 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-7 h-7 text-forge-500" />
        </div>
        <Eyebrow>You're booked</Eyebrow>
        <H2>See you {firstName ? `${firstName}, ` : ''}<span className="text-forge-600">soon.</span></H2>
        <div className="mt-6 p-5 rounded-2xl bg-cream-100 border border-cream-200 space-y-2">
          <div className="text-sm text-steel-500 uppercase tracking-wider text-xs">When</div>
          <div className="font-display text-xl text-steel-900">{confirmation.when_label}</div>
          <div className="pt-3 mt-3 border-t border-cream-200 text-sm">
            <div className="text-steel-500 uppercase tracking-wider text-xs mb-1">Zoom</div>
            <a href={confirmation.zoom_link} target="_blank" rel="noreferrer" className="text-forge-600 font-semibold hover:underline break-all">{confirmation.zoom_link}</a>
          </div>
        </div>
        <p className="mt-5 text-sm text-steel-600 leading-relaxed">
          A confirmation email is on its way to <strong>{email}</strong>. We'll send reminders 3 days, 24 hours, 2 hours, and 10 minutes before your call so the Zoom link is impossible to miss.
        </p>
      </div>

      <div className="bg-steel-900 text-cream-50 rounded-3xl p-8 md:p-10 shadow-xl flex flex-col">
        <Eyebrow>While you're here</Eyebrow>
        <H2 light>Skip the wait. <span className="text-metallic">Join today.</span></H2>
        <p className="mt-4 text-cream-200/80 leading-relaxed">
          TrueForge members unlock priority scheduling, full intake review, member pricing on every protocol, and direct access to your care team in the portal — all at $97/month.
        </p>
        <ul className="mt-5 space-y-2.5 text-sm text-cream-200/80">
          {[
            'Intake form and personalized plan within 48 hours',
            'Member pricing on every protocol — typically 30–50% off',
            'Direct messaging with your care team',
            'Priority scheduling for full consultations',
          ].map((b) => (
            <li key={b} className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-forge-300 flex-shrink-0 mt-0.5" /><span>{b}</span></li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link to="/membership" className="btn-forge">Join TrueForge <ArrowRight className="w-4 h-4" /></Link>
          <button onClick={() => navigate('/')} className="btn-ghost-light">Back to home</button>
        </div>
        <p className="mt-auto pt-7 text-[11px] text-cream-200/50">Prefer to wait until after the call? No problem — we'll cover everything when we meet.</p>
      </div>
    </div>
  );
}
