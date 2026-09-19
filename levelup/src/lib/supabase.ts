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
import { AppState } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Missing Supabase environment variables. ' +
      'Ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY ' +
      'are set in your .env file.'
  );
}

// Resilient storage adapter that catches any native storage errors gracefully
const safeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.warn('[Supabase Storage] Failed to get item:', key, e);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.warn('[Supabase Storage] Failed to set item:', key, e);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn('[Supabase Storage] Failed to remove item:', key, e);
    }
  },
};

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      storage: safeStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

// Tells Supabase to refresh tokens only when app is active in foreground.
// This prevents background 'Auto refresh tick failed' errors when phone is asleep.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

