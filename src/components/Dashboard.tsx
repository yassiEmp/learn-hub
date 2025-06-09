import React from 'react';
import { TrendingUp, Clock, Award, BookOpen } from 'lucide-react';
import { courses } from '../data/courses';
import { CourseCard } from './CourseCard';
import { Course } from '../types/course';
import { motion } from 'framer-motion';

interface DashboardProps {
  onCourseSelect: (course: Course) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onCourseSelect }) => {
  const enrolledCourses = courses.filter(course => course.isEnrolled);
  const completedCourses = enrolledCourses.filter(course => course.progress === 100);
  const totalHours = enrolledCourses.reduce((acc, course) => {
    const hours = parseInt(course.duration.split(' ')[0]);
    return acc + hours;
  }, 0);

  const stats = [
    {
      label: 'Courses Enrolled',
      value: enrolledCourses.length,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      label: 'Courses Completed',
      value: completedCourses.length,
      icon: Award,
      color: 'bg-green-500',
    },
    {
      label: 'Learning Hours',
      value: totalHours,
      icon: Clock,
      color: 'bg-purple-500',
    },
    {
      label: 'Skill Level',
      value: 'Intermediate',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
        <p className="text-gray-600">Continue your learning journey and achieve your goals.</p>
      </motion.div>

      {/* Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.3
            }
          }
        }}
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={index} 
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.9 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { duration: 0.5 }
              }
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <div className="flex items-center">
              <motion.div 
                className={`${stat.color} p-3 rounded-lg`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className="h-6 w-6 text-white" />
              </motion.div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <motion.p 
                  className="text-2xl font-bold text-gray-900"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  {stat.value}
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Continue Learning */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
        >
          {enrolledCourses.map((course, index) => (
            <motion.div
              key={course.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.5 }
                }
              }}
            >
              <CourseCard
                course={course}
                onCourseSelect={onCourseSelect}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        className="bg-white rounded-xl shadow-md p-6"
        variants={itemVariants}
      >
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
        <motion.div 
          className="space-y-4"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
        >
          {[
            {
              icon: Award,
              title: 'Completed "Your First Component"',
              subtitle: 'React Development Bootcamp • 2 hours ago',
              color: 'bg-green-100 text-green-600'
            },
            {
              icon: BookOpen,
              title: 'Started "Props and State"',
              subtitle: 'React Development Bootcamp • 1 day ago',
              color: 'bg-blue-100 text-blue-600'
            },
            {
              icon: TrendingUp,
              title: 'Enrolled in Python for Data Science',
              subtitle: '3 days ago',
              color: 'bg-purple-100 text-purple-600'
            }
          ].map((activity, index) => (
            <motion.div 
              key={index}
              className="flex items-center space-x-4"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { duration: 0.4 }
                }
              }}
              whileHover={{ x: 5 }}
            >
              <motion.div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <activity.icon className="w-5 h-5" />
              </motion.div>
              <div>
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};