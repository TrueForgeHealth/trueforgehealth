import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anon);

export type LeadInput = {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  source_page?: string;
  interest?: string;
  notes?: string;
};

export async function captureLead(input: LeadInput) {
  return supabase.from('leads').insert(input).select('id').maybeSingle();
}

export async function captureConsultation(input: { email: string; goal: string; lead_id?: string }) {
  return supabase.from('consultations').insert(input).select('id').maybeSingle();
}

export async function captureQuiz(input: { email: string; answers: Record<string, unknown>; recommendation: string }) {
  return supabase.from('quiz_responses').insert(input).select('id').maybeSingle();
}

export type CartItem = {
  id: string;
  user_id: string;
  product: string;
  concentration: string;
  pharmacy: string;
  category: string;
  price: number;
  kind: 'product' | 'stack';
  notes: string;
  created_at: string;
};

export type MemberProfile = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  dob: string | null;
  state: string;
  primary_goal: string;
  notes: string;
  updated_at: string;
};
