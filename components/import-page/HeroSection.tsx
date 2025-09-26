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
    <section className="w-full min-h-screen pt-24 bg-[linear-gradient(135deg,_#EFA6DF_0%,_#666BDF_26.44%,_#4CB9DF_100%)] dark:bg-[linear-gradient(116.54deg,_#0A2245_0%,_#003E54_50%,_#15448A_100%)]">
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {/* SVG noise overlay using feTurbulence */}
        <svg
          width="100%"
          height="100%"
          className="w-full h-full"
          style={{ position: "absolute", top: 0, left: 0, mixBlendMode: "overlay" }}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              seed="8"
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="saturate"
              values="0.7"
            />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.12" />
            </feComponentTransfer>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
      <h1 className='text-3xl text-white text-center mt-12 mb-12'>What Are We Mastering Today ?</h1>
      <p className='text-2xl text-white/70 text-center mt-6 '>Ready To</p>
      <Title />
      <InputSection />
      
    </section>
  );
}; 