import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables
// We prefer process.env because we explicitly polyfilled it in vite.config.ts 
// to capture Vercel system variables (SUPABASE_URL) and map them to VITE_ keys.
const getEnv = (key: string) => {
  let val = '';
  
  // Try process.env first (injected by vite.config.ts define)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      val = process.env[key];
    }
  } catch (e) {
    // ignore
  }

  // Try import.meta.env as fallback (native Vite)
  // We use optional chaining or explicit checks to avoid crashing if env is undefined
  if (!val) {
    try {
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        val = import.meta.env[key];
      }
    } catch (e) {
      // ignore
    }
  }
  
  return val || '';
};

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY');

// Debugging (Check console in browser)
console.log("[Supabase] Initializing Client...");
console.log("- URL Configured:", !!SUPABASE_URL && !SUPABASE_URL.includes('placeholder'));
console.log("- Key Configured:", !!SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('placeholder'));

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