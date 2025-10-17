import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter, Grid, List, Plus, BookOpen } from 'lucide-react';
import { ExamCard } from './ExamCard';
import { ExamData } from '../features/exam/hooks/useExams';
import { motion, Variants } from 'framer-motion';
import FloatingParticle from './FloatingParticle';
import { useRouter } from 'next/navigation';
import { useExams } from '../features/exam/hooks/useExams';

const ExamBrowserComponent: React.FC = () => {
  const { exams, loading, error } = useExams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();

  // Get unique categories from exams
  const categories = useMemo(() => {
    const cats = new Set(exams.map(exam => exam.course?.category || 'General'));
    return ['All', ...Array.from(cats)];
  }, [exams]);

  // Memoize filtered exams to prevent recalculation on every render
  const filteredExams = useMemo(() => {
    return exams
      .filter(exam => {
        const matchesCategory = selectedCategory === 'All' || (exam.course?.category || 'General') === selectedCategory;
        const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (exam.course?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (exam.course?.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'recent':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'oldest':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case 'questions':
            return b.totalQuestions - a.totalQuestions;
          case 'duration':
            return b.estimatedDuration - a.estimatedDuration;
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [exams, selectedCategory, searchTerm, sortBy]);

  // Memoize callback to prevent unnecessary re-renders
  const handleExamSelect = useCallback((exam: ExamData) => {
    router.push(`/exam/${exam.id}`);
  }, [router]);

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

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"
        >
          <BookOpen className="w-6 h-6 text-white" />
        </motion.div>
        <p className="text-white/60 font-geist-mono">Loading exams...</p>
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">Error loading exams</div>
        <p className="text-white/60 font-geist-mono">{error}</p>
      </div>
    </div>
  );

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
            Exam Library
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-syne font-medium text-white mb-4 tracking-tight">
            Test Your Knowledge
          </h1>
          <p className="text-lg md:text-xl text-white/60 font-geist-mono max-w-2xl mx-auto">
            Practice with AI-generated exams based on your courses. Track your progress and improve your understanding.
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
                  placeholder="Search exams, courses, topics..."
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
                    <option value="recent">Most Recent</option>
                    <option value="oldest">Oldest First</option>
                    <option value="questions">Most Questions</option>
                    <option value="duration">Longest Duration</option>
                    <option value="title">Alphabetical</option>
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
            Showing {filteredExams.length} exam{filteredExams.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </motion.div>

        {/* Exam Grid */}
        {filteredExams.length > 0 ? (
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
            {filteredExams.map((exam) => (
              <motion.div
                key={exam.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.5 }
                  }
                }}
                onClick={() => handleExamSelect(exam)}
                className="cursor-pointer"
              >
                <ExamCard
                  exam={exam}
                  onExamSelect={handleExamSelect}
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
              <BookOpen className="h-16 w-16 mx-auto" />
            </motion.div>
            <h3 className="text-2xl font-syne font-medium text-white mb-4">No exams found</h3>
            <p className="text-white/50 font-geist-mono mb-6">
              {exams.length === 0 
                ? "You haven't created any exams yet. Generate exams from your courses to get started."
                : "Try adjusting your search terms or browse different categories."
              }
            </p>
            {exams.length === 0 && (
              <motion.button
                onClick={() => router.push('/courses')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-black rounded-xl font-geist-mono font-medium hover:bg-white/90 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
                <span>Browse Courses</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const ExamBrowser = React.memo(ExamBrowserComponent);
