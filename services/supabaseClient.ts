import { createClient } from '@supabase/supabase-js';

// In Vite + Vercel, we configured vite.config.ts to expose these specific keys on process.env
// We check process.env first (injected by build), then import.meta.env (native Vite)
// We cast import.meta to any to avoid TypeScript errors when types aren't fully configured
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ((import.meta as any).env && (import.meta as any).env.VITE_SUPABASE_URL) || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || ((import.meta as any).env && (import.meta as any).env.VITE_SUPABASE_ANON_KEY) || '';

// Debugging: Check console to see if keys are loaded (Masked for security)
console.log("Supabase Connection Check:");
console.log("- URL Provided:", SUPABASE_URL ? "Yes (" + SUPABASE_URL.substring(0, 15) + "...)" : "No");
console.log("- Key Provided:", SUPABASE_ANON_KEY ? "Yes (Length: " + SUPABASE_ANON_KEY.length + ")" : "No");

const isConfigured = 
  SUPABASE_URL && 
  SUPABASE_URL.length > 10 &&
  !SUPABASE_URL.includes('placeholder') &&
  SUPABASE_ANON_KEY && 
  SUPABASE_ANON_KEY.length > 10 &&
  !SUPABASE_ANON_KEY.includes('placeholder');

export const isSupabaseConfigured = isConfigured;

if (!isConfigured) {
  console.warn("⚠️ Supabase Config Missing. App running in Offline Mode.");
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co', 
  SUPABASE_ANON_KEY || 'placeholder-key', {
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