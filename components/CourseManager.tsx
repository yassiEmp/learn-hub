'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { courseApi, handleApiError } from '@/utils/api-client';
import { CourseResponse } from '@/types/course';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

// Type definitions for form state
type StyleType = 'markdown' | 'aiGen' | 'chunk';
type LevelType = 'Beginner' | 'Intermediate' | 'Advanced';

interface CourseFormState {
  title: string;
  description: string;
  text: string;
  style: StyleType;
  category: string;
  level: LevelType;
  price: number;
  tags: string[];
}

export default function CourseManager() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state for creating courses
  const [formData, setFormData] = useState<CourseFormState>({
    title: '',
    description: '',
    text: '',
    style: 'markdown',
    category: 'General',
    level: 'Beginner',
    price: 0,
    tags: []
  });

  // Load user's courses
  const loadCourses = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userCourses = await courseApi.getAll();
      setCourses(userCourses);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new course
  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const newCourse = await courseApi.create({
        ...formData,
        content: formData.text // Add content field for API compatibility
      });
      setCourses(prev => [newCourse, ...prev]);
      setMessage({ type: 'success', text: 'Course created successfully!' });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        text: '',
        style: 'markdown',
        category: 'General',
        level: 'Beginner',
        price: 0,
        tags: []
      });
    } catch (error) {
      const errorMessage = handleApiError(error);
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Delete a course
  const deleteCourse = async (courseId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      await courseApi.delete(courseId);
      setCourses(prev => prev.filter(course => course.id !== courseId));
      setMessage({ type: 'success', text: 'Course deleted successfully!' });
    } catch (error) {
      const errorMessage = handleApiError(error);
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Please log in to manage courses.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-2">Course Manager</h1>
          <p className="text-gray-400">Create and manage your courses with AI-powered title generation</p>
        </motion.div>

        {/* Message Display */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-900/50 border border-green-500/50 text-green-300' 
                : 'bg-red-900/50 border border-red-500/50 text-red-300'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Create Course Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gray-900 rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Create New Course</h2>
          <form onSubmit={createCourse} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title (Optional - AI will generate if empty)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave empty for AI-generated title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description (Optional - AI will generate if empty)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Leave empty for AI-generated description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Content *
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
                placeholder="Enter your course content here... (AI will analyze this to generate title, description, and lessons)"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Style
                </label>
                <select
                  value={formData.style}
                  onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value as StyleType }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="markdown">Markdown</option>
                  <option value="aiGen">AI Generated</option>
                  <option value="chunk">Chunk</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as LevelType }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-blue-300 font-semibold mb-2">🤖 AI Features</h3>
              <ul className="text-blue-200 text-sm space-y-1">
                <li>• <strong>Auto-generated title:</strong> AI analyzes your content to create compelling course titles</li>
                <li>• <strong>Smart description:</strong> Automatically generates course descriptions based on content</li>
                <li>• <strong>Intelligent lessons:</strong> Creates structured lessons from your content</li>
                <li>• <strong>Multiple styles:</strong> Choose from Markdown, AI Generated, or Chunk processing</li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating...' : 'Create Course with AI'}
            </Button>
          </form>
        </motion.div>

        {/* Course List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-900 rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Your Courses</h2>
          
          {loading && courses.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No courses found. Create your first course above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                      <p className="text-gray-400 text-sm mb-2">{course.description}</p>
                      <div className="flex gap-2 text-xs text-gray-500">
                        <span>Category: {course.category}</span>
                        <span>Level: {course.level}</span>
                        <span>Price: ${course.price}</span>
                        <span>Lessons: {course.lessons?.length || 0}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => deleteCourse(course.id)}
                      variant="outline"
                      className="bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700"
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 