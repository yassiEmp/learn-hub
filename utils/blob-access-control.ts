import 'server-only';
import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { verifyAuth } from '@/utils/auth/server';
import { db } from '@/lib/db';
import { courses } from '@/lib/db/schema';
import type { BlobFile } from '@/utils/blob-helpers';
import { isUuid } from '@/utils/db-mappers';

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
    const { user, error: authError } = await verifyAuth(req);
    if (authError || !user) {
      return { hasAccess: false, error: 'Authentication required' };
    }

    // Without a course, the uploader owns the blob (pathname users/{id}/...)
    if (!courseId) {
      const isOwner = blobPathname.startsWith(`users/${user.id}/`);
      return {
        hasAccess: isOwner,
        context: { userId: user.id, courseId: '', isPublic: false, isOwner },
      };
    }

    if (!isUuid(courseId)) return { hasAccess: false, error: 'Course not found' };

    const [course] = await db
      .select({ ownerId: courses.ownerId, isPublic: courses.isPublic, sourceFiles: courses.sourceFiles })
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (!course) return { hasAccess: false, error: 'Course not found' };

    // The blob must belong to this course, otherwise a public course could be
    // used to read any other user's file.
    const files = (Array.isArray(course.sourceFiles) ? course.sourceFiles : []) as BlobFile[];
    if (!files.some((f) => f?.pathname === blobPathname)) {
      return { hasAccess: false, error: 'File not found for this course' };
    }

    const isOwner = course.ownerId === user.id;
    const isPublic = course.isPublic;

    if (isOwner || isPublic) {
      return { hasAccess: true, context: { userId: user.id, courseId, isPublic, isOwner } };
    }

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

  if (courseId) {
    const [course] = await db
      .select({ sourceFiles: courses.sourceFiles })
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);
    const files = (Array.isArray(course?.sourceFiles) ? course.sourceFiles : []) as BlobFile[];
    const file = files.find((f) => f?.pathname === blobPathname);
    if (file?.url) return { url: file.url };
  }

  return { error: 'File URL not found' };
}

/**
 * Check if user can modify course files (only owner)
 */
export async function canModifyCourseFiles(
  req: NextRequest,
  courseId: string
): Promise<{ canModify: boolean; error?: string }> {
  try {
    const { user, error: authError } = await verifyAuth(req);
    if (authError || !user) {
      return { canModify: false, error: 'Authentication required' };
    }
    if (!isUuid(courseId)) return { canModify: false, error: 'Course not found' };

    const [course] = await db
      .select({ ownerId: courses.ownerId })
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (!course) return { canModify: false, error: 'Course not found' };
    return { canModify: course.ownerId === user.id };
  } catch (error) {
    console.error('Error checking course modification access:', error);
    return { canModify: false, error: 'Failed to verify access' };
  }
}
