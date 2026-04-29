import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { Eyebrow, H2 } from '../components/Section';
import { Link } from '../lib/router';

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/newsletter-unsubscribe`;

export default function NewsletterUnsubscribe() {
  const [state, setState] = useState<'busy' | 'ok' | 'error'>('busy');
  const [message, setMessage] = useState<string>('Removing you from the list...');

  useEffect(() => {
    const hash = window.location.hash;
    const qIdx = hash.indexOf('?');
    const params = new URLSearchParams(qIdx >= 0 ? hash.slice(qIdx + 1) : '');
    const token = params.get('token');
    if (!token) { setState('error'); setMessage('Missing unsubscribe token.'); return; }

    (async () => {
      try {
        const res = await fetch(`${FN_URL}?token=${encodeURIComponent(token)}`, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY as string,
          },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Could not unsubscribe.');
        setState('ok');
        setMessage(`${data?.email ? data.email + ' has been ' : "You've been "}removed from the TrueForge list. We're sorry to see you go.`);
      } catch (e) {
        setState('error');
        setMessage((e as Error).message);
      }
    })();
  }, []);

  return (
    <section className="min-h-[80vh] bg-cream-50 flex items-center justify-center px-5 py-24">
      <div className="max-w-md w-full bg-white border border-cream-200 rounded-3xl p-10 shadow-xl text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${state === 'ok' ? 'bg-forge-500/10' : state === 'error' ? 'bg-red-50' : 'bg-cream-100'}`}>
          {state === 'ok' ? <CheckCircle2 className="w-6 h-6 text-forge-500" /> : state === 'error' ? <AlertCircle className="w-6 h-6 text-red-500" /> : <Mail className="w-6 h-6 text-steel-500" />}
        </div>
        <Eyebrow>Unsubscribe</Eyebrow>
        <H2>
          {state === 'ok' && <>You're unsubscribed.</>}
          {state === 'busy' && <>One moment...</>}
          {state === 'error' && <>Something went wrong.</>}
        </H2>
        <p className="mt-4 text-steel-600 text-sm">{message}</p>
        <Link to="/" className="mt-7 btn-forge w-full">Back to Home <ArrowRight className="w-4 h-4" /></Link>
      </div>
    </section>
  );
}
