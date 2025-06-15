import React, { useState } from 'react';
import { ArrowLeft, Play, Clock, Users, Star, CheckCircle, Lock, BookOpen, Code, Palette, Database, Smartphone, Settings } from 'lucide-react';
import { Course } from '../types/course';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onStartLearning: (course: Course) => void;
}

// Category icon mapping
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'web development':
      return Code;
    case 'data science':
      return Database;
    case 'design':
      return Palette;
    case 'mobile development':
      return Smartphone;
    case 'devops':
      return Settings;
    default:
      return BookOpen;
  }
};

// Category color mapping
const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'web development':
      return 'from-blue-500 to-cyan-500';
    case 'data science':
      return 'from-green-500 to-emerald-500';
    case 'design':
      return 'from-purple-500 to-pink-500';
    case 'mobile development':
      return 'from-orange-500 to-red-500';
    case 'devops':
      return 'from-gray-500 to-slate-500';
    default:
      return 'from-indigo-500 to-blue-500';
  }
};

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack, onStartLearning }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const CategoryIcon = getCategoryIcon(course.category);
  const categoryColor = getCategoryColor(course.category);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'instructor', label: 'Instructor' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to courses
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
            <div className="flex-1">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-semibold">
                  {course.category}
                </span>
                <span className="ml-3 text-gray-500">{course.level}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>
              
              <p className="text-gray-600 text-lg mb-6">
                {course.description}
              </p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium mr-1">{course.rating}</span>
                  <span>({course.studentsCount.toLocaleString()} students)</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-1" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-1" />
                  {course.lessonsCount} lessons
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium text-gray-900">{course.instructor}</p>
                  <p className="text-gray-500 text-sm">Course Instructor</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-80">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                {/* Course thumbnail replacement with gradient and icon */}
                <div className={`w-full h-48 bg-gradient-to-br ${categoryColor} rounded-lg mb-6 relative overflow-hidden`}>
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
                  </div>
                  
                  {/* Category icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <CategoryIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-0.5" />
                    </div>
                  </div>
                </div>
                
                {course.isEnrolled ? (
                  <div className="space-y-4">
                    {course.progress !== undefined && (
                      <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Your Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full" 
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => onStartLearning(course)}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Continue Learning
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      {course.originalPrice && (
                        <span className="text-gray-500 line-through text-lg block">
                          ${course.originalPrice}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-gray-900">
                        ${course.price}
                      </span>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Enroll Now
                    </button>
                    <p className="text-center text-sm text-gray-500">
                      30-day money-back guarantee
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'overview' && (
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {course.tags.map((tag, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Master {tag} fundamentals and advanced concepts</span>
                  </div>
                ))}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Requirements</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-8">
                <li>Basic understanding of programming concepts</li>
                <li>Computer with internet connection</li>
                <li>Willingness to learn and practice</li>
              </ul>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {course.description} This comprehensive course is designed to take you from beginner to advanced level,
                with hands-on projects and real-world examples. You'll learn industry best practices and build a
                portfolio of projects that will help you stand out in the job market.
              </p>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
              <div className="space-y-4">
                {course.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="bg-white rounded-lg border p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        {lesson.isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : lesson.isCurrent ? (
                          <Play className="w-6 h-6 text-blue-500" />
                        ) : (
                          <Lock className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {index + 1}. {lesson.title}
                        </h3>
                        <p className="text-sm text-gray-500">{lesson.duration}</p>
                      </div>
                    </div>
                    {(course.isEnrolled || index === 0) && (
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        {lesson.isCompleted ? 'Review' : 'Watch'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'instructor' && (
            <div className="max-w-3xl">
              <div className="bg-white rounded-xl p-8">
                <div className="flex items-start space-x-6">
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructor}
                    className="w-24 h-24 rounded-full"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.instructor}</h2>
                    <p className="text-blue-600 font-medium mb-4">Senior Developer & Instructor</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>4.8 Instructor Rating</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>25,000+ Students</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      With over 10 years of experience in software development and 5 years in teaching,
                      {course.instructor} has helped thousands of students transition into successful tech careers.
                      Specializing in modern web development and data science, they bring real-world experience
                      and practical insights to every lesson.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};