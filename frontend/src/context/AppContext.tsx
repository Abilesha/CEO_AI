/**
 * AppContext.tsx
 * -------------
 * Global application context providing:
 *  - Authenticated user state
 *  - App-level theme / UI state
 *  - Shared loading / error banners
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@services/supabase'

/* ---- Types ---- */

export interface AppUser {
  id: string
  email: string | undefined
  fullName: string | null
  avatarUrl: string | null
  role: 'admin' | 'executive' | 'viewer'
}

interface AppState {
  user: AppUser | null
  session: Session | null
  isAuthenticated: boolean
  isLoading: boolean
  sidebarOpen: boolean
  theme: 'dark' | 'light'
}

interface AppActions {
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setTheme: (theme: 'dark' | 'light') => void
  refreshUser: () => Promise<void>
}

type AppContextValue = AppState & AppActions

/* ---- Context ---- */

const AppContext = createContext<AppContextValue | undefined>(undefined)

/* ---- Provider ---- */

function mapSupabaseUser(user: User): AppUser {
  return {
    id: user.id,
    email: user.email,
    fullName: (user.user_metadata?.full_name as string | null) ?? null,
    avatarUrl: (user.user_metadata?.avatar_url as string | null) ?? null,
    role: (user.user_metadata?.role as AppUser['role']) ?? 'viewer',
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const refreshUser = useCallback(async () => {
    if (localStorage.getItem('demo_mode') === 'true') {
      const email = localStorage.getItem('demo_user_email') || 'subasree8606@gmail.com';
      const mockSession = {
        access_token: 'mock-token',
        token_type: 'bearer' as const,
        expires_in: 3600,
        refresh_token: 'mock-refresh',
        user: {
          id: 'demo-id',
          email: email,
          user_metadata: { full_name: 'Subasree', role: 'admin' },
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
        } as any,
      } as Session;
      setSession(mockSession);
      setUser({
        id: 'demo-id',
        email: email,
        fullName: 'Subasree',
        avatarUrl: null,
        role: 'admin',
      });
      return;
    }

    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession()

    setSession(currentSession)
    setUser(currentSession?.user ? mapSupabaseUser(currentSession.user) : null)
  }, [])

  useEffect(() => {
    // Initialise session
    if (localStorage.getItem('demo_mode') === 'true') {
      const email = localStorage.getItem('demo_user_email') || 'subasree8606@gmail.com';
      const mockSession = {
        access_token: 'mock-token',
        token_type: 'bearer' as const,
        expires_in: 3600,
        refresh_token: 'mock-refresh',
        user: {
          id: 'demo-id',
          email: email,
          user_metadata: { full_name: 'Subasree', role: 'admin' },
          aud: 'authenticated',
          role: 'authenticated',
          created_at: new Date().toISOString(),
        } as any,
      } as Session;
      setSession(mockSession);
      setUser({
        id: 'demo-id',
        email: email,
        fullName: 'Subasree',
        avatarUrl: null,
        role: 'admin',
      });
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ? mapSupabaseUser(s.user) : null)
      setIsLoading(false)
    })

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      if (localStorage.getItem('demo_mode') === 'true') return
      setSession(s)
      setUser(s?.user ? mapSupabaseUser(s.user) : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), [])

  const value: AppContextValue = {
    user,
    session,
    isAuthenticated: !!session,
    isLoading,
    sidebarOpen,
    theme,
    setSidebarOpen,
    toggleSidebar,
    setTheme,
    refreshUser,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

/* ---- Hook ---- */

/**
 * useAppContext
 * Access global app state — must be used inside <AppProvider>.
 */
export function useAppContext(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an <AppProvider>')
  }
  return context
}

export default AppContext
