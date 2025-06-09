import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { courses, categories } from '../data/courses';
import { CourseCard } from './CourseCard';
import { Course } from '../types/course';
import { motion } from 'framer-motion';

interface CourseBrowserProps {
  onCourseSelect: (course: Course) => void;
}

export const CourseBrowser: React.FC<CourseBrowserProps> = ({ onCourseSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const filteredCourses = courses
    .filter(course => {
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.studentsCount - a.studentsCount;
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        default:
          return 0;
      }
    });

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
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
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
      {/* Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Courses</h1>
        <p className="text-gray-600">Expand your skills with our comprehensive course library</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="bg-white rounded-xl shadow-md p-6 mb-8"
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <motion.input
              type="text"
              placeholder="Search courses, instructors, topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              whileFocus={{ scale: 1.02 }}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <motion.div 
          className="mt-6 flex flex-wrap gap-2"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.3
              }
            }
          }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { 
                  opacity: 1, 
                  scale: 1,
                  transition: { duration: 0.3 }
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Results */}
      <motion.div className="mb-6" variants={itemVariants}>
        <p className="text-gray-600">
          Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </motion.div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
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
          {filteredCourses.map((course, index) => (
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
      ) : (
        <motion.div 
          className="text-center py-12"
          variants={itemVariants}
        >
          <motion.div 
            className="text-gray-400 mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Search className="h-12 w-12 mx-auto" />
          </motion.div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">
            Try adjusting your search terms or browse different categories.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};