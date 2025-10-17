'use client'
import { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isConfigured: boolean
  isAuthenticated: boolean
  auth: typeof supabase.auth
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  initialize: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const store = useAuthStore()
  
  useEffect(() => {
    // Initialize auth
    const initAuth = async () => {
      try {
        await store.initialize()
      } catch (error) {
        console.error('AuthProvider: Auth initialization error:', error)
      }
    }
    
    initAuth()
    
    // Subscribe to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        store.setSession(session)
      }
    )
    
    return () => {
      subscription.unsubscribe()
    }
  }, []) // Remove store from dependencies to prevent infinite loop
  
  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be within AuthProvider')
  return context
}
