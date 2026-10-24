'use client'
import { createContext, useContext } from 'react'
import { useSession, signOut as authSignOut } from '@/lib/auth-client'

export type AppUser = {
  id: string
  email: string
  name: string
  image?: string | null
}

interface AuthContextType {
  user: AppUser | null
  loading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isPending, refetch } = useSession()
  const user = data?.user
    ? { id: data.user.id, email: data.user.email, name: data.user.name, image: data.user.image }
    : null

  const value: AuthContextType = {
    user,
    loading: isPending,
    isAuthenticated: !!user,
    signOut: async () => {
      await authSignOut()
      await refetch()
    },
    refresh: async () => {
      await refetch()
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be within AuthProvider')
  return context
}
