import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ className = '', ...props }) => {
  const baseClasses = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-base placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors';
  
  return (
    <textarea 
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
};