import 'dotenv/config'; // This must be the first line!

import { createClient } from '@supabase/supabase-js'

// Provide fallback values to prevent crashes during development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// console.log('lib/supabase.ts - supabaseUrl:', supabaseUrl);
// console.log('lib/supabase.ts - supabaseAnonKey:', supabaseAnonKey);

// Only create client if we have valid credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
}

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseAnonKey !== 'placeholder-key' &&
         supabaseUrl.includes('supabase.co')
}