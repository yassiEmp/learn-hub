import { motion, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CourseCard } from '../CourseCard';
import { Course } from '../../types/course';

interface ContinueLearningProps {
  enrolledCourses: Course[];
  onCourseSelect: (course: Course) => void;
  variants: Variants;
}

export const ContinueLearning: React.FC<ContinueLearningProps> = ({ 
  enrolledCourses, 
  onCourseSelect,
  variants 
}) => {
  return (
    <motion.div className="mb-12" variants={variants}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-syne font-medium text-white mb-2">
            Continue Learning
          </h2>
          <p className="text-white/60 font-geist-mono text-sm">
            Pick up where you left off
          </p>
        </div>
        <motion.button
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl text-white hover:bg-white/15 transition-all duration-300 font-geist-mono text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
      
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
        {enrolledCourses.map((course) => (
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
  );
}; 