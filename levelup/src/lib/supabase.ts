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

import AsyncStorage from '@react-native-async-storage/async-storage';
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
    // Persist the session token to AsyncStorage so the user stays
    // logged in after closing and reopening the app.
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
