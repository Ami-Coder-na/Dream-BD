
import { createClient } from '@supabase/supabase-js';

// Credentials provided by user
const PROJECT_ID = 'zpsxpqurazjeqviwooky';
const SUPABASE_URL = `https://${PROJECT_ID}.supabase.co`;
const SUPABASE_ANON_KEY = 'sb_publishable_gqz_Uzt_JhlNsC59yHXuAQ_IzRiKc3F'; 

// Initialize the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
