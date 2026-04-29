import { ArrowRight, Flame, Activity, HeartPulse, Sparkles, FlaskConical, Dumbbell, Brain, Pill } from 'lucide-react';
import { Link } from '../lib/router';
import { Eyebrow, H2, Lead } from '../components/Section';

const primary = [
  { to: '/weight-loss', icon: Flame, title: 'Weight Loss', tag: 'GLP-1, Metabolic', desc: 'Semaglutide, tirzepatide, lifestyle reset, body recomp coaching.', img: 'https://images.pexels.com/photos/4498482/pexels-photo-4498482.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { to: '/hormone', icon: Activity, title: 'Hormone Optimization', tag: 'TRT, Peptides', desc: 'Full-panel labs, testosterone therapy, peptide protocols, thyroid & adrenal.', img: 'https://images.pexels.com/photos/4498132/pexels-photo-4498132.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { to: '/sexual-wellness', icon: HeartPulse, title: 'Sexual Wellness', tag: 'Performance, Libido', desc: 'Discreet ED protocols, libido restoration, partner-positive plans.', img: 'https://images.pexels.com/photos/4046718/pexels-photo-4046718.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { to: '/hair-skin', icon: Sparkles, title: 'Hair & Skin', tag: 'Aesthetic, Recovery', desc: 'Finasteride, minoxidil, peptides, skincare and aesthetic protocols.', img: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1200' },
];

const supporting = [
  { icon: FlaskConical, t: 'Advanced Lab Panels', d: 'Hormones, metabolic, inflammation, micronutrients.' },
  { icon: Dumbbell, t: 'Personal Training', d: 'Custom programming aligned with your medical plan.' },
  { icon: Brain, t: 'Mind & Recovery', d: 'Sleep, stress, nervous system, longevity peptides.' },
  { icon: Pill, t: 'Add-On Therapies', d: 'NAD+, B12, glutathione, peptide stacks. Curiosity rewarded.' },
];

export default function Treatments() {
  return (
    <>
      <section className="bg-steel-900 text-cream-50 px-5 md:px-10 py-20 md:py-28">
        <div className="container-tf max-w-4xl">
          <Eyebrow>Treatments Hub</Eyebrow>
          <H2 light>One membership. <span className="text-metallic">Every door unlocked.</span></H2>
          <Lead light>Inside TrueForge you don't pick a "program" and pray. You walk through one door and access whichever protocol your body actually needs — guided by clinicians who treat you like a whole person.</Lead>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf grid md:grid-cols-2 gap-6">
          {primary.map((p) => (
            <Link key={p.to} to={p.to} className="group card-lift relative overflow-hidden rounded-3xl bg-steel-900 min-h-[420px]">
              <img src={p.img} alt={p.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-steel-900 via-steel-900/70 to-transparent" />
              <div className="relative p-8 md:p-10 h-full flex flex-col justify-end text-cream-50">
                <div className="w-12 h-12 rounded-xl bg-forge-500/20 border border-forge-500/40 flex items-center justify-center mb-5 backdrop-blur">
                  <p.icon className="w-5 h-5 text-forge-300" />
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-forge-300 mb-2">{p.tag}</span>
                <h3 className="font-display text-3xl md:text-4xl mb-3">{p.title}</h3>
                <p className="text-cream-200/80 max-w-md mb-5">{p.desc}</p>
                <span className="inline-flex items-center gap-2 text-forge-300 font-semibold group-hover:gap-3 transition-all">Explore protocol <ArrowRight className="w-4 h-4" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tf">
          <div className="max-w-3xl mb-12">
            <Eyebrow>Add-Ons & Supporting</Eyebrow>
            <H2>The rabbit holes worth going down.</H2>
            <p className="mt-4 text-steel-600">Members unlock these on demand. Most clients start with one core protocol and stack from there as their goals evolve.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {supporting.map((s) => (
              <div key={s.t} className="card-lift bg-white p-7 rounded-2xl border border-cream-200">
                <s.icon className="w-7 h-7 text-forge-500 mb-4" />
                <h3 className="font-display text-xl mb-2">{s.t}</h3>
                <p className="text-steel-600 text-sm">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/book" className="btn-forge">Book Your 15-Minute Call <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
