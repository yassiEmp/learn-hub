<!-- e3042216-b0a6-469c-b576-be80dad68caf b34451a3-8fe0-4a44-be8a-21dc13ffbce3 -->
# Authentication System Refactoring Plan (Supabase-Native)

## Problem Summary

- `useAuth` hook called in 18+ files throughout the codebase
- Reinventing Supabase auth utilities instead of using them directly
- No centralized auth context
- Inconsistent auth patterns
- Router usage inside the auth hook creating unnecessary coupling

## Solution Architecture (Supabase-First Approach)

### 1. Create Zustand Store That Wraps Supabase Auth

**File**: `stores/authStore.ts` (new)

Instead of rebuilding auth, expose Supabase's auth client and state:

```typescript
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  isConfigured: boolean
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
  
  // Expose Supabase auth directly
  auth: supabase.auth,
  
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setLoading: (loading) => set({ loading }),
  
  initialize: async () => {
    if (!get().isConfigured) {
      set({ loading: false })
      return
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ session, user: session?.user ?? null, loading: false })
    } catch (error) {
      console.error('Auth init error:', error)
      set({ loading: false })
    }
  }
}))

// Computed selectors
export const useIsAuthenticated = () => useAuthStore(state => !!state.user)
export const useAuthLoading = () => useAuthStore(state => state.loading)
```

Key points:

- Store exposes `supabase.auth` directly - no reimplementation
- Components use `auth.signInWithPassword()`, `auth.signOut()`, etc. from Supabase
- Store only manages state (user, session, loading)
- Computed selectors for common patterns

### 2. Create Auth Context Provider

**File**: `contexts/AuthContext.tsx` (new)

```typescript
'use client'
import { createContext, useContext, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext<ReturnType<typeof useAuthStore> | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const store = useAuthStore()
  
  useEffect(() => {
    // Initialize auth
    store.initialize()
    
    // Subscribe to Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event)
        store.setSession(session)
      }
    )
    
    return () => subscription.unsubscribe()
  }, [])
  
  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be within AuthProvider')
  return context
}
```

Usage in components:

```typescript
const { user, session, loading, auth, isConfigured } = useAuth()

// Use Supabase's methods directly:
await auth.signInWithPassword({ email, password })
await auth.signOut()
await auth.signInWithOAuth({ provider: 'google' })
```

### 3. Simplify useAuth Hook

**File**: `hooks/useAuth.ts` (refactor)

Instead of having logic here, just re-export from context:

```typescript
export { useAuth } from '@/contexts/AuthContext'
// Keep existing import paths working
```

### 4. Protected Routes Layout (Supabase Pattern)

**File**: `app/(app)/layout.tsx` (new)

Follow Supabase's recommended pattern for protected routes:

```typescript
'use client'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isConfigured } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading && !user && isConfigured) {
      router.push('/login')
    }
  }, [user, loading, isConfigured, router])
  
  if (loading) return <LoadingSpinner />
  if (!isConfigured) return <SetupRequired />
  if (!user) return null // Redirecting
  
  return <>{children}</>
}
```

### 5. Login Page (Use Supabase Directly)

**File**: `app/(app)/login/page.tsx` (refactor)

```typescript
const { auth, user, isConfigured } = useAuth()

const handleLogin = async (email: string, password: string) => {
  const { data, error } = await auth.signInWithPassword({ 
    email, 
    password 
  })
  if (error) setError(error.message)
}

const handleGoogleLogin = async () => {
  await auth.signInWithOAuth({ 
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/create` }
  })
}
```

### 6. Component Updates Pattern

For all 18 components:

**Before:**

```typescript
const { isAuthenticated, router } = useAuth()
if (!isAuthenticated) router.push('/login')
```

**After:**

```typescript
const { user } = useAuth() // or useIsAuthenticated() selector
// No redirect logic - handled by layout
// Just use user for UI: {user ? <CreateButton /> : <LoginPrompt />}
```

### 7. Leverage Supabase Utilities

Expose these Supabase utilities through the store/context:

```typescript
// In store
auth: supabase.auth // Full auth client access

// Components can use:
auth.getSession()
auth.getUser()
auth.updateUser()
auth.resetPasswordForEmail()
auth.onAuthStateChange()
auth.signOut()
// etc - all Supabase methods available
```

## Implementation Order

### Phase 1: Setup Core (Supabase-Native)

1. Install Zustand: `pnpm add zustand`
2. Create `stores/authStore.ts` - expose Supabase auth
3. Create `contexts/AuthContext.tsx` - wrap store + listeners
4. Update `hooks/useAuth.ts` - re-export from context

### Phase 2: Root Integration

5. Add `AuthProvider` to `app/layout.tsx`
6. Create `app/(app)/layout.tsx` - protected routes
7. Test auth initialization

### Phase 3: Update Components

8. `app/(app)/login/page.tsx` - use `auth.signInWithPassword()`
9. `components/hearderApp.tsx` - use `auth.signOut()`
10. All 6 content-import components - remove redirects
11. `components/InputSection.tsx` - just use session
12. Feature components - simplify to use store

### Phase 4: Cleanup

13. Remove old `requireAuth` logic
14. Test all flows
15. Remove unused code

## Key Principles

1. **Don't Rebuild Supabase**: Use `supabase.auth` methods directly
2. **Store = State Only**: Just track user/session/loading
3. **Expose, Don't Wrap**: Make Supabase utilities available
4. **Follow Supabase Docs**: Use their patterns for auth
5. **Zustand for Optimization**: Selective subscriptions prevent re-renders

## Files to Create

- `stores/authStore.ts` - Zustand store exposing Supabase
- `contexts/AuthContext.tsx` - Provider with Supabase listeners
- `app/(app)/layout.tsx` - Protected routes wrapper

## Files to Modify

- `hooks/useAuth.ts` - simple re-export
- `app/layout.tsx` - add AuthProvider
- `app/(app)/login/page.tsx` - use Supabase methods
- `components/hearderApp.tsx` - use `auth.signOut()`
- All 18 components using auth - simplify

## Supabase Best Practices Applied

- Use `onAuthStateChange` for real-time updates
- Use `getSession()` for initial auth check
- Don't store tokens manually - Supabase handles it
- Let Supabase manage session refresh automatically
- Use `auth.signOut()` for proper cleanup

### To-dos

- [ ] Install Zustand state management library
- [ ] Create Zustand auth store with state and actions
- [ ] Create AuthContext provider wrapping the store
- [ ] Refactor useAuth hook to simple context consumer
- [ ] Add AuthProvider to root layout
- [ ] Create (app) layout for protected route group
- [ ] Update hearderApp.tsx to remove router dependency
- [ ] Update all 6 content-import components to remove redirects
- [ ] Update login page to use store actions
- [ ] Simplify account page auth usage
- [ ] Simplify AuthGuard component
- [ ] Update course and exam feature components
- [ ] Test login, logout, and protected route flows