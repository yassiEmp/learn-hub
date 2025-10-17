import { createServerClient } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';

export interface BlobAccessContext {
  userId: string;
  courseId: string;
  isPublic: boolean;
  isOwner: boolean;
}

/**
 * Check if user has access to a specific blob file
 */
export async function checkBlobAccess(
  req: NextRequest,
  blobPathname: string,
  courseId?: string
): Promise<{ hasAccess: boolean; context?: BlobAccessContext; error?: string }> {
  try {
    // 1. Verify authentication
    const { verifyAuth } = await import('@/utils/supabase/server');
    const { user, error: authError } = await verifyAuth(req);
    
    if (authError || !user) {
      return { hasAccess: false, error: 'Authentication required' };
    }

    // 2. If no courseId provided, check if user owns the blob (based on pathname)
    if (!courseId) {
      const isOwner = blobPathname.includes(`users/${user.id}/`);
      return { 
        hasAccess: isOwner, 
        context: { 
          userId: user.id, 
          courseId: '', 
          isPublic: false, 
          isOwner 
        } 
      };
    }

    // 3. Get course information
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return { hasAccess: false, error: 'No authorization token provided' };
    }

    const supabase = createServerClient(token);
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('owner_id, is_public, source_files')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return { hasAccess: false, error: 'Course not found' };
    }

    // 4. Check access based on course privacy and ownership
    const isOwner = course.owner_id === user.id;
    const isPublic = course.is_public || false;
    
    // Owner always has access
    if (isOwner) {
      return { 
        hasAccess: true, 
        context: { 
          userId: user.id, 
          courseId, 
          isPublic, 
          isOwner: true 
        } 
      };
    }

    // Public courses allow access to anyone
    if (isPublic) {
      return { 
        hasAccess: true, 
        context: { 
          userId: user.id, 
          courseId, 
          isPublic: true, 
          isOwner: false 
        } 
      };
    }

    // Private course, not owner
    return { hasAccess: false, error: 'Access denied to private course' };

  } catch (error) {
    console.error('Error checking blob access:', error);
    return { hasAccess: false, error: 'Failed to verify access' };
  }
}

/**
 * Get blob URL with proper access control
 */
export async function getBlobUrl(
  req: NextRequest,
  blobPathname: string,
  courseId?: string
): Promise<{ url?: string; error?: string }> {
  const accessCheck = await checkBlobAccess(req, blobPathname, courseId);
  
  if (!accessCheck.hasAccess) {
    return { error: accessCheck.error || 'Access denied' };
  }

  // For now, return the pathname as URL
  // In production, you might want to generate signed URLs or proxy through your API
  return { url: `https://your-blob-domain.com${blobPathname}` };
}

/**
 * Check if user can modify course files (only owner)
 */
export async function canModifyCourseFiles(
  req: NextRequest,
  courseId: string
): Promise<{ canModify: boolean; error?: string }> {
  try {
    const { verifyAuth } = await import('@/utils/supabase/server');
    const { user, error: authError } = await verifyAuth(req);
    
    if (authError || !user) {
      return { canModify: false, error: 'Authentication required' };
    }

    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return { canModify: false, error: 'No authorization token provided' };
    }

    const supabase = createServerClient(token);
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('owner_id')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return { canModify: false, error: 'Course not found' };
    }

    const isOwner = course.owner_id === user.id;
    return { canModify: isOwner };

  } catch (error) {
    console.error('Error checking course modification access:', error);
    return { canModify: false, error: 'Failed to verify access' };
  }
}

