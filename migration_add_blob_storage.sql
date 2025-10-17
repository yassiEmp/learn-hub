-- Migration: Add blob storage support to courses table
-- This migration adds source_files and is_public columns to support Vercel Blob integration

-- Add source_files column to store blob URLs and metadata
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS source_files JSONB DEFAULT '[]';

-- Add is_public column to control blob access
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Create index for efficient blob pathname lookups
CREATE INDEX IF NOT EXISTS idx_courses_source_files ON courses USING GIN (source_files);

-- Create index for public course queries
CREATE INDEX IF NOT EXISTS idx_courses_is_public ON courses (is_public);

-- Add comment explaining the source_files structure
COMMENT ON COLUMN courses.source_files IS 'Array of blob file objects: [{url, pathname, type, filename, size, uploadedAt}]';
COMMENT ON COLUMN courses.is_public IS 'Whether course files are publicly accessible (affects blob access)';

