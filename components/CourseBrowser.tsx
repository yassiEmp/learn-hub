import React, { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { CourseCard } from './CourseCard';
import { Course } from '../types/course';
import { motion , Variants } from 'framer-motion';
import FloatingParticle from './FloatingParticle';
import { useRouter } from 'next/navigation';
import { useCourses } from '../features/course/hooks/useCourses';

export const CourseBrowser: React.FC = () => {
  const { courses, categories, loading, error } = useCourses();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();

  const filteredCourses = courses
    .filter(course => {
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.studentsCount || 0) - (a.studentsCount || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

  const handleCourseSelect = (course: Course) => {
    router.push(`/course/${course.id}/detail`);
  };

  const containerVariants : Variants= {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants : Variants= {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading courses...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-black relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      <div className='w-full h-full absolute top-0 left-0 overflow-hidden'>
        <FloatingParticle />
      </div>
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-12 text-center" variants={itemVariants}>
          <span className="px-3 py-1 text-xs font-geist-mono text-white bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20 inline-block">
            Course Library
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-syne font-medium text-white mb-4 tracking-tight">
            Discover Knowledge
          </h1>
          <p className="text-lg md:text-xl text-white/60 font-geist-mono max-w-2xl mx-auto">
            Explore our curated collection of premium courses designed to accelerate your learning journey.
          </p>
        </motion.div>
        {/* Search and Filters */}
        <motion.div 
          className="mb-12"
          variants={itemVariants}
        >
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-white/40" />
                </div>
                <motion.input
                  type="text"
                  placeholder="Search courses, instructors, topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-white/10 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300 font-geist-mono backdrop-blur-sm"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              {/* Sort and View Mode */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-white/40" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-white/10 rounded-xl px-3 py-2 bg-white/5 text-white font-geist-mono text-sm focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
                <div className="flex items-center space-x-1 bg-white/5 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
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
                  className={`px-4 py-2 rounded-full text-xs font-geist-mono transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
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
          </div>
        </motion.div>
        {/* Results */}
        <motion.div className="mb-8" variants={itemVariants}>
          <p className="text-white/50 font-geist-mono text-sm">
            Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </motion.div>
        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <motion.div 
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}
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
            {filteredCourses.map((course) => (
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
                onClick={() => handleCourseSelect(course)}
                className="cursor-pointer"
              >
                <CourseCard
                  course={course}
                  onCourseSelect={handleCourseSelect}
                  viewMode={viewMode}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-20"
            variants={itemVariants}
          >
            <motion.div 
              className="text-white/20 mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Search className="h-16 w-16 mx-auto" />
            </motion.div>
            <h3 className="text-2xl font-syne font-medium text-white mb-4">No courses found</h3>
            <p className="text-white/50 font-geist-mono">
              Try adjusting your search terms or browse different categories.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};