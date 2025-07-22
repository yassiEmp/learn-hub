
'use client';

import React, { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import { BookOpen } from 'lucide-react';
import { motion } from "framer-motion"
const placeholderPhrases = [
  'Learning Python programming from scratch',
  'Mastering digital marketing strategies',
  'Building mobile apps with React Native',
  'Understanding machine learning basics',
  'Creating stunning UI/UX designs',
];

interface CourseTextareaProps {
  value: string;
  onChange: (val: string) => void;
}

export const CourseTextarea: React.FC<CourseTextareaProps> = ({ value, onChange }) => {
  const [placeholderText, setPlaceholderText] = useState('');

  useEffect(() => {
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const typeText = () => {
      const currentPhrase = placeholderPhrases[currentPhraseIndex];

      if (!isDeleting) {
        if (currentCharIndex < currentPhrase.length) {
          setPlaceholderText(currentPhrase.slice(0, currentCharIndex + 1));
          currentCharIndex++;
          timeoutId = setTimeout(typeText, 80);
        } else {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            typeText();
          }, 1500);
        }
      } else {
        if (currentCharIndex > 0) {
          setPlaceholderText(currentPhrase.slice(0, currentCharIndex - 1));
          currentCharIndex--;
          timeoutId = setTimeout(typeText, 40);
        } else {
          isDeleting = false;
          currentPhraseIndex = (currentPhraseIndex + 1) % placeholderPhrases.length;
          timeoutId = setTimeout(typeText, 300);
        }
      }
    };

    typeText();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
  <div className='flex gap-4'>
    <motion.div
    className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:bg-white/15"
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.15 }}
    >
      <BookOpen className="w-6 h-6 text-white/90" />
    </motion.div>
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white/5 border border-white/10 rounded-xl text-white min-h-[120px] p-4"
      placeholder={`Create course for ${placeholderText}`}
    />
  </div>
  );
};
