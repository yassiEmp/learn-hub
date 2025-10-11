"use client"
import React from 'react'
import Nav from '@/components/hearderApp';
import { HeroSection } from './import-page/HeroSection-white';

const ImportPage = () => {
  return (
    <div className='w-full h-full bg-black'>
      {/* Full Width Header for Import Page */}
      <Nav currentPath="/create" />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Rest of the content with simple background */}
      
    </div>
  )
}

export default ImportPage
