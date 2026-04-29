import { useEffect, useState } from 'react';
import { ArrowRight, Check, ExternalLink, Sparkles, Star, ClipboardList } from 'lucide-react';
import { Link } from '../lib/router';
import { Eyebrow, H2 } from '../components/Section';
import { MedicalDisclaimerBanner } from '../components/LegalNotice';
import { QUESTIONNAIRES, QuestionnaireSlug, recommendedSlugs } from '../lib/links';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import PaidMemberGate from '../components/PaidMemberGate';

function QuestionnairesContent() {
  const { session } = useAuth();
  const [goal, setGoal] = useState<string>('');
  const [completed, setCompleted] = useState<Set<QuestionnaireSlug>>(new Set());
  const [busy, setBusy] = useState<QuestionnaireSlug | null>(null);

  useEffect(() => {
    setGoal(sessionStorage.getItem('tf_goal') || '');
  }, []);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data } = await supabase
        .from('questionnaire_completions')
        .select('slug, completed_at')
        .eq('user_id', session.user.id)
        .not('completed_at', 'is', null);
      const set = new Set<QuestionnaireSlug>();
      (data || []).forEach((r) => set.add(r.slug as QuestionnaireSlug));
      setCompleted(set);
    })();
  }, [session]);

  const recommended = goal ? recommendedSlugs(goal) : [];

  const markComplete = async (slug: QuestionnaireSlug) => {
    setBusy(slug);
    if (session) {
      await supabase.from('questionnaire_completions').insert({
        user_id: session.user.id,
        email: session.user.email || '',
        slug,
        completed_at: new Date().toISOString(),
      });
    }
    setCompleted(new Set([...completed, slug]));
    setBusy(null);
  };

  return (
    <>
      <section className="bg-steel-900 text-cream-50 py-20 px-5 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-forge-glow" />
        <div className="container-tf relative max-w-4xl">
          <Eyebrow>Step 3 of 3 — Questionnaires</Eyebrow>
          <H2 light>Help your clinician <span className="text-metallic">prep your file.</span></H2>
          <p className="mt-6 text-lg text-cream-200/80">
            Each questionnaire takes 5–8 minutes. We highlight the ones most relevant to what brought you in — but the more you complete, the sharper your consult will be.
          </p>
          <div className="mt-7 inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-cream-50/10 border border-cream-50/20 backdrop-blur text-sm">
            <Sparkles className="w-4 h-4 text-forge-300" />
            <span>Recommended for you: <span className="text-forge-300 font-semibold">{goal || 'All — fill them all to be safe'}</span></span>
          </div>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf max-w-5xl mb-10">
          <MedicalDisclaimerBanner tone="light" />
        </div>
        <div className="container-tf grid md:grid-cols-3 gap-6">
          {QUESTIONNAIRES.map((q) => {
            const isRec = recommended.includes(q.slug) || recommended.length === 0;
            const isDone = completed.has(q.slug);
            return (
              <div key={q.slug} className={`relative card-lift bg-white rounded-3xl p-7 border-2 ${isRec ? 'border-forge-500' : 'border-cream-200'} flex flex-col`}>
                {isRec && (
                  <span className="absolute -top-3 left-7 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-forge-500 text-cream-50 text-xs uppercase tracking-widest">
                    <Star className="w-3 h-3" /> Recommended
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="w-11 h-11 rounded-xl bg-forge-500/10 flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-forge-500" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-steel-500 font-semibold">{q.category}</span>
                </div>
                <h3 className="font-display text-2xl text-steel-900 mb-3">{q.title}</h3>
                <p className="text-steel-600 text-sm flex-1 mb-6">{q.blurb}</p>
                <a
                  href={q.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full btn-forge mb-3"
                >
                  Open Questionnaire <ExternalLink className="w-4 h-4" />
                </a>
                {session && (
                  <button
                    onClick={() => markComplete(q.slug)}
                    disabled={isDone || busy === q.slug}
                    className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition ${
                      isDone ? 'bg-forge-600/10 text-forge-700 border border-forge-600/30' : 'border border-steel-300 hover:border-steel-800 hover:bg-steel-900 hover:text-cream-50 text-steel-700'
                    }`}
                  >
                    {isDone ? <><Check className="w-4 h-4" /> Marked complete</> : busy === q.slug ? 'Saving...' : 'I finished — mark complete'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-14 max-w-3xl mx-auto text-center">
          <p className="text-steel-600 text-lg">Done with what you can today? You can always come back to these from your portal.</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            {session ? (
              <Link to="/portal/documents" className="btn-forge">Go To My Portal <ArrowRight className="w-4 h-4" /></Link>
            ) : (
              <Link to="/portal" className="btn-forge">Sign In To Track Progress <ArrowRight className="w-4 h-4" /></Link>
            )}
            <Link to="/thank-you" className="btn-ghost">I'm done for now</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Questionnaires() {
  return (
    <PaidMemberGate context="health questionnaires">
      <QuestionnairesContent />
    </PaidMemberGate>
  );
}
