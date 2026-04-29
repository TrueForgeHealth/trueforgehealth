import { useEffect, useState } from 'react';
import { ArrowRight, Lock, Mail, KeyRound, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Eyebrow, H2 } from '../components/Section';
import { useAuth } from '../lib/auth';
import { useRouter } from '../lib/router';

type Mode = 'signin' | 'signup' | 'reset';

export default function Login() {
  const { session, loading, signIn, signUp, resetPassword } = useAuth();
  const { navigate } = useRouter();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate('/portal');
  }, [loading, session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null); setInfo(null);
    if (mode === 'reset') {
      const { error } = await resetPassword(email);
      if (error) setErr(error);
      else setInfo('If an account exists for that email, a password reset link is on its way.');
    } else {
      const fn = mode === 'signin' ? signIn : signUp;
      const { error } = await fn(email, password);
      if (error) setErr(error);
      else if (mode === 'signup') setInfo('Account created. Signing you in...');
    }
    setBusy(false);
  };

  return (
    <section className="min-h-[80vh] bg-steel-900 text-cream-50 px-5 md:px-10 py-24 flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-forge-glow opacity-60" />
      <div className="container-tf max-w-md mx-auto relative">
        <div className="bg-steel-800 border border-steel-700 rounded-3xl p-10 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-forge-500/20 border border-forge-500/40 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-6 h-6 text-forge-300" />
          </div>
          <Eyebrow>Member Portal</Eyebrow>
          <H2 light>
            {mode === 'signin' && <>Welcome <span className="text-metallic">back.</span></>}
            {mode === 'signup' && <>Create your <span className="text-metallic">account.</span></>}
            {mode === 'reset' && <>Reset your <span className="text-metallic">password.</span></>}
          </H2>
          <p className="mt-4 text-cream-200/70 text-sm">
            {mode === 'signin' && 'Sign in to access your file, prospective cart, and care team.'}
            {mode === 'signup' && 'Activate your TrueForge member account to unlock your portal.'}
            {mode === 'reset' && 'Enter your email and we will send you a secure reset link.'}
          </p>

          <form onSubmit={submit} className="mt-7 space-y-3">
            <label className="block">
              <span className="sr-only">Email</span>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-200/50" />
                <input
                  required type="email" autoComplete="email"
                  placeholder="you@email.com" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-steel-900 border border-steel-700 text-cream-50 placeholder:text-cream-200/40 focus:border-forge-500 focus:outline-none"
                />
              </div>
            </label>

            {mode !== 'reset' && (
              <label className="block">
                <span className="sr-only">Password</span>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream-200/50" />
                  <input
                    required type={showPassword ? 'text' : 'password'} minLength={6}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 rounded-xl bg-steel-900 border border-steel-700 text-cream-50 placeholder:text-cream-200/40 focus:border-forge-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-cream-200/60 hover:text-forge-300 hover:bg-steel-700/50 focus:outline-none focus:text-forge-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>
            )}

            {err && <p className="text-sm text-red-400">{err}</p>}
            {info && <p className="text-sm text-forge-300">{info}</p>}

            <button disabled={busy} className="w-full btn-forge disabled:opacity-50">
              {busy ? 'Working...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-cream-200/60">
            {mode === 'signin' ? (
              <>
                <button onClick={() => { setErr(null); setInfo(null); setMode('signup'); }} className="text-forge-300 font-semibold">Create account</button>
                <button onClick={() => { setErr(null); setInfo(null); setMode('reset'); }} className="text-cream-200/70 hover:text-forge-300">Forgot password?</button>
              </>
            ) : (
              <button onClick={() => { setErr(null); setInfo(null); setMode('signin'); }} className="text-forge-300 font-semibold">Back to sign in</button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-cream-200/50 inline-flex items-center gap-2 justify-center w-full">
          <ShieldCheck className="w-3.5 h-3.5" /> Secured with Supabase Auth. Trouble? admin@trueforgehealth.com
        </p>
      </div>
    </section>
  );
}
