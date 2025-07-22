'use client';

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Image as Imag, Loader, Plus, Video } from 'lucide-react';
import { motion, Variants } from "framer-motion"
import { cn } from '@/lib/utils';

interface UploadControlsProps {
  onToggleImageUpload: () => void;
  onSubmit: (e: React.FormEvent | React.MouseEvent) => void;
  uploading: boolean;
}

export const UploadControls: React.FC<UploadControlsProps> = ({
  onToggleImageUpload,
  onSubmit,
  uploading,
}) => {

  const itemVariants: Variants = useMemo(() => ({
    hidden: { opacity: 0, y: 10, scale: 0.99 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }), []);

  const buttonVariants: Variants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.95, y: 5 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }), []);
  return (
    <div className="flex gap-4 mt-4 justify-between w-full">
      <motion.div
        className="flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        variants={itemVariants}
      >
        <motion.div
          className="flex flex-wrap gap-3"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.04,
                delayChildren: 0.05
              }
            }
          }}
        >
          <motion.div variants={buttonVariants}>
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-200 gap-2 backdrop-blur-sm text-sm font-geist-mono"
            >
              <Plus className="w-4 h-4" />
              <Video className="w-4 h-4" />
              Video
            </Button>
          </motion.div>
          <motion.div variants={buttonVariants}>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={onToggleImageUpload}
              className="bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-200 gap-2 backdrop-blur-sm text-sm font-geist-mono"
            >
              <Plus className="w-4 h-4" />
              <Imag className="w-4 h-4" />
              Image
            </Button>
          </motion.div>
          <motion.div variants={buttonVariants}>
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 transition-all duration-200 gap-2 backdrop-blur-sm text-sm font-geist-mono"
            >
              <Plus className="w-4 h-4" />
              More
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Create Course Button */}
        <motion.div
          variants={buttonVariants}
          className="relative"
        >
          <motion.button
            type="submit"
            className={cn(
              "relative px-8 py-3 rounded-xl font-medium text-black",
              "bg-white hover:bg-white/90",
              "transition-all duration-300 group overflow-hidden",
              "shadow-lg hover:shadow-xl",
              "active:scale-[0.98] w-full sm:w-auto font-geist-mono"
            )}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onSubmit}
          >
            {/* Button content */}
            <div className="relative flex items-center justify-center gap-2">
              {
                uploading ?
                  "creating course" :
                  <span className="font-medium">
                    Create Course
                  </span>
              }
              {
                uploading ?
                  <Loader className='animate-spin'/> :
                  <motion.div
                    className="flex items-center"
                    animate={{
                      x: [0, 3, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
              }
            </div>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
