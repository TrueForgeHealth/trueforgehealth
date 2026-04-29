import { ArrowRight, Flame, Activity, HeartPulse, Sparkles, ShieldCheck, Star, Quote, Check, Users } from 'lucide-react';
import { Link } from '../lib/router';
import { Eyebrow, H2 } from '../components/Section';

const treatments = [
  { to: '/weight-loss', icon: Flame, title: 'Weight Loss', desc: 'GLP-1 protocols, metabolic recalibration, and coaching that finally sticks.' },
  { to: '/hormone', icon: Activity, title: 'Hormone Optimization', desc: 'TRT, peptides, and full-panel labs to bring your energy back online.' },
  { to: '/sexual-wellness', icon: HeartPulse, title: 'Sexual Wellness', desc: 'Libido, performance, confidence — restored discreetly.' },
  { to: '/hair-skin', icon: Sparkles, title: 'Hair & Skin', desc: 'Look like the version of you that matches how you want to feel.' },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] -mt-20 pt-32 pb-20 px-5 md:px-10 overflow-hidden bg-steel-900">
        <div className="absolute inset-0 bg-forge-glow" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(184,137,90,0.4), transparent 50%), radial-gradient(circle at 10% 90%, rgba(168,162,158,0.3), transparent 50%)'
        }} />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-cream-50 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream-50/10 border border-cream-50/20 backdrop-blur text-xs tracking-[0.2em] uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-forge-400 animate-pulse" />
              Founding Members Now Open
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight">
              The Elite System for <span className="text-metallic">Sustainable Transformation</span>
            </h1>
            <p className="mt-5 font-display text-2xl md:text-3xl text-forge-300 leading-snug">
              Personalized Plans. Advanced Science. Real Results That Last.
            </p>
            <p className="mt-6 text-lg md:text-xl text-cream-200/80 max-w-xl leading-relaxed">
              Premium telehealth + coaching for men and women who are done settling. Weight loss, hormone optimization, performance, recovery — built by someone who lived the journey.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <Link to="/book" className="btn-forge group text-lg md:text-xl px-9 py-5 shadow-2xl shadow-forge-500/30">
                Book Your 15-Minute Call <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link to="/quiz" className="btn-ghost-light">
                Find My Best Option
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-cream-200/70">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-forge-400" /> Licensed Clinicians</div>
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-forge-400 fill-forge-400" /> Real Results</div>
              <div className="flex items-center gap-2"><HeartPulse className="w-4 h-4 text-forge-400" /> Built By Someone Who Lived It</div>
            </div>
          </div>

          <div className="relative animate-fade-in-up">
            <div className="absolute -inset-4 bg-gradient-to-tr from-forge-500/30 via-transparent to-cream-50/10 blur-2xl rounded-3xl" />
            <div className="relative rounded-3xl overflow-hidden border border-cream-50/10 shadow-2xl">
              <img src="/mybefore_and_after.JPG" alt="Real founder transformation" className="w-full h-auto" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-steel-900 via-steel-900/70 to-transparent p-6">
                <p className="text-cream-50 font-semibold">Bryan &amp; Holly — Co-Founders of TrueForge</p>
                <p className="text-forge-300 text-sm">"We built TrueForge because we needed it first."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE / TRUST */}
      <section className="bg-cream-100 py-8 border-y border-cream-200 overflow-hidden">
        <div className="flex animate-shimmer whitespace-nowrap gap-12 text-steel-700 font-semibold tracking-[0.3em] uppercase text-xs">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-12">
              <span>Real Medicine</span><span className="text-forge-500">/</span>
              <span>Real Coaching</span><span className="text-forge-500">/</span>
              <span>Real Accountability</span><span className="text-forge-500">/</span>
              <span>Real Results</span><span className="text-forge-500">/</span>
              <span>Forged Daily</span><span className="text-forge-500">/</span>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEMS WE SOLVE */}
      <section className="section bg-cream-50">
        <div className="container-tf">
          <div className="max-w-3xl mb-16">
            <Eyebrow>Why You're Here</Eyebrow>
            <H2>You don't need another plan. You need a system that <em className="text-metallic-gold not-italic font-semibold">actually works.</em></H2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: 'You\'re tired all the time.', d: 'You wake up drained. Caffeine stopped working. Your labs are "normal" but you are not.' },
              { t: 'The weight won\'t move.', d: 'You\'ve done the diets, the gyms, the apps. Your body is fighting you and nobody is listening.' },
              { t: 'You\'ve lost your edge.', d: 'Drive, focus, libido, recovery — quietly slipping. You miss the version of you that ran the show.' },
            ].map((p) => (
              <div key={p.t} className="card-lift bg-white p-8 rounded-2xl border border-cream-200">
                <h3 className="font-display text-2xl mb-3 text-steel-900">{p.t}</h3>
                <p className="text-steel-600 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/founder" className="text-forge-600 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
              I lived all three. Read my story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TREATMENTS PREVIEW */}
      <section className="section bg-steel-900 text-cream-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-forge-glow opacity-50" />
        <div className="container-tf relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <Eyebrow>What We Forge</Eyebrow>
              <H2 light>Four pillars. <span className="text-metallic-gold">One transformation.</span></H2>
            </div>
            <Link to="/treatments" className="btn-ghost-light self-start md:self-auto">
              Explore All Treatments <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {treatments.map((t) => (
              <Link key={t.to} to={t.to} className="group card-lift bg-steel-800 p-7 rounded-2xl border border-steel-700 hover:border-forge-500">
                <div className="w-14 h-14 rounded-xl bg-forge-500/10 border border-forge-500/30 flex items-center justify-center mb-5 group-hover:bg-forge-500 transition">
                  <t.icon className="w-6 h-6 text-forge-400 group-hover:text-cream-50 transition" />
                </div>
                <h3 className="font-display text-2xl mb-3">{t.title}</h3>
                <p className="text-cream-200/70 text-sm leading-relaxed mb-5">{t.desc}</p>
                <span className="text-forge-300 text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">Learn more <ArrowRight className="w-3 h-3" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER TEASER */}
      <section className="section bg-cream-100">
        <div className="container-tf grid lg:grid-cols-2 gap-14 items-center">
          <div className="rounded-3xl overflow-hidden shadow-2xl bg-cream-200">
            <img src="/before_and_after.JPG" alt="Founder transformation" className="w-full h-auto object-contain" />
          </div>
          <div>
            <Eyebrow>The Co-Founders' Story</Eyebrow>
            <H2>I was the heaviest, sickest, lowest version of myself.</H2>
            <p className="mt-6 text-lg text-steel-600 leading-relaxed">
              I dropped over 200 lbs, lived through a 70 lb regain with my wife Holly beside me, and discovered the power of peptides on the way back up. TrueForge is everything we wished we had — real medicine, real coaching, real accountability.
            </p>
            <p className="mt-4 text-lg text-steel-600 leading-relaxed">
              I'm not a brand. I'm the proof. Holly is the reason. And we built this so you never have to figure it out alone.
            </p>
            <Link to="/founder" className="mt-8 btn-dark">Read Our Full Story <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* MEMBERSHIP TEASER */}
      <section className="section bg-cream-50">
        <div className="container-tf">
          <div className="rounded-3xl bg-gradient-to-br from-steel-900 via-steel-800 to-steel-900 p-10 md:p-16 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-forge-500/20 blur-3xl" />
            <div className="relative grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Eyebrow>The Membership</Eyebrow>
                <H2 light><span className="text-metallic-gold">$99/month</span>. <span className="text-metallic">Everything begins here.</span></H2>
                <p className="mt-6 text-cream-200/80 text-lg leading-relaxed">
                  Unlock the entire TrueForge ecosystem: clinical access, coaching, monthly check-ins, and the prescriber relationship that opens every door inside.
                </p>
                <div className="mt-7 grid sm:grid-cols-2 gap-3">
                  {['Monthly 1:1 coaching check-in', 'Direct messaging support', 'Personalized roadmap', 'Access to every treatment'].map((b) => (
                    <div key={b} className="flex items-center gap-2 text-cream-100">
                      <Check className="w-4 h-4 text-forge-400 flex-none" />{b}
                    </div>
                  ))}
                </div>
                <Link to="/membership" className="mt-9 btn-forge">See Membership Details <ArrowRight className="w-4 h-4" /></Link>
              </div>
              <div className="relative">
                <img src="/TF_LOGo_trans_small.png" alt="TrueForge Health & Wellness" className="w-full max-w-sm mx-auto animate-float opacity-95 brightness-110" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="section bg-cream-100">
        <div className="container-tf">
          <div className="max-w-3xl mb-14">
            <Eyebrow>Real People, Real Forging</Eyebrow>
            <H2>Results that show up in the mirror, the labs, and the life.</H2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Marcus T.', stat: 'Down 62 lbs', q: 'Three other programs failed me. TrueForge is the first one that treated me like a human, not a transaction.' },
              { name: 'Jenna R.', stat: 'Energy + Hormones', q: 'I forgot what feeling like myself even was. Six weeks in I had it back. Six months in I was unstoppable.' },
              { name: 'David K.', stat: 'Performance Reset', q: 'Bryan has been there. You can feel it in every conversation. This isn\'t a clinic — it\'s a brotherhood.' },
            ].map((t) => (
              <div key={t.name} className="card-lift bg-white p-8 rounded-2xl border border-cream-200 relative">
                <Quote className="w-8 h-8 text-forge-400 mb-4" />
                <p className="text-steel-700 leading-relaxed mb-6">{t.q}</p>
                <div className="border-t border-cream-200 pt-4">
                  <div className="font-semibold text-steel-900">{t.name}</div>
                  <div className="text-sm text-forge-600">{t.stat}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/results" className="btn-dark">See All Transformations <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section bg-steel-900 text-cream-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-forge-glow opacity-60" />
        <div className="container-tf relative text-center max-w-3xl">
          <Eyebrow>Your Move</Eyebrow>
          <H2 light>The version of you that you keep picturing? <span className="text-metallic">It's a 15-minute call away.</span></H2>
          <p className="mt-6 text-cream-200/80 text-lg">No pressure. No commitment. Just a real conversation about what's actually going on — and what we'd actually do about it.</p>
          <div className="mt-9 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book" className="btn-forge">Book Your 15-Minute Call <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/membership" className="btn-ghost-light">See Membership</Link>
          </div>
        </div>
      </section>

      {/* FREE ACCOUNT CTA */}
      <section className="relative bg-gradient-to-b from-cream-50 via-cream-100 to-cream-50 py-24 px-5 md:px-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(184,137,90,0.7), transparent 55%), radial-gradient(circle at 80% 70%, rgba(27,27,27,0.5), transparent 55%)',
        }} />
        <div className="container-tf relative">
          <div className="max-w-4xl mx-auto bg-steel-900 text-cream-50 rounded-[36px] shadow-2xl shadow-steel-900/30 border border-steel-800 relative overflow-hidden">
            {/* Gold top accent */}
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #b8895a 0%, #f3d18b 40%, #d4a86a 70%, #b8895a 100%)' }} />

            {/* Glow orbs */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-forge-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-forge-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-10 md:p-14">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left — copy */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forge-500/15 border border-forge-500/30 text-forge-300 text-xs uppercase tracking-[0.22em] font-semibold mb-6">
                    <Sparkles className="w-3.5 h-3.5" /> Free to Join
                  </div>
                  <H2 light>Create Your <span className="text-metallic-gold">Free Account</span></H2>
                  <p className="mt-5 text-cream-200/80 text-lg leading-relaxed">
                    Get instant access to your personalized dashboard, resources, and the beginning of your transformation. No pressure. No commitment.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      'Personalized dashboard from day one',
                      'Access to your care team when you\'re ready',
                      'Member pricing unlocked on all protocols',
                      '10% off your first month of membership',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-cream-200/80">
                        <Check className="w-4 h-4 text-forge-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Link to="/login" className="btn-gold text-base px-8 py-4">
                      Create Free Account <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link to="/login" className="btn-ghost-light text-sm px-6 py-4">
                      Sign In
                    </Link>
                  </div>
                </div>

                {/* Right — referral incentive card */}
                <div className="rounded-2xl border border-forge-500/30 bg-gradient-to-br from-forge-500/10 via-steel-800/60 to-steel-800/80 p-8">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-forge-500/20 border border-forge-500/35 flex items-center justify-center">
                      <Users className="w-5 h-5 text-forge-400" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-forge-300 font-semibold">Referral Bonus</p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-forge-500/20 border border-forge-400/30 text-forge-300 text-[10px] font-semibold uppercase tracking-widest">5% Off</span>
                    </div>
                  </div>
                  <h3 className="font-display text-2xl text-cream-50 leading-snug mb-3">
                    Share with 3 friends.<br />Unlock an extra <span className="text-metallic-gold">5% off.</span>
                  </h3>
                  <p className="text-cream-200/70 text-sm leading-relaxed">
                    Once you create your free account, share TrueForge with 3 friends using your unique referral link. When they sign up, you unlock an extra{' '}
                    <span className="font-semibold text-cream-50">5% off your first coaching package or service upgrade</span>.
                  </p>
                  <div className="mt-5 pt-5 border-t border-forge-500/20">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-forge-400 font-semibold mb-2">Your referral link is generated instantly after signup.</p>
                    <div className="flex items-center gap-2 bg-steel-900/60 border border-steel-700 rounded-full px-4 py-2.5">
                      <span className="text-cream-200/40 text-xs font-mono flex-1">trueforgehealth.com/?ref=yourcode</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-forge-500 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
