import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CourseBrowser } from './components/CourseBrowser';
import { CourseDetail } from './components/CourseDetail';
import { VideoPlayer } from './components/VideoPlayer';
import { Course } from './types/course';
import { ThemeProvider } from './contexts/ThemeContext';

// Lazy load ImportPage for better initial performance
const ImportPage = lazy(() => import('./components/ImportPage').then(module => ({ default: module.ImportPage })));

type ViewType = 'dashboard' | 'courses' | 'my-learning' | 'course-detail' | 'video-player' | 'import';

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('import');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Remove the debug border effect for production
  useEffect(() => {
    // Only enable in development
    if (process.env.NODE_ENV === 'development') {
      const elements = Array.from(
        document.querySelectorAll("*")
      ) as HTMLElement[];
      elements.forEach((element) => {
        window.addEventListener("keypress", (e) => {
          if (e.key === "b") {
            element.classList.add("borderS");
            element.style.backgroundColor = `rgba(${Math.random() * 255},${
              Math.random() * 255
            },${Math.random() * 255},${Math.random() * 255})`;
          }
          if (e.key === "r") {
            element.classList.remove("borderS");
            element.style.backgroundColor = "";
          }
        });
      });
    }
  }, []);

  const handleViewChange = (view: string) => {
    setCurrentView(view as ViewType);
    if (view !== 'course-detail' && view !== 'video-player') {
      setSelectedCourse(null);
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView('course-detail');
  };

  const handleStartLearning = (course: Course) => {
    setSelectedCourse(course);
    setCurrentView('video-player');
  };

  const handleBackToCourses = () => {
    setCurrentView('courses');
    setSelectedCourse(null);
  };

  const handleBackToCourseDetail = () => {
    setCurrentView('course-detail');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'import':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ImportPage />
          </Suspense>
        );
      case 'dashboard':
        return <Dashboard onCourseSelect={handleCourseSelect} />;
      case 'courses':
        return <CourseBrowser onCourseSelect={handleCourseSelect} />;
      case 'my-learning':
        return <CourseBrowser onCourseSelect={handleCourseSelect} />;
      case 'course-detail':
        return selectedCourse ? (
          <CourseDetail
            course={selectedCourse}
            onBack={handleBackToCourses}
            onStartLearning={handleStartLearning}
          />
        ) : null;
      case 'video-player':
        return selectedCourse ? (
          <VideoPlayer
            course={selectedCourse}
            onBack={handleBackToCourseDetail}
          />
        ) : null;
      default:
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ImportPage />
          </Suspense>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {currentView !== 'video-player' && currentView !== 'import' && (
        <Header currentView={currentView} onViewChange={handleViewChange} />
      )}
      {renderContent()}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;