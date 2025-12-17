import { createClient } from '@supabase/supabase-js';

// --- GLOBAL CONFIGURATION ---
// আপনার Supabase URL এবং Key এখানে পেস্ট করুন।
// যদি আপনি ভুল করে getEnv('') এর ভেতরেও পেস্ট করেন, নিচের নতুন কোডটি তা ঠিক করে নেবে।

const HARDCODED_URL = ''; // e.g. 'https://xyz.supabase.co'
const HARDCODED_KEY = ''; // e.g. 'eyJ...'

// Helper to safely access environment variables
// IMPROVED: Smartly detects if user pasted a value directly instead of a key name
const getEnv = (key: string) => {
  if (!key) return '';

  // Smart Fix: If the input looks like a URL or Key, return it directly
  // This fixes the issue where users paste the value inside getEnv('VALUE')
  if (key.startsWith('http') || key.startsWith('ey')) {
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

// Even if you paste the URL inside getEnv(), the new logic will catch it.
// তবে সবচেয়ে ভালো হয় যদি আপনি সরাসরি নিচের কোটেশনে বসান:
// const ENV_URL = 'https://your-project.supabase.co';
const ENV_URL = getEnv('VITE_SUPABASE_URL'); 
const ENV_KEY = getEnv('VITE_SUPABASE_ANON_KEY');

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
} else {
  console.log("✅ Supabase Configured. URL:", SUPABASE_URL);
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