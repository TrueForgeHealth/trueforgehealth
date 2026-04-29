import { ArrowRight, Quote, Heart } from 'lucide-react';
import { Link } from '../lib/router';
import { Eyebrow, H2 } from '../components/Section';

export default function Founder() {
  return (
    <>
      <section className="bg-steel-900 text-cream-50 py-24 px-5 md:px-10">
        <div className="container-tf grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Eyebrow>Our Story</Eyebrow>
            <H2 light>I was the <span className="text-metallic-gold">heaviest, sickest, lowest</span> version of myself.</H2>
            <p className="mt-6 text-cream-200/80 text-lg">
              We built TrueForge because we needed it first. Every protocol we offer, every coaching call, every late-night message answered — it's the version of care I wish I had at the bottom of my own valley, built alongside the woman who never stopped believing I'd climb out.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img src="/mybefore_and_after.JPG" alt="Bryan — Co-Founder" className="w-full h-auto" />
          </div>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf max-w-3xl">
          <div className="space-y-6 text-lg text-steel-700 leading-relaxed">
            <p>I spent years quietly disappearing. My testosterone sat at <strong className="text-steel-900">94</strong> while doctors told me my labs were "normal." Then one finally looked me in the eye and said it straight:</p>
            <p className="font-display text-xl md:text-2xl text-steel-900 italic border-l-4 border-forge-500 pl-6">"You're either going to die, or you're going to lose your legs — I don't know which will happen first."</p>
            <p>That was the moment everything changed.</p>
            <p>I took control. I got certified in training and nutrition, lived in the gym 7+ hours a day, and went pure carnivore for nearly two years. With TRT as the foundation and brutal consistency, I dropped over <strong className="text-steel-900">200 lbs</strong> and got into the best shape of my life. Those before-and-after photos on this page are from that TRT-only chapter.</p>
            <p>But the results weren't typical. The lifestyle wasn't sustainable, and my body paid the price.</p>
            <p>Shortly after, I met <strong className="text-steel-900">Holly</strong>. Life felt magnificent.</p>
            <p>Then it all hit at once — kids, work, endless schedules, and the sudden loss of my dad, my best friend. In just a few months I gained <strong className="text-steel-900">70 lbs</strong> back and found myself knocking on 300 lbs again, terrified the old life was returning.</p>
            <p>This time Holly was right there beside me, pushing me forward. Through our doctor we discovered <strong className="text-steel-900">peptides</strong> and their potential benefits. I became obsessed — learning everything I could about how they work, how to stack them responsibly, and how to use them with real education instead of hype.</p>
            <p>The messages started pouring in: <em>How did you do this?</em></p>
            <p className="font-display text-2xl text-steel-900 not-italic">That question became TrueForge.</p>
            <p>Holly and I built TrueForge Health &amp; Wellness together to give people the system I wish I'd had from the beginning — twice. Real medicine. Real coaching. Real accountability.</p>
            <p>I'm not a brand. I'm the proof. Holly is the reason I'm still here to share it. And we created this so you never have to figure it out alone.</p>
          </div>

          <div className="my-16 p-10 rounded-3xl bg-cream-100 border border-cream-200 relative">
            <Quote className="w-10 h-10 text-forge-500 mb-5" />
            <p className="font-display text-2xl md:text-3xl text-steel-900 leading-relaxed">
              "If I can do it — broken, exhausted, and over 425 lbs — anyone reading this can. The only thing you're missing is the right team."
            </p>
            <p className="mt-5 text-forge-600 font-semibold">— Bryan, Co-Founder of TrueForge Health &amp; Wellness</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            <div className="flex flex-col gap-2">
              <img src="/before_and_after.JPG" alt="Transformation" className="w-full h-auto rounded-xl sm:rounded-2xl shadow-xl object-cover" />
              <p className="text-[10px] sm:text-xs italic text-steel-500 text-center leading-snug px-1">Earlier transformation — TRT &amp; lifestyle</p>
            </div>
            <div className="flex flex-col gap-2">
              <img src="/20260419_221404.jpg" alt="Transformation — Nov 2025 to April 2026" className="w-full h-auto rounded-xl sm:rounded-2xl shadow-xl object-cover" />
              <p className="text-[10px] sm:text-xs italic text-steel-500 text-center leading-snug px-1">Nov 2025 → Apr 2026 — peptides only, zero TRT</p>
            </div>
          </div>
          <p className="mt-3 text-xs italic text-steel-500 leading-relaxed text-center max-w-2xl mx-auto">
            Individual results vary. Your clinician will design a plan based on your labs and health history.
          </p>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf max-w-4xl">
          <div className="text-center mb-12">
            <Eyebrow>Meet The Co-Founders</Eyebrow>
            <H2>Built by two. <span className="text-metallic-gold">For everyone like us.</span></H2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <CoFounderCard
              name="Bryan Easterling"
              role="Co-Founder"
              tagline="The proof. The protocol. The patient who wouldn't quit."
              body="Lost the weight, rebuilt the labs, restored the man. Bryan leads protocol design and patient experience — every plan we offer has been tested first against his own life."
            />
            <CoFounderCard
              name="Holly Easterling"
              role="Co-Founder"
              tagline="The partner who stood in the setback and helped rebuild from it."
              body="Holly walked into my life after the first transformation — and stood with me through the regain that almost undid it. She co-founded TrueForge to turn what we learned the second time around into something other families can actually use, driving our patient care standards and our commitment to keep learning."
            />
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-tf max-w-3xl text-center">
          <H2>Your story doesn't end here. <span className="text-metallic-gold">It restarts.</span></H2>
          <p className="mt-5 text-steel-600 text-lg">15 minutes. No commitment. Just the same conversation I wish someone had with me when I was where you are.</p>
          <div className="mt-8"><Link to="/book" className="btn-forge">Book Your 15-Minute Call <ArrowRight className="w-4 h-4" /></Link></div>
        </div>
      </section>
    </>
  );
}

function CoFounderCard({ name, role, tagline, body }: { name: string; role: string; tagline: string; body: string }) {
  return (
    <div className="card-lift bg-white rounded-3xl border border-cream-200 p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-forge-500/10 flex items-center justify-center">
          <Heart className="w-5 h-5 text-forge-500" />
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-forge-500 font-semibold">{role}</span>
      </div>
      <h3 className="font-display text-3xl text-steel-900">{name}</h3>
      <p className="mt-2 text-forge-600 font-medium italic">{tagline}</p>
      <p className="mt-4 text-steel-600 leading-relaxed">{body}</p>
    </div>
  );
}
