import { ReactNode } from 'react';
import { Crown, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { Link } from '../lib/router';
import { useAuth } from '../lib/auth';

interface Props {
  children: ReactNode;
  context?: string;
}

export default function PaidMemberGate({ children, context = 'this content' }: Props) {
  const { session, loading, isPaidMember, membershipLoading } = useAuth();

  if (loading || membershipLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-7 h-7 text-forge-500 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <section className="min-h-[80vh] bg-steel-900 text-cream-50 flex items-center justify-center px-5 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-forge-glow" />
        <div className="relative w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-forge-500/20 border border-forge-500/40 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7 text-forge-300" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-forge-300 font-semibold mb-3">Members Only</p>
          <h2 className="font-display text-4xl text-cream-50 mb-4">Sign in to continue</h2>
          <p className="text-cream-200/70 mb-8">
            {context} is available to TrueForge members. Sign in or create your free account to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/login" className="btn-forge">Sign In <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/login" className="btn-ghost-light">Create Free Account</Link>
          </div>
        </div>
      </section>
    );
  }

  if (!isPaidMember) {
    return (
      <section className="min-h-[80vh] bg-steel-900 text-cream-50 flex items-center justify-center px-5 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-forge-glow" />
        <div className="relative w-full max-w-lg">
          <div className="bg-steel-800 border border-steel-700 rounded-3xl p-10 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-forge-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              {/* Gold accent bar */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full"
                style={{ background: 'linear-gradient(90deg, #b8895a 0%, #f3d18b 50%, #b8895a 100%)' }} />

              <div className="w-16 h-16 rounded-2xl bg-forge-500/20 border border-forge-500/40 flex items-center justify-center mx-auto mb-6">
                <Crown className="w-7 h-7 text-forge-300" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forge-500/15 border border-forge-400/40 text-forge-300 text-[10px] uppercase tracking-[0.22em] font-semibold mb-4">
                Paid Members Only
              </span>

              <h2 className="font-display text-4xl text-cream-50 mb-4">
                Upgrade to access {context}
              </h2>
              <p className="text-cream-200/70 text-base leading-relaxed mb-2">
                Your free account is active — great start. To access the price list, intake forms, and health questionnaires, upgrade to a paid TrueForge membership.
              </p>
              <p className="text-cream-200/50 text-sm mb-8">
                Starting at <span className="text-cream-50 font-semibold">$99/month</span>. Cancel anytime with 30 days' notice.
              </p>

              <div className="space-y-3">
                <Link to="/membership" className="btn-gold w-full text-base py-4 justify-center">
                  Upgrade My Membership <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/book" className="btn-ghost-light w-full py-3.5 text-sm justify-center">
                  Book a Free 15-Min Call First
                </Link>
              </div>

              <p className="mt-6 text-xs text-cream-200/40">
                Already upgraded and seeing this? <Link to="/login" className="text-forge-300 hover:text-forge-200 font-semibold transition">Sign out and back in</Link> to refresh your access.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
