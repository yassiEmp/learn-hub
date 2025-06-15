import React, { useState, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, ArrowLeft } from 'lucide-react';
import { Course } from '../types/course';

interface VideoPlayerProps {
  course: Course;
  onBack: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ course, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // Mock duration
  const [currentLessonIndex, setCurrentLessonIndex] = useState(
    course.lessons.findIndex(lesson => lesson.isCurrent) || 0
  );
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentLesson = course.lessons[currentLessonIndex];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const nextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentTime(0);
    }
  };

  const prevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setCurrentTime(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-300 hover:text-white mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to course
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">{course.title}</h1>
              <p className="text-gray-400">{currentLesson?.title}</p>
            </div>
            <div className="text-gray-400 text-sm">
              Lesson {currentLessonIndex + 1} of {course.lessons.length}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Video Player */}
        <div className="flex-1 bg-black">
          <div className="relative aspect-video">
            {/* Mock video placeholder */}
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                  {isPlaying ? (
                    <Pause className="w-12 h-12 text-white" />
                  ) : (
                    <Play className="w-12 h-12 text-white ml-1" />
                  )}
                </div>
                <p className="text-white text-lg">{currentLesson?.title}</p>
                <p className="text-gray-400">{currentLesson?.duration}</p>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={prevLesson}
                    disabled={currentLessonIndex === 0}
                    className="p-2 hover:bg-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </button>
                  <button
                    onClick={nextLesson}
                    disabled={currentLessonIndex === course.lessons.length - 1}
                    className="p-2 hover:bg-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  <button className="p-2 hover:bg-gray-700 rounded-full">
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-700 rounded-full">
                    <Maximize className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-600 rounded-full h-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full" 
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <div className="lg:w-80 bg-white">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Content</h3>
            <p className="text-sm text-gray-500">
              {course.lessons.filter(l => l.isCompleted).length} of {course.lessons.length} lessons completed
            </p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {course.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                onClick={() => setCurrentLessonIndex(index)}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  index === currentLessonIndex ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {lesson.isCompleted ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white\" fill="currentColor\" viewBox="0 0 20 20">
                          <path fillRule="evenodd\" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : index === currentLessonIndex ? (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Play className="w-3 h-3 text-white ml-0.5" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium ${
                      index === currentLessonIndex ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {lesson.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">{lesson.duration}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};