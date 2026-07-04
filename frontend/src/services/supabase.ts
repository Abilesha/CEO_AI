/**
 * supabase.ts
 * -----------
 * Supabase client configuration for CEO AI.
 *
 * Required environment variables (set in .env.local):
 *   VITE_SUPABASE_URL      — your project URL from the Supabase dashboard
 *   VITE_SUPABASE_ANON_KEY — your project's anon/public key
 *
 * Usage:
 *   import { supabase } from '@services/supabase'
 *   const { data, error } = await supabase.from('table').select('*')
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Supabase] Missing environment variables.\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.',
  )
}

/**
 * The typed Supabase client instance.
 * Pass your database schema type as the generic parameter once generated:
 *   createClient<Database>(...)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'ceo-ai-auth',
  },
})

/* --- Auth Helpers --- */

/** Get the currently authenticated user */
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
}

/** Get the current session (includes access token) */
export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  return { session, error }
}

/** Sign out the current user */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export default supabase
