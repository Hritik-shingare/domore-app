/**
 * Supabase client for the LevelUp Android app.
 *
 * Connects to the same Supabase project as the LevelUp website.
 * Credentials are loaded from environment variables (EXPO_PUBLIC_ prefix).
 *
 * The anon key is the public/publishable key — safe to include in the app.
 * Row Level Security (RLS) on the Supabase side controls data access.
 *
 * Do NOT import or use the service-role key here.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
      'Ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY ' +
      'are set in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable automatic token refresh — auth is not implemented yet.
    // This will be revisited when login/signup is added.
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});
