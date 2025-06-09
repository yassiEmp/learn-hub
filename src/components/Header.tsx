import React, { useState } from 'react';
import { Search, Bell, User, Menu, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ui/ThemeToggle';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'import', label: 'Create Course' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'courses', label: 'Browse Courses' },
    { id: 'my-learning', label: 'My Learning' },
  ];

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.header 
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div className="flex items-center" variants={itemVariants}>
            <div className="flex-shrink-0">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent font-unbounded">
                  LearnHub
                </h1>
              </motion.div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden md:flex space-x-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2
                }
              }
            }}
          >
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 font-unbounded ${
                  currentView === item.id
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </motion.nav>

          {/* Search, Theme Toggle and User Menu */}
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.4
                }
              }
            }}
          >
            <motion.div className="relative" variants={itemVariants}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-unbounded transition-all duration-300"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ThemeToggle />
            </motion.div>
            
            <motion.button 
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200"
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="h-6 w-6" />
            </motion.button>
            <motion.button 
              className="flex items-center space-x-2 p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <img
                className="h-8 w-8 rounded-full"
                src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
                alt="Profile"
              />
              <span className="text-sm font-medium font-unbounded">John Doe</span>
            </motion.button>
          </motion.div>

          {/* Mobile menu button */}
          <motion.div 
            className="md:hidden flex items-center space-x-2"
            variants={itemVariants}
          >
            <ThemeToggle />
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={isMenuOpen ? "open" : "closed"}
          variants={{
            open: {
              opacity: 1,
              height: "auto",
              transition: {
                duration: 0.3,
                staggerChildren: 0.1,
                delayChildren: 0.1
              }
            },
            closed: {
              opacity: 0,
              height: 0,
              transition: {
                duration: 0.3,
                staggerChildren: 0.05,
                staggerDirection: -1
              }
            }
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium font-unbounded transition-all duration-200 ${
                  currentView === item.id
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                variants={{
                  open: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.3 }
                  },
                  closed: {
                    opacity: 0,
                    x: -20,
                    transition: { duration: 0.2 }
                  }
                }}
                whileHover={{ x: 5 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};