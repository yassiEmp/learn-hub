"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X } from 'lucide-react';
import { cva } from 'class-variance-authority';

// Navbar container variants
const navbarVariants = cva(
  "bg-black/5 border border-white/10 px-6 max-w-4xl w-full py-3 shadow-xl backdrop-blur-md mx-auto transition-[border-radius] duration-200",
  {
    variants: {
      isMenuOpen: {
        true: "rounded-xl",
        false: "rounded-full"
      }
    },
    defaultVariants: {
      isMenuOpen: false
    }
  }
);

// Navigation item variants
const navItemVariants = cva(
  "px-4 py-2 rounded-full text-xs font-geist-mono transition-all duration-300",
  {
    variants: {
      active: {
        true: "text-white bg-white/10",
        false: "text-white/60 hover:text-white hover:bg-white/5"
      }
    },
    defaultVariants: {
      active: false
    }
  }
);

// Mobile menu item variants
const mobileMenuItemVariants = cva(
  "block w-full text-left px-3 py-2 rounded-lg text-xs font-geist-mono transition-all duration-200",
  {
    variants: {
      active: {
        true: "text-white bg-white/10",
        false: "text-white/60 hover:text-white hover:bg-white/5"
      }
    },
    defaultVariants: {
      active: false
    }
  }
);

// Action button variants
const actionButtonVariants = cva(
  "text-xs font-geist-mono transition-all duration-300",
  {
    variants: {
      variant: {
        default: "text-white/60 hover:text-white",
        primary: "px-4 py-2 bg-white text-black rounded-full font-medium hover:bg-white/90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

// Navigation Items Component
const NavItems = ({ currentPath }: { currentPath: string }) => {
  const navItems = [
    { id: 'import', label: 'Create', path: '/import' },
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'courses', label: 'Explore', path: '/courses' },
    { id: 'my-learning', label: 'Learning', path: '/my-learning' },
  ];

  return (
    <nav className="hidden md:flex items-center space-x-1 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-fade-in">
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={item.path}
          className={navItemVariants({ active: currentPath === item.path })}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

// Action Buttons Component
const ActionButtons = () => (
  <div className="hidden md:flex items-center space-x-3 animate-fade-in">
    <Link href="/login" className={actionButtonVariants()}>
      Login
    </Link>
    
    <Link href="/signup" className={actionButtonVariants({ variant: "primary" })}>
      Start Learning
    </Link>
  </div>
);

// Main Nav Component
export default function Nav({ currentPath }: { currentPath: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'import', label: 'Create', path: '/import' },
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'courses', label: 'Explore', path: '/courses' },
    { id: 'exams', label: 'exams', path: '/exams' },
  ];

  return (
    <nav className="fixed top-6 transform z-50 w-full px-4 animate-slide-down">
      {/* Glass floating navbar */}
      <div className={navbarVariants({ isMenuOpen })}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center animate-fade-in">
            <Link 
              href="/"
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
            >
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-syne font-medium text-white">LearnHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavItems currentPath={currentPath} />

          {/* Action Buttons */}
          <ActionButtons />

          {/* Mobile Menu Button */}
          <div className="md:hidden animate-fade-in">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110 active:scale-90"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="pt-4 pb-2 space-y-2 border-t border-white/10 mt-3">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`${mobileMenuItemVariants({ active: currentPath === item.path })} animate-slide-in`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}