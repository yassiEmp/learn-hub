import React from 'react';
import { motion , Variants } from 'framer-motion';
import { courses } from '../data/courses';
import { Course } from '../types/course';
import { Header } from './dashboard/Header';
import { StatsGrid } from './dashboard/StatsGrid';
import { ContinueLearning } from './dashboard/ContinueLearning';
import { RecentActivity } from './dashboard/RecentActivity';
import { getStats } from './dashboard/data';

interface DashboardProps {
  onCourseSelect: (course: Course) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCourseSelect }) => {
  const enrolledCourses = courses.filter(course => course.isEnrolled);
  const completedCourses = enrolledCourses.filter(course => course.progress === 100);
  const totalHours = enrolledCourses.reduce((acc, course) => {
    const hours = parseInt(course.duration.split(' ')[0]);
    return acc + hours;
  }, 0);

  const stats = getStats(enrolledCourses, completedCourses, totalHours);

  // variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
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
    <div className="min-h-screen bg-black relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Header variants={itemVariants} />
        <StatsGrid stats={stats} />
        <ContinueLearning 
          enrolledCourses={enrolledCourses} 
          onCourseSelect={onCourseSelect}
          variants={itemVariants}
        />
        <RecentActivity variants={itemVariants} />
      </motion.div>
    </div>
  );
};

export default Dashboard; 