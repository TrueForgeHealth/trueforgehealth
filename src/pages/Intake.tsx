import { useEffect, useState } from 'react';
import { ArrowRight, ClipboardList, ExternalLink, Calendar, ListChecks, CheckCircle2 } from 'lucide-react';
import { Link } from '../lib/router';
import { Eyebrow, H2 } from '../components/Section';
import { MedicalDisclaimerBanner } from '../components/LegalNotice';
import { EXTERNAL } from '../lib/links';
import PaidMemberGate from '../components/PaidMemberGate';

function IntakeContent() {
  const [goal, setGoal] = useState('');
  useEffect(() => { setGoal(sessionStorage.getItem('tf_goal') || ''); }, []);

  return (
    <>
      <section className="bg-steel-900 text-cream-50 py-20 px-5 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-forge-glow" />
        <div className="container-tf relative max-w-4xl">
          <Eyebrow>Step 2 of 3 — Patient Intake</Eyebrow>
          <H2 light>Your file <span className="text-metallic">starts here.</span></H2>
          <p className="mt-6 text-lg text-cream-200/80">
            Your consultation is on the calendar. Now let's get your patient file open so your clinician walks into the call with everything they need.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
            <Step done label="Consult booked" icon={Calendar} />
            <span className="text-cream-200/30">—</span>
            <Step active label="Patient intake" icon={ClipboardList} />
            <span className="text-cream-200/30">—</span>
            <Step label="Questionnaires" icon={ListChecks} />
          </div>
        </div>
      </section>

      <section className="section bg-cream-50">
        <div className="container-tf max-w-3xl">
          <div className="mb-8">
            <MedicalDisclaimerBanner tone="light" />
          </div>
          <div className="bg-white rounded-3xl border border-cream-200 p-10 shadow-xl">
            <ClipboardList className="w-10 h-10 text-forge-500 mb-5" />
            <h3 className="font-display text-3xl mb-3">Patient Setup Form</h3>
            <p className="text-steel-600 mb-6">
              Hosted securely through our clinical partner. Takes about 8–10 minutes. Have your medications, allergies, and recent labs ready if you have them.
            </p>
            <a href={EXTERNAL.intake} target="_blank" rel="noreferrer" className="btn-forge w-full">
              Open Patient Intake <ExternalLink className="w-4 h-4" />
            </a>
            <ul className="mt-7 space-y-2 text-sm text-steel-600">
              <li>HIPAA-compliant secure submission</li>
              <li>Save and resume if you need to step away</li>
              <li>Auto-routes to your care team upon completion</li>
            </ul>
          </div>

          <div className="mt-8 bg-cream-100 rounded-3xl border border-cream-200 p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-steel-900 text-cream-50 flex items-center justify-center flex-shrink-0 font-display text-xl">3</div>
              <div className="flex-1">
                <h4 className="font-display text-2xl mb-2">Next: Questionnaires</h4>
                <p className="text-steel-600 mb-5">
                  Once your intake is in, head to the questionnaires. We'll highlight the ones most relevant to {goal ? <em className="text-forge-600 not-italic">"{goal}"</em> : 'what brought you in'} — but the more you complete, the sharper your consult will be.
                </p>
                <Link to="/questionnaires" className="btn-dark">
                  Continue To Questionnaires <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-steel-500 text-sm">
            Haven't booked yet? <Link to="/book" className="text-forge-600 font-semibold">Book your 15-minute call first</Link>.
          </p>
        </div>
      </section>
    </>
  );
}

export default function Intake() {
  return (
    <PaidMemberGate context="the patient intake form">
      <IntakeContent />
    </PaidMemberGate>
  );
}

function Step({ label, icon: Icon, done, active }: { label: string; icon: typeof Calendar; done?: boolean; active?: boolean }) {
  const cls = done
    ? 'bg-forge-500 text-cream-50 border-forge-500'
    : active
    ? 'bg-cream-50 text-steel-900 border-cream-50'
    : 'bg-transparent text-cream-200/60 border-cream-200/30';
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${cls}`}>
      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
      {label}
    </span>
  );
}
