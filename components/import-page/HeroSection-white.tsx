import { motion, easeInOut } from "framer-motion";
import { ShaderBackground } from '../ui/ShaderBackground';
import Title from '../../features/import/components/Title';
import InputSection from '../../features/import/components/InputSection';
import { useTheme } from "next-themes";

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
  const { theme, setTheme } = useTheme()
  console.log(theme)

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* WebGL Shader Background - Only for header */}
      <div className="absolute inset-0 z-0">
        {theme == "dark" ? <ShaderBackground /> : <> <div
          className="absolute inset-0 z-0"
          style={{
            background: "#ffffff",
            backgroundImage: `
        radial-gradient(
          circle at top left,
          rgba(173, 109, 244, 0.5),
          transparent 70%
        )
      `,
            filter: "blur(80px)",
            backgroundRepeat: "no-repeat",
          }}
        /></>}
      </div>

      {/* Dark overlay to ensure text readability */}
      {/* <div className="absolute inset-0 bg-purple-100/30 z-10" /> */}

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
            <Title />


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