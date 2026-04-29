/*
  # Restore is_admin() to SECURITY DEFINER

  ## Background
  Migration 20260428100124_fix_security_issues_revised.sql changed
  is_admin() to SECURITY INVOKER and revoked EXECUTE from authenticated.
  This silently broke every admin RLS policy that calls is_admin(), and
  caused the front-end auth.tsx supabase.rpc('is_admin') call to deny
  admin access — making the Admin Trainers/Referrals tabs invisible to
  legitimate admins.

  ## Changes
  1. Change is_admin() back to SECURITY DEFINER so it can read the
     admin_users table regardless of caller's RLS.
  2. Re-grant EXECUTE on is_admin() to authenticated so the front-end
     RPC and policy lookups succeed for legitimate admins.
  3. Lock down the search_path on is_admin() to prevent function
     hijacking — this is the common safety pattern for SECURITY DEFINER.

  ## Security
  is_admin() does not accept arguments and only returns whether the
  current auth.uid() is in admin_users. SECURITY DEFINER is appropriate
  here because the function MUST read admin_users (which is RLS-locked
  to admins only) to determine the answer.

  ## Notes
  This restores the original intent of migration
  20260427040019_admin_access.sql.
*/

ALTER FUNCTION public.is_admin() SECURITY DEFINER;
ALTER FUNCTION public.is_admin() SET search_path = public, pg_temp;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
