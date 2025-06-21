"use client"
import React from 'react'

const Bagde = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
        {/* Bolt.new Badge */}
    <a 
      href="https://bolt.new/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block transition-all duration-300 hover:shadow-2xl"
    >
      <img 
        src="https://storage.bolt.army/logotext_poweredby_360w.png" 
        alt="Powered by Bolt.new badge" 
        className="h-8 md:h-10 w-auto shadow-lg opacity-90 hover:opacity-100 bolt-badge bolt-badge-intro"
        onAnimationEnd={(e) => e.currentTarget.classList.add('animated')}
      />
    </a>
    </div>
  )
}

export default Bagde