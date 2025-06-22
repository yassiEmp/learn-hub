import { motion } from "framer-motion";
import { Quote, CheckCircle } from 'lucide-react';
import { successStories } from './data';

export const SuccessStoriesSection = () => {
  return (
    <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="px-4 py-2 text-sm font-geist-mono text-white bg-white/15 backdrop-blur-md rounded-full border border-white/30 inline-block mb-8 shadow-lg">
            Success Stories
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-syne font-medium text-white mb-6 leading-tight">
            Real people, real results
          </h2>
          <p className="text-xl md:text-2xl text-white/80 font-geist-mono max-w-3xl mx-auto leading-relaxed">
            Discover how our learners transformed their careers and achieved their dreams.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
              }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {successStories.map((story, index) => (
            <motion.div
              key={index}
              className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300 group relative overflow-hidden"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5 }
                }
              }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              {/* Quote icon */}
              <motion.div
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Quote className="w-4 h-4 text-white/40" />
              </motion.div>

              {/* Profile */}
              <div className="flex items-center space-x-4 mb-6">
                <motion.img
                  src={story.image}
                  alt={story.name}
                  className="w-12 h-12 rounded-full border border-white/20"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
                <div>
                  <h3 className="font-syne font-medium text-white text-xl">{story.name}</h3>
                  <p className="text-white/70 font-geist-mono text-base">{story.role}</p>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-white/90 font-geist-mono text-base leading-relaxed mb-6 italic">
                &quot;{story.quote}&quot;
              </blockquote>

              {/* Achievement */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-geist-mono text-base font-medium">
                    {story.achievement}
                  </span>
                </div>
                <div className="text-white/60 font-geist-mono text-sm">
                  Course: {story.course}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}; 