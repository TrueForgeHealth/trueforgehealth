import { ArrowRight, Quote, Star } from 'lucide-react';
import { Link } from '../lib/router';
import { Eyebrow, H2 } from '../components/Section';

const stories = [
  { name: 'Bryan E.', stat: 'Co-Founder — down from over 425 lbs', q: 'We built TrueForge because I needed it. The transformation you see is the protocol Holly and I now offer to every client who walks in.', img: '/before_and_after.JPG' },
  { name: 'Bryan E.', stat: 'Sustained 4 years', q: 'It\'s not just losing weight. It\'s rebuilding the version of yourself that runs the show again.', img: '/mybefore_and_after.JPG' },
];

const reviews = [
  { name: 'Marcus T.', stat: 'Down 62 lbs in 6 months', q: 'I tried three other GLP programs before this. None of them treated me like a human. TrueForge is different. I finally feel seen.', stars: 5 },
  { name: 'Jenna R.', stat: 'Hormones + Energy', q: 'I forgot what feeling like myself was. Six weeks in, I had it back. Six months in, I was unstoppable.', stars: 5 },
  { name: 'David K.', stat: 'Performance + TRT', q: 'Bryan has lived this. You can feel it in every conversation. This is not a clinic. It is a brotherhood.', stars: 5 },
  { name: 'Lauren M.', stat: 'Down 38 lbs', q: 'The coaching is what sets this apart. Anybody can write a script. Nobody else picked up the phone at 9pm when I needed them.', stars: 5 },
  { name: 'Alex P.', stat: 'TRT + Performance', q: 'I have my edge back. My drive, my recovery, my sleep. I tell every guy I know to call them.', stars: 5 },
  { name: 'Sara C.', stat: 'Weight + Skin', q: 'They actually built a plan FOR me. Not the plan they sell to everyone. That\'s the difference.', stars: 5 },
];

export default function Results() {
  return (
    <>
      <section className="bg-steel-900 text-cream-50 py-24 px-5 md:px-10">
        <div className="container-tf max-w-4xl">
          <Eyebrow>Real Results</Eyebrow>
          <H2 light>Receipts. <span className="text-metallic-gold">Not promises.</span></H2>
          <p className="mt-6 text-lg text-cream-200/80">Every photo, every review, every transformation here is real. We didn't buy testimonials. We earned them.</p>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf">
          <p className="mb-8 text-xs italic text-steel-500 leading-relaxed max-w-3xl">
            All treatments are prescribed by licensed clinicians and compounded by 503A pharmacies for individual patient needs. Results vary. This is not a guarantee of outcomes.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((s, i) => (
              <div key={i} className="bg-cream-100 rounded-3xl overflow-hidden border border-cream-200 card-lift">
                <div className="bg-cream-200 flex items-center justify-center p-6">
                  <img src={s.img} alt={s.name} className="w-full h-auto max-h-[480px] object-contain" />
                </div>
                <div className="p-8">
                  <Quote className="w-8 h-8 text-forge-500 mb-4" />
                  <p className="text-steel-700 text-lg leading-relaxed mb-5">{s.q}</p>
                  <div className="border-t border-cream-200 pt-4">
                    <div className="font-semibold text-steel-900 text-lg">{s.name}</div>
                    <div className="text-forge-600">{s.stat}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tf">
          <div className="max-w-3xl mb-12">
            <Eyebrow>Client Reviews</Eyebrow>
            <H2>Words from real members.</H2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <div key={i} className="card-lift bg-white p-7 rounded-2xl border border-cream-200">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-forge-500 fill-forge-500" />
                  ))}
                </div>
                <p className="text-steel-700 mb-5 leading-relaxed">{r.q}</p>
                <div className="border-t border-cream-200 pt-4">
                  <div className="font-semibold text-steel-900">{r.name}</div>
                  <div className="text-sm text-forge-600">{r.stat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf max-w-3xl text-center">
          <H2>Your before-and-after starts with one call.</H2>
          <div className="mt-8"><Link to="/book" className="btn-forge">Book Your 15-Minute Call <ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>
    </>
  );
}