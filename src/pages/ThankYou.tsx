import { ArrowRight, CheckCircle2, MailCheck, MessageSquare, Calendar } from 'lucide-react';
import { Link } from '../lib/router';
import { Eyebrow, H2 } from '../components/Section';
import { EXTERNAL } from '../lib/links';

export default function ThankYou() {
  return (
    <section className="min-h-[80vh] bg-steel-900 text-cream-50 px-5 md:px-10 py-24 relative overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-forge-glow" />
      <div className="container-tf max-w-3xl relative text-center">
        <CheckCircle2 className="w-20 h-20 text-forge-400 mx-auto mb-6" />
        <Eyebrow>You're In</Eyebrow>
        <H2 light>The forge is <span className="text-metallic">already lighting.</span></H2>
        <p className="mt-6 text-lg text-cream-200/80">You'll get a confirmation email within minutes and a reminder text 24 hours and 1 hour before your call. While you wait, here's what to do next.</p>

        <div className="mt-12 grid md:grid-cols-3 gap-5 text-left">
          {[
            { icon: MailCheck, t: 'Check your inbox', d: 'Confirmation email with everything you need on the way.' },
            { icon: MessageSquare, t: 'Reminders incoming', d: 'We\'ll text you 24h and 1h before to make sure you\'re ready.' },
            { icon: Calendar, t: 'Add to calendar', d: 'Hold the time. Most clients say this call changed everything.' },
          ].map((s) => (
            <div key={s.t} className="bg-steel-800/60 backdrop-blur border border-steel-700 p-6 rounded-2xl">
              <s.icon className="w-6 h-6 text-forge-400 mb-3" />
              <h3 className="font-display text-lg mb-1">{s.t}</h3>
              <p className="text-cream-200/70 text-sm">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/questionnaires" className="btn-forge">Finish Questionnaires <ArrowRight className="w-4 h-4" /></Link>
          <Link to="/portal" className="btn-ghost-light">Open My Portal</Link>
        </div>
        <p className="mt-6 text-sm text-cream-200/60">
          Want to lock in legacy pricing? <a href={EXTERNAL.founderPay} target="_blank" rel="noreferrer" className="text-forge-300 font-semibold underline">Founders Edition</a>
        </p>
      </div>
    </section>
  );
}
