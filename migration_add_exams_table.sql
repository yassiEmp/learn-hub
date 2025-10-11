-- Migration: Add exams table
-- This migration creates the exams table to store generated exams

CREATE TABLE exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  exercises JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_exams_owner_id ON exams(owner_id);
CREATE INDEX idx_exams_course_id ON exams(course_id);

-- Enable Row Level Security
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own exams" ON exams
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own exams" ON exams
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own exams" ON exams
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own exams" ON exams
  FOR DELETE USING (auth.uid() = owner_id);
