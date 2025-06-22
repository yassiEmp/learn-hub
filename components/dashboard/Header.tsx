import { motion, Variants } from 'framer-motion';

interface HeaderProps {
  variants: Variants;
}

export const Header: React.FC<HeaderProps> = ({ variants }) => {
  return (
    <motion.div className="mb-12" variants={variants}>
      <span className="px-3 py-1 text-xs font-geist-mono text-white bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20 inline-block">
        Learning Dashboard
      </span>
      <h1 className="text-4xl md:text-5xl font-syne font-medium text-white mb-4 tracking-tight">
        Welcome back, John
      </h1>
      <p className="text-lg text-white/60 font-geist-mono">
        Continue your learning journey and achieve your goals.
      </p>
    </motion.div>
  );
}; 