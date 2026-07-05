/**
 * supabase.ts
 * -----------
 * Supabase client — resilient to missing env keys.
 * If keys are absent (local dev), supabase is null.
 * Auth context uses demo_mode localStorage fallback instead.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const hasKeys = !!(supabaseUrl && supabaseAnonKey && supabaseAnonKey.length > 10)

if (!hasKeys) {
  console.warn(
    '[CEO AI] Supabase env vars not set — running in demo mode.\n' +
    'Login with: subasree8606@gmail.com / 12345678'
  )
}

export const supabase = hasKeys
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
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
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getSession = async () => {
  if (!supabase) return { session: null, error: null }
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export const signOut = async () => {
  if (!supabase) return { error: null }
  const { error } = await supabase.auth.signOut()
  return { error }
}

export default supabase
