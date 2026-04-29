import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

const PAID_STATUSES = new Set(['active', 'founders', 'lifetime']);

async function checkIsAdmin(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  const rpc = await supabase.rpc('is_admin');
  if (!rpc.error && rpc.data === true) return true;
  const fallback = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', userId)
    .maybeSingle();
  return Boolean(fallback.data?.id);
}

async function checkIsPaidMember(userId: string | undefined): Promise<boolean> {
  if (!userId) return false;
  const { data } = await supabase
    .from('member_profiles')
    .select('membership_status')
    .eq('id', userId)
    .maybeSingle();
  return Boolean(data?.membership_status && PAID_STATUSES.has(data.membership_status));
}

type AuthCtx = {
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isPaidMember: boolean;
  membershipLoading: boolean;
  refreshAdmin: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
};

const Ctx = createContext<AuthCtx>({
  session: null,
  loading: true,
  isAdmin: false,
  isPaidMember: false,
  membershipLoading: true,
  refreshAdmin: async () => {},
  signIn: async () => ({ error: 'not ready' }),
  signUp: async () => ({ error: 'not ready' }),
  signOut: async () => {},
  resetPassword: async () => ({ error: 'not ready' }),
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPaidMember, setIsPaidMember] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(true);

  const refreshAdmin = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid) { setIsAdmin(false); return; }
    setIsAdmin(await checkIsAdmin(uid));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      (async () => {
        if (!s) { setIsAdmin(false); return; }
        setIsAdmin(await checkIsAdmin(s.user.id));
      })();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!session) {
      setIsAdmin(false);
      setIsPaidMember(false);
      setMembershipLoading(false);
      return;
    }
    setMembershipLoading(true);
    (async () => {
      const [adminResult, paidResult] = await Promise.all([
        checkIsAdmin(session.user.id),
        checkIsPaidMember(session.user.id),
      ]);
      if (!cancelled) {
        setIsAdmin(adminResult);
        setIsPaidMember(paidResult);
        setMembershipLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [session]);

  useEffect(() => {
    const onFocus = () => { refreshAdmin(); };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refreshAdmin]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };
  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  };
  const signOut = async () => { await supabase.auth.signOut(); };
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#/login`,
    });
    return { error: error?.message ?? null };
  };

  return <Ctx.Provider value={{ session, loading, isAdmin, isPaidMember, membershipLoading, refreshAdmin, signIn, signUp, signOut, resetPassword }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
