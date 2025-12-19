
import { createClient } from '@supabase/supabase-js';

// --- GLOBAL CONFIGURATION ---
// Standard Supabase keys are long JWT strings starting with 'eyJ'.
// If your key starts with 'sb_', please double-check your Supabase dashboard (Project Settings > API).
const HARDCODED_URL = 'https://zpsxpqurazjeqviwooky.supabase.co';
const HARDCODED_KEY = 'sb_publishable_gqz_Uzt_JhlNsC59yHXuAQ_IzRiKc3F';

const getEnv = (key: string) => {
  if (!key) return '';
  if (key.startsWith('http') || key.startsWith('ey') || key.startsWith('sb_')) {
    return key;
  }
  let val = '';
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      val = process.env[key];
    }
  } catch (e) {}
  if (!val) {
    try {
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        val = import.meta.env[key];
      }
    } catch (e) {}
  }
  return val || '';
};

const getStoredConfig = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || '';
  }
  return '';
};

const ENV_URL = getEnv('VITE_SUPABASE_URL'); 
const ENV_KEY = getEnv('VITE_SUPABASE_ANON_KEY');
const STORED_URL = getStoredConfig('dream_sb_url');
const STORED_KEY = getStoredConfig('dream_sb_key');

const GLOBAL_URL = HARDCODED_URL || ENV_URL;
const GLOBAL_KEY = HARDCODED_KEY || ENV_KEY;

export const isGlobalConfig = !!(GLOBAL_URL && GLOBAL_KEY && GLOBAL_URL.includes('http'));

const SUPABASE_URL = GLOBAL_URL || STORED_URL;
const SUPABASE_ANON_KEY = GLOBAL_KEY || STORED_KEY;

// Stricter configuration check
const isConfigured = 
  SUPABASE_URL && 
  SUPABASE_URL.includes('http') &&
  SUPABASE_ANON_KEY && 
  SUPABASE_ANON_KEY.length > 20; // Supabase keys are typically very long

export const isSupabaseConfigured = !!isConfigured;

// Standard Supabase initialization with safety wrapper
const createSafeClient = () => {
  if (!isSupabaseConfigured) {
    return createClient('https://placeholder.supabase.co', 'placeholder-key');
  }
  
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
      global: { headers: { 'x-application-name': 'dream-bd' } }
    });
  } catch (e) {
    console.error("Supabase Init Error:", e);
    return createClient('https://placeholder.supabase.co', 'placeholder-key');
  }
};

export const supabase = createSafeClient();
