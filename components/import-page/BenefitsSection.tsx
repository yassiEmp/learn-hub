import { motion } from "framer-motion";
import { Globe, ArrowRight } from 'lucide-react';
import { benefits } from './data';

export const BenefitsSection = () => {
  return (
    <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="px-4 py-2 text-sm font-geist-mono text-white bg-white/15 backdrop-blur-md rounded-full border border-white/30 inline-block mb-8 shadow-lg">
              Why Choose LearnHub
            </span>
            <h2 className="text-4xl md:text-5xl font-syne font-medium text-white mb-8 leading-tight">
              Accelerate your learning journey
            </h2>
            <p className="text-xl text-white/80 font-geist-mono mb-10 leading-relaxed">
              Experience the future of education with our comprehensive platform designed to maximize your learning potential.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-2 h-2 rounded-full bg-white/80" />
                  <span className="text-white/90 font-geist-mono text-base">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-10 relative overflow-hidden">
              <motion.div
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)'
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute inset-0"
              />

              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-8"
                >
                  <Globe className="w-10 h-10 text-white/80" />
                </motion.div>

                <h3 className="font-syne font-medium text-white text-2xl mb-6">
                  Ready to get started?
                </h3>
                <p className="text-white/80 font-geist-mono text-base mb-8 leading-relaxed">
                  Join thousands of learners who are already transforming their careers.
                </p>

                <motion.button
                  className="flex items-center space-x-2 px-8 py-4 bg-white text-black rounded-xl font-geist-mono font-medium hover:bg-white/90 transition-all duration-300 mx-auto text-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 