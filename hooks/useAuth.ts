"use client"
import { useEffect, useState, useCallback } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if Supabase is configured
    const configured = isSupabaseConfigured()
    setIsConfigured(configured)

    if (!configured) {
      console.warn('Supabase is not properly configured. Please check your environment variables.')
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        }
        setUser(session?.user ?? null)
        setSession(session)
      } catch (error) {
        console.error('Error in getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setSession(session)
        setLoading(false)
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          console.log('User signed out')
        } else if (event === 'SIGNED_IN') {
          console.log('User signed in')
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isConfigured) {
      return { 
        data: null, 
        error: { message: 'Authentication service is not configured' } 
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      
      if (error) {
        console.error('Sign in error:', error)
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Unexpected sign in error:', error)
      return { 
        data: null, 
        error: { message: 'An unexpected error occurred during sign in' } 
      }
    }
  }, [isConfigured])

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    if (!isConfigured) {
      return { 
        data: null, 
        error: { message: 'Authentication service is not configured' } 
      }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          }
        }
      })
      
      if (error) {
        console.error('Sign up error:', error)
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Unexpected sign up error:', error)
      return { 
        data: null, 
        error: { message: 'An unexpected error occurred during sign up' } 
      }
    }
  }, [isConfigured])

  const signInWithProvider = useCallback(async (provider: 'google' | 'facebook') => {
    if (!isConfigured) {
      return { 
        data: null, 
        error: { message: 'Authentication service is not configured' } 
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        }
      })
      
      if (error) {
        console.error(`${provider} sign in error:`, error)
        return { data: null, error }
      }
      
      return { data, error: null }
    } catch (error) {
      console.error(`Unexpected ${provider} sign in error:`, error)
      return { 
        data: null, 
        error: { message: `An unexpected error occurred during ${provider} sign in` } 
      }
    }
  }, [isConfigured])

  const signOut = useCallback(async () => {
    if (!isConfigured) {
      setUser(null)
      router.push('/login')
      return { error: null }
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        return { error }
      }
      
      setUser(null)
      router.push('/login')
      return { error: null }
    } catch (error) {
      console.error('Unexpected sign out error:', error)
      return { error: { message: 'An unexpected error occurred during sign out' } }
    }
  }, [isConfigured, router])

  const requireAuth = useCallback(() => {
    if (!loading && !user && isConfigured) {
      router.push('/login')
      return false
    }
    return true
  }, [loading, user, isConfigured, router])

  const resetPassword = useCallback(async (email: string) => {
    if (!isConfigured) {
      return { error: { message: 'Authentication service is not configured' } }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) {
        console.error('Reset password error:', error)
        return { error }
      }
      
      return { error: null }
    } catch (error) {
      console.error('Unexpected reset password error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    }
  }, [isConfigured])

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithProvider,
    signOut,
    requireAuth,
    resetPassword,
    isAuthenticated: !!user,
    isConfigured
  }
}