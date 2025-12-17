
import { createClient } from '@supabase/supabase-js';

// Try to get env variables from process.env (defined in vite.config.ts) or import.meta.env (native Vite)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || (import.meta as any).env?.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// Check if configured (not using placeholder values)
const isConfigured = 
  SUPABASE_URL && 
  SUPABASE_URL !== 'https://placeholder.supabase.co' && 
  SUPABASE_ANON_KEY && 
  SUPABASE_ANON_KEY !== 'placeholder-key';

export const isSupabaseConfigured = isConfigured;

if (!isConfigured) {
  console.warn("Supabase credentials missing or using placeholders! App is running in Local Mode.");
  console.log("Current URL:", SUPABASE_URL);
} else {
  console.log("Supabase Client Initialized with URL:", SUPABASE_URL);
}

// Initialize the Supabase client
// We use a fallback if not configured to prevent crash, but DataContext handles the logic to not use it.
export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co', 
  SUPABASE_ANON_KEY || 'placeholder-key', {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
