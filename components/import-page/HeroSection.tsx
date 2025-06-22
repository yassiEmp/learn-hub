import { motion, easeInOut } from "framer-motion";
import { ShaderBackground } from '../ui/ShaderBackground';
import Title from '../../features/import/components/Title';
import InputSection from '../../features/import/components/InputSection';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easeInOut,
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: easeInOut
    }
  }
};

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* WebGL Shader Background - Only for header */}
      <div className="absolute inset-0 z-0">
        <ShaderBackground />
      </div>

      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Hero Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center justify-center min-h-screen sm:pt-10 md:pt-20 pt-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="w-full max-w-4xl mx-auto space-y-14 sm:space-y-12 text-center">
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            {/* Badge */}
            <motion.span
              className="px-4 py-2 text-sm font-geist-mono text-white bg-white/15 backdrop-blur-md rounded-full border border-white/30 inline-block shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              AI Course Creator
            </motion.span>

            <Title />

            <motion.p
              className="text-xl md:text-2xl text-white/90 font-geist-mono max-w-3xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Transform your ideas into comprehensive courses with the power of AI.
              Simply describe what you want to learn or teach.
            </motion.p>
          </motion.div>

          <motion.div
            className="w-full"
            variants={itemVariants}
          >
            <InputSection />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}; 