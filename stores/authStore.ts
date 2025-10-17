import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  isConfigured: boolean
  isAuthenticated: boolean
}

interface AuthActions {
  // Expose Supabase's auth client directly
  auth: typeof supabase.auth
  // Just state setters
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  isConfigured: isSupabaseConfigured(),
  isAuthenticated: false,
  
  // Expose Supabase auth directly
  auth: supabase.auth,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session, user: session?.user ?? null, isAuthenticated: !!session?.user }),
  setLoading: (loading) => set({ loading }),
  
  initialize: async () => {
    if (!get().isConfigured) {
      set({ loading: false })
      return
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ session, user: session?.user ?? null, isAuthenticated: !!session?.user, loading: false })
    } catch (error) {
      console.error('AuthStore: Auth init error:', error)
      set({ loading: false })
    }
  }
}))

// Computed selectors
export const useIsAuthenticated = () => useAuthStore(state => !!state.user)
export const useAuthLoading = () => useAuthStore(state => state.loading)
