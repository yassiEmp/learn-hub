import { NextResponse } from 'next/server'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Success response helper
export const successResponse = <T>(
  data: T, 
  message?: string, 
  status: number = 200
): NextResponse<ApiResponse<T>> => {
  return NextResponse.json(
    {
      success: true,
      data,
      message
    },
    { status }
  )
}

// Error response helper
export const errorResponse = (
  error: string, 
  status: number = 400
): NextResponse<ApiResponse> => {
  return NextResponse.json(
    {
      success: false,
      error
    },
    { status }
  )
}

// Authentication error response
export const authErrorResponse = (
  error: string = 'Authentication required'
): NextResponse<ApiResponse> => {
  return errorResponse(error, 401)
}

// Authorization error response
export const forbiddenResponse = (
  error: string = 'Access denied'
): NextResponse<ApiResponse> => {
  return errorResponse(error, 403)
}

// Not found error response
export const notFoundResponse = (
  error: string = 'Resource not found'
): NextResponse<ApiResponse> => {
  return errorResponse(error, 404)
}

// Server error response
export const serverErrorResponse = (
  error: string = 'Internal server error'
): NextResponse<ApiResponse> => {
  return errorResponse(error, 500)
} 