import { useState } from 'react';
import { Copy, Check, Twitter, Facebook, Linkedin, MessageCircle } from 'lucide-react';

const FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/newsletter-subscribe`;

interface Props {
  referralUrl: string;
  referralCode: string;
}

const shareText = "I just joined the TrueForge Health list — real protocols, real results, built by people who lived it. Check it out:";

export function ReferralShare({ referralUrl, referralCode }: Props) {
  const [copied, setCopied] = useState(false);

  const trackShare = async (platform: string) => {
    await fetch(FN_URL.replace('newsletter-subscribe', 'referral-track'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY as string,
      },
      body: JSON.stringify({ referralCode, platform }),
    }).catch(() => {});
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
    trackShare('copy');
  };

  const shareLinks = [
    {
      label: 'X',
      icon: Twitter,
      color: 'hover:bg-black/10 hover:border-black/30',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralUrl)}`,
    },
    {
      label: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-blue-500/10 hover:border-blue-400/40',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}&quote=${encodeURIComponent(shareText)}`,
    },
    {
      label: 'LinkedIn',
      icon: Linkedin,
      color: 'hover:bg-sky-600/10 hover:border-sky-400/40',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
    },
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-green-500/10 hover:border-green-400/40',
      href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralUrl)}`,
    },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-forge-500/30 bg-gradient-to-br from-forge-500/10 via-transparent to-forge-400/5 p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-forge-300">Referral Bonus</span>
        <span className="px-2 py-0.5 rounded-full bg-forge-500/20 border border-forge-400/30 text-forge-300 text-[10px] font-semibold uppercase tracking-widest">5% Off</span>
      </div>
      <p className="text-cream-100 text-sm leading-relaxed mb-4">
        Share TrueForge with <span className="font-semibold text-forge-300">3 friends</span> using your unique link and get <span className="font-semibold text-forge-300">5% off your first coaching package or service upgrade</span>.
      </p>

      {/* Copy link row */}
      <div className="flex items-center gap-2 mb-4 bg-steel-800/70 border border-steel-700 rounded-full px-4 py-2.5">
        <span className="text-cream-200/60 text-xs truncate flex-1 font-mono">{referralUrl}</span>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-forge-300 hover:text-forge-200 transition"
        >
          {copied
            ? <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Copied!</span></>
            : <><Copy className="w-3.5 h-3.5" />Copy Link</>
          }
        </button>
      </div>

      {/* Social share buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-cream-200/50 text-xs">Share on:</span>
        {shareLinks.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackShare(s.label.toLowerCase())}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cream-50/15 text-cream-200 text-xs font-semibold transition-all duration-200 ${s.color}`}
          >
            <s.icon className="w-3.5 h-3.5" />
            {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}

interface FormWithReferralProps {
  source: string;
}

export function NewsletterWithReferral({ source }: FormWithReferralProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [referralData, setReferralData] = useState<{ code: string; url: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('busy');
    setMessage(null);
    try {
      const referralCode = new URLSearchParams(window.location.search).get('ref') ?? '';
      const res = await fetch(FN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY as string,
        },
        body: JSON.stringify({ email, source, siteUrl: window.location.origin, referralCode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Something went wrong.');
      setStatus('done');
      setMessage(data?.already_confirmed
        ? "You're already on the list — thank you."
        : "Check your inbox for a confirmation link to finish signing up.");
      if (data?.referralCode && data?.referralUrl) {
        setReferralData({ code: data.referralCode, url: data.referralUrl });
      }
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message);
    }
  };

  return (
    <div>
      <form onSubmit={submit} className="mt-7 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <div className="relative flex-1">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-200/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <input
              required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full pl-12 pr-5 py-4 rounded-full bg-steel-800/80 border border-cream-50/15 text-cream-50 placeholder:text-cream-200/40 focus:border-forge-500 focus:outline-none text-base backdrop-blur"
            />
          </div>
          <button disabled={status === 'busy'} className="btn-gold disabled:opacity-50">
            {status === 'busy' ? 'Sending...' : 'Join the List'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
        {status === 'done' && (
          <p className="text-sm text-forge-300 inline-flex items-center gap-2 justify-center w-full">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {message}
          </p>
        )}
        {status === 'error' && <p className="text-sm text-red-400 text-center">{message}</p>}
        <p className="text-xs text-cream-200/50 text-center">We hate spam too. Unsubscribe anytime.</p>
      </form>

      {/* Referral offer — always visible below the form */}
      {status !== 'done' && (
        <div className="mt-6 rounded-2xl border border-forge-500/30 bg-gradient-to-br from-forge-500/10 via-transparent to-forge-400/5 p-5 max-w-xl mx-auto text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-forge-300">Referral Bonus</span>
            <span className="px-2 py-0.5 rounded-full bg-forge-500/20 border border-forge-400/30 text-forge-300 text-[10px] font-semibold uppercase tracking-widest">5% Off</span>
          </div>
          <p className="text-cream-200/80 text-sm leading-relaxed">
            Submit your email and share TrueForge with <span className="font-semibold text-forge-300">3 friends</span> to get <span className="font-semibold text-forge-300">5% off your first coaching package or service upgrade</span>. Your unique referral link is generated instantly after signup.
          </p>
        </div>
      )}

      {/* Post-signup referral share panel */}
      {status === 'done' && referralData && (
        <div className="max-w-xl mx-auto">
          <ReferralShare referralCode={referralData.code} referralUrl={referralData.url} />
        </div>
      )}
    </div>
  );
}
