import { useEffect, useState } from 'react';
import { X, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from '../lib/router';
import { useAuth } from '../lib/auth';

const SESSION_KEY = 'tf_popup_seen';
const DELAY_MS = 3500;

export default function EntrancePopup() {
  const { session, loading } = useAuth();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (session) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const t = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    }, DELAY_MS);

    return () => clearTimeout(t);
  }, [loading, session]);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, '1');
    setTimeout(() => setMounted(false), 400);
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-400 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-steel-900/75 backdrop-blur-sm" />

      {/* Panel */}
      <div className={`relative w-full max-w-md transition-all duration-400 ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="relative bg-steel-900 border border-steel-700 rounded-[28px] overflow-hidden shadow-2xl">
          {/* Gold accent top bar */}
          <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #b8895a 0%, #f3d18b 40%, #d4a86a 70%, #b8895a 100%)' }} />

          {/* Glow orb */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-forge-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-forge-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative p-8 md:p-10">
            {/* Close */}
            <button
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-cream-200/50 hover:text-cream-50 hover:bg-steel-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forge-500/15 border border-forge-500/35 text-forge-300 text-xs uppercase tracking-[0.22em] font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Member Offer
            </div>

            {/* Headline */}
            <h2 className="font-display text-4xl md:text-5xl text-cream-50 leading-tight">
              Save <span className="text-metallic-gold">10%</span> Instantly
            </h2>

            {/* Body */}
            <p className="mt-4 text-cream-200/80 text-base leading-relaxed">
              Create your free account today and get{' '}
              <span className="text-cream-50 font-semibold">10% off your first month of membership</span>.
              No obligation. No credit card required to join.
            </p>

            {/* Value points */}
            <ul className="mt-5 space-y-2.5">
              {[
                'Personalized dashboard from day one',
                'Access to your care team when you are ready',
                'Member pricing unlocked on all protocols',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-cream-200/75">
                  <ShieldCheck className="w-4 h-4 text-forge-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              to="/login"
              onClick={dismiss}
              className="mt-8 btn-gold w-full text-base py-4 justify-center"
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="mt-4 text-xs text-cream-200/40 text-center">
              Already have an account?{' '}
              <Link to="/login" onClick={dismiss} className="text-forge-300 hover:text-forge-200 font-semibold transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
