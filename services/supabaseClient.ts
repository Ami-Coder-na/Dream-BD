import { createClient } from '@supabase/supabase-js';

// --- GLOBAL CONFIGURATION (সবার জন্য) ---
// If you want ALL users to see the data without configuring Environment Variables,
// paste your Supabase URL and Key inside the quotes below.
// Example: const HARDCODED_URL = 'https://xyz.supabase.co';
const HARDCODED_URL = ''; 
const HARDCODED_KEY = '';

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

// Check Local Storage for manually entered keys (Admin Panel Feature - Browser Specific)
const getStoredConfig = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || '';
  }
  return '';
};

const ENV_URL = getEnv('https://zpsxpqurazjeqviwooky.supabase.co');
const ENV_KEY = getEnv('sb_publishable_gqz_Uzt_JhlNsC59yHXuAQ_IzRiKc3F');

const STORED_URL = getStoredConfig('dream_sb_url');
const STORED_KEY = getStoredConfig('dream_sb_key');

// PRIORITY: Hardcoded > Environment > LocalStorage
// This ensures if you put keys in code, everyone gets connected.
const SUPABASE_URL = HARDCODED_URL || ENV_URL || STORED_URL;
const SUPABASE_ANON_KEY = HARDCODED_KEY || ENV_KEY || STORED_KEY;

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