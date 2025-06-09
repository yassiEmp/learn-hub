import React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Header } from '../components/Header';
import { CourseBrowser } from '../components/CourseBrowser';
import { Course } from '../types/course';

export const Route = createFileRoute('/my-learning')({
  component: MyLearningPage,
});

function MyLearningPage() {
  const navigate = useNavigate();

  const handleCourseSelect = (course: Course) => {
    navigate({ 
      to: '/course/$courseId', 
      params: { courseId: course.id },
      state: { course }
    });
  };

  const handleViewChange = (view: string) => {
    switch (view) {
      case 'import':
        navigate({ to: '/' });
        break;
      case 'courses':
        navigate({ to: '/courses' });
        break;
      case 'my-learning':
        navigate({ to: '/my-learning' });
        break;
      case 'dashboard':
        navigate({ to: '/dashboard' });
        break;
    }
  };

  return (
    <>
      <Header currentView="my-learning" onViewChange={handleViewChange} />
      <CourseBrowser onCourseSelect={handleCourseSelect} />
    </>
  );
}