import { createClient } from '@supabase/supabase-js';

// Use environment variables for configuration
// On Vercel, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Project Settings
// Fallback to placeholder to prevent "supabaseUrl is required" error during initialization
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = SUPABASE_URL !== 'https://placeholder.supabase.co';

if (!isSupabaseConfigured) {
  console.warn("Supabase credentials missing! App running in demo mode. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect to backend.");
}

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});