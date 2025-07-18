import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

// Create client with user token for authenticated requests
export const createServerClient = (token: string) => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false }
    }
  )
}

// Extract token from request headers
export const getTokenFromRequest = (request: NextRequest): string | null => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.replace('Bearer ', '')
}

// Verify user authentication and return user data
export const verifyAuth = async (request: NextRequest) => {
  try {
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return {
        user: null,
        error: 'No authorization token provided'
      }
    }

    const supabase = createServerClient(token)
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return {
        user: null,
        error: error?.message || 'Invalid or expired token'
      }
    }

    return {
      user,
      error: null
    }
  } catch (error) {
    console.error('Auth verification error:', error)
    return {
      user: null,
      error: 'Authentication failed'
    }
  }
}

// Helper to require authentication (throws error if not authenticated)
export const requireAuth = async (request: NextRequest) => {
  const { user, error } = await verifyAuth(request)
  
  if (error || !user) {
    throw new Error(error || 'Authentication required')
  }
  
  return user
}

// Helper to check if user owns a resource
export const checkOwnership = async (
  request: NextRequest, 
  resourceOwnerId: string
) => {
  const { user, error } = await verifyAuth(request)
  
  if (error || !user) {
    return {
      authorized: false,
      error: error || 'Authentication required'
    }
  }

  if (user.id !== resourceOwnerId) {
    return {
      authorized: false,
      error: 'Access denied: You do not own this resource'
    }
  }

  return {
    authorized: true,
    user,
    error: null
  }
} 