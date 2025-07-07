# Database Schema for Learn Hub

This document outlines the database schema required for the Learn Hub application with proper authorization.

## Tables

### 1. courses

The main table for storing course information with ownership tracking.

```sql
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lessons JSONB DEFAULT '[]'::jsonb,
  category TEXT DEFAULT 'General',
  level TEXT DEFAULT 'Beginner',
  price DECIMAL(10,2) DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_courses_owner_id ON courses(owner_id);
CREATE INDEX idx_courses_created_at ON courses(created_at DESC);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own courses
CREATE POLICY "Users can view own courses" ON courses
  FOR SELECT USING (auth.uid() = owner_id);

-- Users can only insert their own courses
CREATE POLICY "Users can create own courses" ON courses
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Users can only update their own courses
CREATE POLICY "Users can update own courses" ON courses
  FOR UPDATE USING (auth.uid() = owner_id);

-- Users can only delete their own courses
CREATE POLICY "Users can delete own courses" ON courses
  FOR DELETE USING (auth.uid() = owner_id);
```

### 2. user_profiles (Optional - for extended user data)

```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## Environment Variables

Make sure you have these environment variables set in your `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google API (for course generation)
GOOGLE_API_KEY=your_google_api_key
```

## Setup Instructions

1. **Create Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project.

2. **Run SQL Commands**: In your Supabase dashboard, go to the SQL Editor and run the table creation commands above.

3. **Configure Authentication**: 
   - Enable Email/Password authentication
   - Configure OAuth providers (Google, Facebook) if needed
   - Set up email templates

4. **Set Environment Variables**: Add the environment variables to your `.env.local` file.

5. **Test the Setup**: Use the provided API endpoints to test course creation and management.

## Security Features

- **Row Level Security (RLS)**: Ensures users can only access their own data
- **JWT Token Verification**: All API requests require valid authentication tokens
- **Ownership Validation**: Server-side checks ensure users can only modify their own resources
- **Input Validation**: All inputs are validated before processing
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## API Endpoints

### Course Management
- `POST /api/v1/course` - Create a new course
- `GET /api/v1/course` - Get all courses for the authenticated user
- `GET /api/v1/course/[courseId]` - Get a specific course
- `PUT /api/v1/course/[courseId]` - Update a course
- `DELETE /api/v1/course/[courseId]` - Delete a course

### User Management
- `DELETE /api/v1/user` - Delete user account

All endpoints require authentication via Bearer token in the Authorization header. 