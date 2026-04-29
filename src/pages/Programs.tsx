import { ArrowRight, Check, Flame, Activity, Zap, Crown, Dna } from 'lucide-react';
import { Link } from '../lib/router';
import { Eyebrow, H2 } from '../components/Section';

const premiumPrograms = [
  {
    icon: Dna,
    name: 'Genetic Reset with Biomarkers',
    tag: 'All-Inclusive',
    blurb: 'We don\'t just find what\'s wrong — we map the exact 12-week blueprint to fix it, using your own genetic data and biomarkers as the guide. The most complete diagnostic program we offer.',
    features: [
      'Full genetic testing panel',
      'Comprehensive biomarker analysis',
      'Clinician-interpreted gene + lab report',
      'Hormone, metabolic & inflammation markers',
      'Personalized 12-week fix-it blueprint',
      'Custom supplement + peptide recommendations',
      'Follow-up review at week 6 and week 12',
    ],
    startingAt: '$800',
  },
  {
    icon: Crown,
    name: 'Executive Package',
    tag: 'Best for Busy Entrepreneurs',
    blurb: 'Concierge-level health optimization built around your schedule — not the other way around. Everything in Performance, plus dedicated personal training and a curated metabolic peptide stack.',
    features: [
      'Dedicated personal trainer (remote or in-person)',
      'Metabolic peptide stack included',
      'Priority clinician access — same-day responses',
      'Comprehensive hormone + biomarker panel',
      'Custom nutrition & recovery protocol',
      'Monthly 1:1 executive health briefing',
      'Quarterly full-panel lab review',
    ],
    startingAt: '$999',
  },
];

const programs = [
  {
    icon: Flame,
    name: '90-Day Weight Management',
    tag: 'Flagship',
    blurb: 'GLP-1 protocol + coaching + accountability. The fastest visible-results program we offer.',
    features: ['GLP medication included', 'Required labs', '90 days of coaching', 'Body recomp guidance', 'Maintenance off-ramp'],
    startingAt: '$249/mo',
  },
  {
    icon: Activity,
    name: '12 Week Hormone Reset',
    tag: 'Most Popular',
    blurb: 'Full panel labs + clinician design + hormone optimization protocol with weekly tuning.',
    features: ['Full hormone panel', 'TRT or female hormone protocol', 'Weekly check-ins', 'Symptom + sleep tracking', 'Peptide add-on option'],
    startingAt: '$349',
  },
  {
    icon: Zap,
    name: 'Performance Program',
    tag: 'High-Touch',
    blurb: 'For clients who want the entire stack — hormones, peptides, training, recovery, aesthetic care.',
    features: ['Concierge clinician access', 'Comprehensive labs + biomarkers', 'Genetic testing option', 'Custom peptide stack', 'Personal training pairing'],
    startingAt: '$599',
  },
];

export default function Programs() {
  return (
    <>
      <section className="bg-steel-900 text-cream-50 py-24 px-5 md:px-10">
        <div className="container-tf max-w-4xl">
          <Eyebrow>Programs</Eyebrow>
          <H2 light>Want a defined finish line? <span className="text-metallic-gold">Forge your path.</span></H2>
          <p className="mt-6 text-lg text-cream-200/80">For members who want a structured outcome with a clear timeline. Programs sit on top of your $99/month membership.</p>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf space-y-6">

          {/* Premium row — 2 cards, centered, spanning 2/3 of the grid */}
          <div className="grid lg:grid-cols-2 gap-6 lg:max-w-[calc(66.666%+8px)] lg:mx-auto">
            {premiumPrograms.map((p) => (
              <div
                key={p.name}
                className="card-lift rounded-3xl p-8 flex flex-col bg-gradient-to-br from-steel-900 via-steel-800 to-steel-900 border border-forge-500/30 text-cream-50 relative overflow-hidden"
              >
                {/* Subtle gold glow */}
                <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-forge-500/15 blur-3xl pointer-events-none" />

                <div className="relative flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-forge-500/20 border border-forge-500/30 flex items-center justify-center">
                    <p.icon className="w-6 h-6 text-forge-300" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-forge-500/20 border border-forge-400/40 text-forge-300 text-[10px] uppercase tracking-[0.2em] font-semibold text-right max-w-[140px] leading-tight">
                    {p.tag}
                  </span>
                </div>

                <h3 className="relative font-display text-2xl mb-1 text-cream-50">{p.name}</h3>
                <p className="relative text-xs uppercase tracking-[0.2em] font-semibold mb-3 text-forge-300">
                  Prices start at <span className="text-metallic-gold">{p.startingAt}</span>
                </p>

                {/* Gold-tinted description bubble */}
                <div className="relative gold-bubble border rounded-2xl px-4 py-3 mb-5">
                  <p className="text-cream-200/90 text-sm leading-relaxed">{p.blurb}</p>
                </div>

                <ul className="relative space-y-2 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-cream-200">
                      <Check className="w-4 h-4 text-forge-400 flex-shrink-0 mt-1" />{f}
                    </li>
                  ))}
                </ul>

                <Link to="/book" className="btn-gold w-full relative">
                  Book Discovery Call <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>

          {/* Standard row of 3 */}
          <div className="grid lg:grid-cols-3 gap-6">
            {programs.map((p) => (
              <div key={p.name} className="card-lift bg-white border border-cream-200 rounded-3xl p-8 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-forge-500/10 flex items-center justify-center">
                    <p.icon className="w-6 h-6 text-forge-500" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-steel-900 text-cream-50 text-xs uppercase tracking-widest">{p.tag}</span>
                </div>
                <h3 className="font-display text-2xl mb-1">{p.name}</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-forge-500 font-semibold mb-3">
                  Prices start at <span className="text-metallic-gold">{p.startingAt}</span>
                </p>
                <p className="text-steel-600 mb-6">{p.blurb}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-steel-700">
                      <Check className="w-4 h-4 text-forge-500 flex-shrink-0 mt-1" />{f}
                    </li>
                  ))}
                </ul>
                <Link to="/book" className="btn-dark w-full">Book Discovery Call <ArrowRight className="w-4 h-4" /></Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tf max-w-3xl text-center">
          <Eyebrow>Pricing Note</Eyebrow>
          <H2>Programs are quoted on the consult.</H2>
          <p className="mt-5 text-steel-600 text-lg">
            Because every protocol is personalized — based on labs, weight, goals, and which medications you actually need — we price transparently after we know your case. No hidden upsells. No surprises.
          </p>
          <div className="mt-8"><Link to="/book" className="btn-forge">Get Your Custom Quote <ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>
    </>
  );
}
