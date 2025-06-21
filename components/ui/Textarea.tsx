import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => {
  const baseClasses = 'w-full rounded-xl border border-white/10 px-4 py-3 text-base placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono bg-white/5 text-white backdrop-blur-sm';
  
  return (
    <textarea 
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
};