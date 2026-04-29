import { ReactNode } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { Link } from '../lib/router';
import { Eyebrow, H2 } from './Section';

type Props = {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  heroImg: string;
  problems: string[];
  protocols: { name: string; desc: string }[];
  includes: string[];
  faq: { q: string; a: string }[];
  related: { to: string; label: string }[];
  footnote?: ReactNode;
};

export default function TreatmentPage({ eyebrow, title, subtitle, heroImg, problems, protocols, includes, faq, related, footnote }: Props) {
  return (
    <>
      <section className="relative bg-steel-900 text-cream-50 px-5 md:px-10 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-steel-900 via-steel-900/90 to-steel-900/40" />
        </div>
        <div className="relative container-tf grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <H2 light>{title}</H2>
            <p className="mt-6 text-lg text-cream-200/80 max-w-xl">{subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/book" className="btn-forge">Book 15-Min Call <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/membership" className="btn-ghost-light">See Membership</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf grid lg:grid-cols-2 gap-12">
          <div>
            <Eyebrow>What we hear every day</Eyebrow>
            <H2>Sound familiar?</H2>
            <ul className="mt-7 space-y-4">
              {problems.map((p) => (
                <li key={p} className="flex gap-3 text-steel-700"><span className="w-1.5 h-1.5 rounded-full bg-forge-500 mt-3 flex-shrink-0" />{p}</li>
              ))}
            </ul>
          </div>
          <div className="bg-cream-100 rounded-3xl p-8 md:p-10 border border-cream-200">
            <h3 className="font-display text-2xl mb-2">What's included with TrueForge</h3>
            <p className="text-steel-600 mb-6">Membership covers the relationship. Protocols are layered on as your plan requires.</p>
            <ul className="space-y-3">
              {includes.map((i) => (
                <li key={i} className="flex gap-3"><Check className="w-5 h-5 text-forge-500 flex-shrink-0 mt-0.5" /><span className="text-steel-700">{i}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section bg-steel-900 text-cream-50">
        <div className="container-tf">
          <div className="max-w-3xl mb-12">
            <Eyebrow>Protocols</Eyebrow>
            <H2 light>Real medicine. <span className="text-metallic">Personalized.</span></H2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {protocols.map((p) => (
              <div key={p.name} className="card-lift bg-steel-800 border border-steel-700 hover:border-forge-500 p-7 rounded-2xl">
                <h3 className="font-display text-2xl mb-3 text-forge-300">{p.name}</h3>
                <p className="text-cream-200/70 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tf max-w-3xl">
          <Eyebrow>Questions Worth Asking</Eyebrow>
          <H2>The honest answers.</H2>
          <div className="mt-10 space-y-4">
            {faq.map((f) => (
              <details key={f.q} className="group bg-white rounded-2xl border border-cream-200 p-6 cursor-pointer">
                <summary className="font-semibold text-steel-900 flex justify-between items-center list-none">
                  {f.q}
                  <span className="text-forge-500 text-2xl group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-4 text-steel-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf text-center max-w-3xl">
          <H2>Ready to find out if this is right for you?</H2>
          <p className="mt-5 text-steel-600 text-lg">Book a free 15-minute consult. We'll review your goals, screen for fit, and tell you the truth — even if that means we're not the right move.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book" className="btn-forge">Book Your 15-Minute Call <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/quiz" className="btn-ghost">Take The Quiz</Link>
          </div>
          {related.length > 0 && (
            <div className="mt-12 pt-12 border-t border-cream-200">
              <p className="text-xs uppercase tracking-[0.3em] text-steel-500 mb-4">You might also be interested in</p>
              <div className="flex flex-wrap justify-center gap-3">
                {related.map((r) => (
                  <Link key={r.to} to={r.to} className="px-5 py-2.5 rounded-full border border-steel-300 hover:border-forge-500 hover:text-forge-600 text-sm font-medium transition">
                    {r.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {footnote && (
        <section className="bg-cream-50 border-t border-cream-200">
          <div className="container-tf py-6 max-w-4xl">
            <p className="text-xs italic text-steel-500 leading-relaxed">{footnote}</p>
          </div>
        </section>
      )}
    </>
  );
}
