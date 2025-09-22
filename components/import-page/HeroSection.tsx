// import { motion, easeInOut } from "framer-motion";
import Title from '../../features/import/components/Title';
import InputSection from '../../features/import/components/InputSection';

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       duration: 0.6,
//       ease: easeInOut,
//       staggerChildren: 0.2,
//       delayChildren: 0.1
//     }
//   }
// };

// const itemVariants = {
//   hidden: {
//     opacity: 0,
//     y: 20,
//     scale: 0.98
//   },
//   visible: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: {
//       duration: 0.5,
//       ease: easeInOut
//     }
//   }
// };

export const HeroSection = () => {
  return (
    <section className="w-full bg-muted dark:bg-background min-h-screen pt-24">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), transparent",
        }}
      />
      <Title />
      <InputSection />
    </section>
  );
}; 