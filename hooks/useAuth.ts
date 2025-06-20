"use client"
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        }
        setUser(session?.user ?? null)
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
        setLoading(false)
        
        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          // Clear any cached data or perform cleanup
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

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      
      if (error) {
        // Enhanced error handling
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
  }

  const signUp = async (email: string, password: string, fullName: string) => {
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
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        return { error }
      }
      
      // Clear user state immediately
      setUser(null)
      router.push('/login')
      return { error: null }
    } catch (error) {
      console.error('Unexpected sign out error:', error)
      return { error: { message: 'An unexpected error occurred during sign out' } }
    }
  }

  const requireAuth = () => {
    if (!loading && !user) {
      router.push('/login')
      return false
    }
    return true
  }

  const resetPassword = async (email: string) => {
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
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    requireAuth,
    resetPassword,
    isAuthenticated: !!user
  }
}