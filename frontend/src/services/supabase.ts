/**
 * supabase.ts
 * -----------
 * Supabase client configuration for CEO AI.
 * Handles missing environment keys gracefully in development.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const hasKeys = !!(supabaseUrl && supabaseAnonKey && supabaseAnonKey.length > 5)

if (!hasKeys) {
  console.warn(
    '[Supabase] Missing environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  )
}

export const supabase = hasKeys
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'ceo-ai-auth',
      },
    })
  : null

/* --- Auth Helpers --- */

export const getCurrentUser = async () => {
  if (!supabase) return { user: null, error: null }
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  } catch (err) {
    return { user: null, error: err }
  }
}

export const getSession = async () => {
  if (!supabase) return { session: null, error: null }
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  } catch (err) {
    return { session: null, error: err }
  }
}

export const signOut = async () => {
  if (!supabase) return { error: null }
  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (err) {
    return { error: err }
  }
}

export default supabase
