
import { createClient } from '@supabase/supabase-js';

// Robustly check for environment variables in different formats (Vite vs standard Process)
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    // @ts-ignore
    return process.env[key];
  }
  return '';
};

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL') || getEnv('NEXT_PUBLIC_SUPABASE_URL');
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Check if configured (not using placeholder values)
const isConfigured = 
  SUPABASE_URL && 
  SUPABASE_URL.length > 10 &&
  SUPABASE_URL !== 'https://placeholder.supabase.co' && 
  SUPABASE_ANON_KEY && 
  SUPABASE_ANON_KEY.length > 10 &&
  SUPABASE_ANON_KEY !== 'placeholder-key';

export const isSupabaseConfigured = isConfigured;

if (!isConfigured) {
  console.warn("⚠️ Supabase credentials missing! App running in Offline/Local Mode.");
} else {
  console.log("✅ Supabase Connected:", SUPABASE_URL);
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co', 
  SUPABASE_ANON_KEY || 'placeholder-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
