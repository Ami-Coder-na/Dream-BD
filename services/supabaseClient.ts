import { createClient } from '@supabase/supabase-js';

// --- GLOBAL CONFIGURATION (সবার জন্য) ---
// If you want ALL users to see the data, paste your keys here inside the quotes.
// অন্য ইউজারদের আপডেট দেখাতে হলে অবশ্যই এখানে কি (Key) বসাতে হবে।

// FIXED: Applied the keys provided in the setup
const HARDCODED_URL = 'https://zpsxpqurazjeqviwooky.supabase.co';
const HARDCODED_KEY = 'sb_publishable_gqz_Uzt_JhlNsC59yHXuAQ_IzRiKc3F';

// Helper to safely access environment variables
// IMPROVED: Smartly detects if user pasted a value directly instead of a key name
const getEnv = (key: string) => {
  if (!key) return '';

  // Smart Fix: If the input looks like a URL or Key (starts with http or eyJ or sb_), return it directly
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

// Check Local Storage for manually entered keys (Admin Panel Feature - Browser Specific)
const getStoredConfig = (key: string) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key) || '';
  }
  return '';
};

// Config Sources
const ENV_URL = getEnv('VITE_SUPABASE_URL'); 
const ENV_KEY = getEnv('VITE_SUPABASE_ANON_KEY');

const STORED_URL = getStoredConfig('dream_sb_url');
const STORED_KEY = getStoredConfig('dream_sb_key');

// LOGIC: 
// 1. GLOBAL: Comes from Code (HARDCODED) or Environment Variables (Vercel/System). Visible to ALL users.
// 2. LOCAL: Comes from Browser LocalStorage. Visible ONLY to you.

const GLOBAL_URL = HARDCODED_URL || ENV_URL;
const GLOBAL_KEY = HARDCODED_KEY || ENV_KEY;

export const isGlobalConfig = !!(GLOBAL_URL && GLOBAL_KEY && GLOBAL_URL.includes('http'));

// Final URL/Key to use (Global takes priority, then Local)
const SUPABASE_URL = GLOBAL_URL || STORED_URL;
const SUPABASE_ANON_KEY = GLOBAL_KEY || STORED_KEY;

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
} else {
  if (isGlobalConfig) {
    console.log("✅ App connected Globally (Code/Env).");
  } else {
    console.log("⚠️ App connected Locally (Browser Storage). Other users won't see this.");
  }
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