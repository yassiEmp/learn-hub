"use client"
import React from 'react'
import Nav from '@/components/hearderApp';
import { HeroSection } from './import-page/HeroSection-white';
import { FeaturesSection } from './import-page/FeaturesSection';
import { StatsSection } from './import-page/StatsSection';
import { SuccessStoriesSection } from './import-page/SuccessStoriesSection';
import { BenefitsSection } from './import-page/BenefitsSection';
import FloatingParticle from './FloatingParticle';

const ImportPage = () => {
  return (
    <div className='w-full h-full bg-black'>
      {/* Full Width Header for Import Page */}
      <Nav currentPath="/create" />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Rest of the content with simple background */}
      <div className="bg-black relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />

             <div className='w-full h-full absolute top-0 left-0 overflow-hidden'>
        <FloatingParticle />
      </div>

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
