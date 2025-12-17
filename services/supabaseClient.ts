import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables
const getEnv = (key: string) => {
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

// Check Local Storage for manually entered keys (Admin Panel Feature)
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

// Prioritize Environment variables, fallback to Stored (Manual) Config
const SUPABASE_URL = ENV_URL || STORED_URL;
const SUPABASE_ANON_KEY = ENV_KEY || STORED_KEY;

const isConfigured = 
  SUPABASE_URL && 
  SUPABASE_URL.length > 10 &&
  !SUPABASE_URL.includes('placeholder') &&
  SUPABASE_ANON_KEY && 
  SUPABASE_ANON_KEY.length > 10 &&
  !SUPABASE_ANON_KEY.includes('placeholder');

export const isSupabaseConfigured = isConfigured;

if (!isConfigured) {
  console.warn("⚠️ Supabase Config Missing. App running in Offline/Local Mode.");
}

export const supabase = createClient(
  isConfigured ? SUPABASE_URL : 'https://placeholder.supabase.co', 
  isConfigured ? SUPABASE_ANON_KEY : 'placeholder-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});