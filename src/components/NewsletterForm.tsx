import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';

type Variant = 'hero' | 'compact';

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/newsletter-subscribe`;

export default function NewsletterForm({ source, variant = 'hero' }: { source: string; variant?: Variant }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('busy');
    setMessage(null);
    try {
      const res = await fetch(FN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY as string,
        },
        body: JSON.stringify({ email, source, siteUrl: window.location.origin }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Something went wrong.');
      setStatus('done');
      setMessage(data?.already_confirmed
        ? "You're already on the list — thank you."
        : "Check your inbox for a confirmation link to finish signing up.");
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={submit} className="space-y-2.5">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-200/50" />
            <input
              required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full pl-11 pr-4 py-3 rounded-full bg-steel-800 border border-steel-700 text-cream-50 placeholder:text-cream-200/40 focus:border-forge-500 focus:outline-none text-sm"
            />
          </div>
          <button disabled={status === 'busy'} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-forge-500 hover:bg-forge-600 text-cream-50 font-semibold text-sm transition disabled:opacity-50">
            {status === 'busy' ? 'Sending...' : 'Subscribe'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        {status === 'done' && <p className="text-xs text-forge-300 inline-flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {message}</p>}
        {status === 'error' && <p className="text-xs text-red-400">{message}</p>}
        <p className="text-[11px] text-cream-200/50">We hate spam too. Unsubscribe anytime.</p>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
        <div className="relative flex-1">
          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-200/40" />
          <input
            required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full pl-13 pl-12 pr-5 py-4 rounded-full bg-steel-800/80 border border-cream-50/15 text-cream-50 placeholder:text-cream-200/40 focus:border-forge-500 focus:outline-none text-base backdrop-blur"
          />
        </div>
        <button disabled={status === 'busy'} className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-forge-500 hover:bg-forge-600 text-cream-50 font-semibold transition shadow-xl shadow-forge-500/30 disabled:opacity-50">
          {status === 'busy' ? 'Sending...' : 'Join the List'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      {status === 'done' && (
        <p className="text-sm text-forge-300 inline-flex items-center gap-2 justify-center w-full"><CheckCircle2 className="w-4 h-4" /> {message}</p>
      )}
      {status === 'error' && <p className="text-sm text-red-400 text-center">{message}</p>}
      <p className="text-xs text-cream-200/50 text-center">We hate spam too. Unsubscribe anytime.</p>
    </form>
  );
}
