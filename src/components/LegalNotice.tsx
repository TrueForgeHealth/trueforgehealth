import { ShieldAlert, ChevronDown } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Link } from '../lib/router';

export function MedicalDisclaimerBanner({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark';
  return (
    <div
      className={
        dark
          ? 'rounded-2xl border border-forge-500/30 bg-steel-800/70 p-5 text-cream-100'
          : 'rounded-2xl border border-forge-500/25 bg-cream-100/80 p-5 text-steel-700'
      }
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className={`w-5 h-5 mt-0.5 flex-none ${dark ? 'text-forge-300' : 'text-forge-500'}`} />
        <div className="text-sm leading-relaxed">
          <p className={`uppercase tracking-[0.25em] text-xs font-semibold mb-2 ${dark ? 'text-forge-300' : 'text-forge-600'}`}>
            Medical &amp; Wellness Disclaimer
          </p>
          <p>
            TrueForge Health &amp; Wellness provides general wellness coaching, educational resources,
            member portal access, and personalized support services only. All information, protocols,
            recommendations, and communications are for informational and educational purposes only.
            They are not intended to diagnose, treat, cure, or prevent any disease or medical
            condition and do not constitute medical advice, diagnosis, or treatment.
          </p>
          <p className="mt-2">
            You are solely responsible for your own health decisions. We strongly recommend you
            consult with a qualified healthcare provider before making any changes to your diet,
            exercise, supplementation, medication, or health regimen. TrueForge and its team are not
            liable for any injury, illness, or adverse outcome related to the use of our services or
            information provided.
          </p>
        </div>
      </div>
    </div>
  );
}

export function CancellationAccordion({ tone = 'dark' }: { tone?: 'light' | 'dark' }) {
  const [open, setOpen] = useState(false);
  const dark = tone === 'dark';
  return (
    <div
      className={
        dark
          ? 'rounded-xl border border-steel-600 bg-steel-700/60 overflow-hidden'
          : 'rounded-xl border border-cream-200 bg-cream-50 overflow-hidden'
      }
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium ${
          dark ? 'text-cream-50 hover:bg-steel-700' : 'text-steel-900 hover:bg-cream-100'
        }`}
      >
        <span className="uppercase tracking-[0.2em] text-xs">Cancellation &amp; Refund Policy</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className={`px-5 pb-5 text-sm leading-relaxed space-y-3 ${
            dark ? 'text-cream-100/85' : 'text-steel-700'
          }`}
        >
          <p>
            <strong>30-Day Notice.</strong> Membership is month-to-month. To cancel, send written
            notice to admin@trueforgehealth.com at least thirty (30) days before your next billing
            date. Cancellations received with less than 30 days&rsquo; notice take effect at the end
            of the following billing cycle.
          </p>
          <p>
            <strong>No Refunds for Partial Months.</strong> Membership fees are non-refundable, in
            whole or in part, for any period during which membership is active &mdash; including
            partial months, unused time, or unused services.
          </p>
          <p>
            <strong>No Refunds for Relocation.</strong> If you move outside our service area, are
            unable to receive a particular treatment in your jurisdiction, or otherwise cannot
            continue care, your membership remains non-refundable. We will assist with records
            transfer where applicable.
          </p>
          <p>
            <strong>Founders Edition (First 10 Members).</strong> The first ten (10) members who
            enroll under the Founders Edition lock in legacy pricing for life. If a Founders Edition
            member cancels for any reason, a one-time service credit equal to their most recent
            month&rsquo;s membership fee will be issued toward future TrueForge services within
            twelve (12) months. Lifetime Founders pricing cannot be reinstated once cancelled.
          </p>
          <p>
            <strong>Suspension &amp; Termination.</strong> TrueForge may suspend or terminate
            membership for non-payment, abusive conduct, or violation of these terms. Outstanding
            fees remain due.
          </p>
        </div>
      )}
    </div>
  );
}

export function LegalLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs ${className}`}>
      <Link to="/disclaimer" className="underline-offset-4 hover:underline">Medical Disclaimer</Link>
      <span className="opacity-40">|</span>
      <span className="underline-offset-4">Cancellation Policy</span>
      <span className="opacity-40">|</span>
      <Link to="/terms" className="underline-offset-4 hover:underline">Terms of Service</Link>
      <span className="opacity-40">|</span>
      <Link to="/privacy" className="underline-offset-4 hover:underline">Privacy Policy</Link>
    </div>
  );
}

export function LegalPageShell({ title, eyebrow, updated, children }: {
  title: string;
  eyebrow: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="bg-steel-900 text-cream-50 py-20 px-5 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-forge-glow" />
        <div className="container-tf relative max-w-4xl">
          <p className="uppercase tracking-[0.3em] text-xs text-forge-300 mb-4">{eyebrow}</p>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] tracking-tight">{title}</h1>
          <p className="mt-4 text-sm text-cream-200/60">Last updated {updated}</p>
        </div>
      </section>
      <section className="section bg-cream-50">
        <div className="container-tf max-w-3xl">
          <article className="prose-legal bg-white border border-cream-200 rounded-3xl p-8 md:p-12 shadow-sm">
            {children}
          </article>
        </div>
      </section>
    </>
  );
}
