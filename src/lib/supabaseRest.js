/**
 * supabaseRest.js
 * ───────────────
 * Single source of truth for all Supabase calls.
 * Uses the @supabase/supabase-js client for everything —
 * no manual fetch, no duplicated keys, no header assembly.
 *
 * Flow:
 *   Lead form submit  →  supabase.functions.invoke('submit-lead')
 *   Contact click log →  supabase.from('contact_clicks').insert()  [silent on error]
 */

import { supabase } from './supabase';

// ─────────────────────────────────────────────────────────────
//  Lead submission — always goes through the Edge Function.
//  The SDK automatically attaches the anon key + session JWT.
// ─────────────────────────────────────────────────────────────
export async function createLeadSubmission(payload) {
  const { data, error } = await supabase.functions.invoke('submit-lead', {
    body: payload,
  });

  if (error) throw error;
  return { data, error: null };
}

// ─────────────────────────────────────────────────────────────
//  Contact-click analytics — direct table insert.
//  Silently swallowed if RLS blocks it (not critical).
// ─────────────────────────────────────────────────────────────
export async function logContactClick(payload) {
  try {
    await supabase.from('contact_clicks').insert(payload);
  } catch (_) {
    // Not critical — ignore RLS / network errors
  }
}
