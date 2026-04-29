import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, AlertCircle } from 'lucide-react';
import { Eyebrow, H2 } from '../components/Section';
import { Link } from '../lib/router';

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/newsletter-confirm`;

export default function NewsletterConfirm() {
  const [state, setState] = useState<'busy' | 'ok' | 'error'>('busy');
  const [message, setMessage] = useState<string>('Confirming your subscription...');

  useEffect(() => {
    const hash = window.location.hash;
    const qIdx = hash.indexOf('?');
    const params = new URLSearchParams(qIdx >= 0 ? hash.slice(qIdx + 1) : '');
    const token = params.get('token');
    if (!token) { setState('error'); setMessage('Missing confirmation token.'); return; }

    (async () => {
      try {
        const res = await fetch(`${FN_URL}?token=${encodeURIComponent(token)}&siteUrl=${encodeURIComponent(window.location.origin)}`, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY as string,
          },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Could not confirm.');
        setState('ok');
        setMessage(data?.already_confirmed
          ? "You're already confirmed — thank you for being on the list."
          : "You're in. Welcome to the TrueForge list.");
      } catch (e) {
        setState('error');
        setMessage((e as Error).message);
      }
    })();
  }, []);

  return (
    <section className="min-h-[80vh] bg-steel-900 text-cream-50 flex items-center justify-center px-5 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-forge-glow opacity-50" />
      <div className="relative max-w-md w-full bg-steel-800 border border-steel-700 rounded-3xl p-10 shadow-2xl text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${state === 'ok' ? 'bg-forge-500/20 border border-forge-500/40' : state === 'error' ? 'bg-red-500/20 border border-red-500/40' : 'bg-cream-50/10 border border-cream-50/20'}`}>
          {state === 'ok' ? <CheckCircle2 className="w-6 h-6 text-forge-300" /> : state === 'error' ? <AlertCircle className="w-6 h-6 text-red-300" /> : <Mail className="w-6 h-6 text-cream-200" />}
        </div>
        <Eyebrow>The TrueForge List</Eyebrow>
        <H2 light>
          {state === 'ok' && <>You're <span className="text-metallic">in.</span></>}
          {state === 'busy' && <>Confirming<span className="text-metallic">...</span></>}
          {state === 'error' && <>Something <span className="text-metallic">went wrong.</span></>}
        </H2>
        <p className="mt-4 text-cream-200/70 text-sm">{message}</p>
        <Link to="/" className="mt-7 btn-forge w-full">Back to Home <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </section>
  );
}
