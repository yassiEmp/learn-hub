import { supabase } from '@/lib/supabase';
import { CreateCourseRequest, CourseResponse } from '@/types/course';

// Base API configuration
const API_BASE = '/api/v1';

// Helper to get auth headers
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No authentication token available');
  }

  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session.access_token}`
  };
};

// Generic API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Course API functions
export const courseApi = {
  // Create a new course
  create: async (courseData: CreateCourseRequest & { text: string }): Promise<CourseResponse> => {
    return apiRequest<{ success: true; data: CourseResponse; message: string }>('/course', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }).then(response => response.data);
  },

  // Get all courses for the authenticated user
  getAll: async (): Promise<CourseResponse[]> => {
    return apiRequest<{ success: true; data: CourseResponse[]; message: string }>('/course', {
      method: 'GET',
    }).then(response => response.data);
  },

  // Get a specific course by ID
  getById: async (courseId: string): Promise<CourseResponse> => {
    return apiRequest<{ success: true; data: CourseResponse; message: string }>(`/course/${courseId}`, {
      method: 'GET',
    }).then(response => response.data);
  },

  // Update a course
  update: async (courseId: string, updates: Partial<CreateCourseRequest>): Promise<CourseResponse> => {
    return apiRequest<{ success: true; data: CourseResponse; message: string }>(`/course/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }).then(response => response.data);
  },

  // Delete a course
  delete: async (courseId: string): Promise<void> => {
    return apiRequest<{ success: true; message: string }>(`/course/${courseId}`, {
      method: 'DELETE',
    }).then(() => undefined);
  },
};

// User API functions
export const userApi = {
  // Delete user account
  deleteAccount: async (): Promise<void> => {
    return apiRequest<{ success: true; message: string }>('/user', {
      method: 'DELETE',
    }).then(() => undefined);
  },
};

// Error handling helper
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}; 