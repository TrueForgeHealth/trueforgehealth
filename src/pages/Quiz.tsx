import { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useRouter } from '../lib/router';
import { Eyebrow, H2 } from '../components/Section';
import { captureLead, captureQuiz } from '../lib/supabase';

const questions = [
  { key: 'goal', q: 'What\'s your #1 goal right now?', options: ['Lose weight', 'Restore energy / hormones', 'Improve performance / libido', 'Hair, skin, recovery', 'Not sure yet'] },
  { key: 'feel', q: 'How do you feel most days?', options: ['Tired and foggy', 'Frustrated with my body', 'Like I\'ve lost my edge', 'Pretty good — want to optimize'] },
  { key: 'tried', q: 'What have you already tried?', options: ['Diets and gyms', 'Other clinics or telehealth', 'Nothing serious yet', 'A little of everything'] },
  { key: 'commit', q: 'Where are you in the decision?', options: ['Ready to start', 'Curious — exploring', 'Need a real plan first'] },
];

export default function Quiz() {
  const { navigate } = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const select = async (val: string) => {
    const newAns = { ...answers, [questions[step].key]: val };
    setAnswers(newAns);
    if (step < questions.length - 1) setStep(step + 1);
    else setDone(true);
  };

  const recommend = (a: Record<string, string>) => {
    if (a.goal?.includes('Lose weight')) return 'Weight Loss / GLP Protocol';
    if (a.goal?.includes('hormones')) return 'Hormone Optimization';
    if (a.goal?.includes('performance')) return 'Performance + Sexual Wellness';
    if (a.goal?.includes('Hair')) return 'Aesthetic + Hair / Skin';
    return 'Membership Onboarding Call';
  };

  const finish = async (e: React.FormEvent) => {
    e.preventDefault();
    const rec = recommend(answers);
    await captureLead({ email, source_page: 'quiz', interest: rec, notes: JSON.stringify(answers) });
    await captureQuiz({ email, answers, recommendation: rec });
    navigate('/book');
  };

  return (
    <section className="min-h-[80vh] bg-steel-900 text-cream-50 py-24 px-5 md:px-10">
      <div className="container-tf max-w-2xl">
        <Eyebrow>Find My Best Option</Eyebrow>
        <H2 light>Four questions. <span className="text-metallic">A real recommendation.</span></H2>

        <div className="mt-10 bg-steel-800 border border-steel-700 rounded-3xl p-8 md:p-10">
          {!done ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-forge-300">Question {step + 1} of {questions.length}</span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <span key={i} className={`h-1 w-8 rounded-full ${i <= step ? 'bg-forge-500' : 'bg-steel-700'}`} />
                  ))}
                </div>
              </div>
              <h3 className="font-display text-2xl md:text-3xl mb-6">{questions[step].q}</h3>
              <div className="space-y-3">
                {questions[step].options.map((o) => (
                  <button key={o} onClick={() => select(o)} className="w-full text-left p-4 rounded-xl bg-steel-900 border border-steel-700 hover:border-forge-500 hover:bg-steel-900/80 transition flex items-center justify-between group">
                    <span>{o}</span>
                    <ArrowRight className="w-4 h-4 text-forge-400 group-hover:translate-x-1 transition" />
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="mt-6 text-cream-200/70 hover:text-forge-300 inline-flex items-center gap-1 text-sm">
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
              )}
            </>
          ) : (
            <form onSubmit={finish}>
              <span className="text-xs uppercase tracking-[0.3em] text-forge-300">Your Recommendation</span>
              <h3 className="font-display text-3xl my-3">{recommend(answers)}</h3>
              <p className="text-cream-200/70 mb-7">Drop your email and we'll prep your file before the consult so the call is faster, sharper, and more useful.</p>
              <input required type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-steel-900 border border-steel-700 text-cream-50 focus:border-forge-500 focus:outline-none" />
              <button className="mt-5 w-full btn-forge">See My Plan & Book Consult <ArrowRight className="w-4 h-4" /></button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-cream-200/60 text-sm">
          Already know what you need? <Link to="/book" className="text-forge-300 font-semibold">Skip to booking</Link>
        </p>
      </div>
    </section>
  );
}
