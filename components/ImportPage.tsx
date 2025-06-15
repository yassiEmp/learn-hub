"use client"
import React from 'react'
import { motion } from "framer-motion"
import Nav from './Header';
import { HeroSection } from './import-page/HeroSection';
import { FeaturesSection } from './import-page/FeaturesSection';
import { StatsSection } from './import-page/StatsSection';
import { SuccessStoriesSection } from './import-page/SuccessStoriesSection';
import { BenefitsSection } from './import-page/BenefitsSection';

const ImportPage = () => {
  return (
    <div className='w-full h-full bg-black'>
      {/* Full Width Header for Import Page */}
      <Nav currentPath="/import" />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Rest of the content with simple background */}
      <div className="bg-black relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => {
          const baseX = (i * 5) % 100;
          const baseY = (i * 7) % 100;
          const duration = 4 + (i % 3);
          const delay = (i * 0.2) % 2;
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/10 rounded-full"
              animate={{
                x: [0, (baseX - 50)],
                y: [0, (baseY - 50)],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
              }}
              style={{
                left: `${baseX}%`,
                top: `${baseY}%`,
              }}
            />
          );
        })}

        {/* Large background glow */}
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Features Section */}
        <FeaturesSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Success Stories Section */}
        <SuccessStoriesSection />

        {/* Benefits Section */}
        <BenefitsSection />
      </div>
    </div>
  )
}

export default ImportPage
