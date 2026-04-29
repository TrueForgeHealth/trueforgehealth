import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from '../lib/router';
import { Eyebrow, H2 } from '../components/Section';

const articles = [
  { cat: 'Weight Loss', t: 'GLP-1s Without The Mistakes', d: 'The five things that determine whether GLP medications change your life or waste your money.' },
  { cat: 'Hormones', t: 'Why Your "Normal" Labs Aren\'t', d: 'Reference ranges are built for sick populations. Optimal is a different conversation.' },
  { cat: 'Performance', t: 'TRT 101: The Honest Guide', d: 'What it does, what it doesn\'t do, who should consider it, and what to ask your clinician.' },
  { cat: 'Recovery', t: 'Peptides That Actually Work', d: 'BPC-157, TB-500, sermorelin — separating the hype from the science.' },
  { cat: 'Sexual Wellness', t: 'When ED Meds Stop Working', d: 'The hormonal, vascular, and psychological causes most clinics miss.' },
  { cat: 'Mindset', t: 'Why You Quit Programs You Paid For', d: 'A real conversation about identity, accountability, and the secret to compliance.' },
];

export default function Learn() {
  return (
    <>
      <section className="bg-steel-900 text-cream-50 py-24 px-5 md:px-10">
        <div className="container-tf max-w-4xl">
          <Eyebrow>Learn Hub</Eyebrow>
          <H2 light><span className="text-metallic-gold">The rabbit holes that change minds.</span></H2>
          <p className="mt-6 text-lg text-cream-200/80">No fluff content. No regurgitated medical articles. Just the things we find ourselves explaining over and over again — written down so you can decide for yourself.</p>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <article key={a.t} className="card-lift bg-white rounded-2xl border border-cream-200 p-7 cursor-pointer">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs uppercase tracking-[0.3em] text-forge-500 font-semibold">{a.cat}</span>
                <BookOpen className="w-4 h-4 text-steel-400" />
              </div>
              <h3 className="font-display text-2xl mb-3 text-steel-900">{a.t}</h3>
              <p className="text-steel-600 mb-5">{a.d}</p>
              <span className="text-forge-600 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">Read more <ArrowRight className="w-3 h-3" /></span>
            </article>
          ))}
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tf max-w-3xl text-center">
          <H2>Reading is the warm-up. The forge is the next step.</H2>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/book" className="btn-forge">Book Your 15-Minute Call <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/quiz" className="btn-ghost">Take The Quiz</Link>
          </div>
        </div>
      </section>
    </>
  );
}
