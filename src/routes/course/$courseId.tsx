import React from 'react';
import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router';
import { CourseDetail } from '../../components/CourseDetail';
import { courses } from '../../data/courses';
import { Course } from '../../types/course';

export const Route = createFileRoute('/course/$courseId')({
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const { courseId } = Route.useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get course from state or find by ID
  const course = (location.state as { course?: Course })?.course || 
                 courses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <button
            onClick={() => navigate({ to: '/courses' })}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate({ to: '/courses' });
  };

  const handleStartLearning = (course: Course) => {
    navigate({ 
      to: '/course/$courseId/learn', 
      params: { courseId: course.id },
      state: { course }
    });
  };

  return (
    <CourseDetail
      course={course}
      onBack={handleBack}
      onStartLearning={handleStartLearning}
    />
  );
}