import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { ChevronRight, Book, FileText, List, Bold, Italic, Heading2, Code } from 'lucide-react';

interface CourseEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  courseTitle?: string;
  lessons?: Array<{
    id: string;
    title: string;
    isActive?: boolean;
  }>;
}

export const CourseEditor: React.FC<CourseEditorProps> = ({ 
  content, 
  onChange, 
  className,
  courseTitle = "Untitled Course",
  lessons = []
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className={cn("flex h-full rounded-xl overflow-hidden shadow-2xl", className)}>
      {/* Sidebar */}
      <motion.div 
        className="w-72 bg-gray-950/95 backdrop-blur-xl border-r border-gray-800"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <Book className="w-6 h-6 text-blue-400" aria-hidden="true" />
            <h2 className="text-xl font-semibold text-white">{courseTitle}</h2>
          </div>
        </div>
        
        <nav className="p-4 space-y-1" aria-label="Course lessons">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all",
                lesson.isActive 
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" 
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
              )}
              aria-current={lesson.isActive ? 'page' : undefined}
            >
              <FileText className="w-4 h-4" aria-hidden="true" />
              <span>{lesson.title}</span>
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Editor */}
      <motion.div 
        className="flex-1 bg-gray-950/95 backdrop-blur-xl border border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-1 p-2 border-b border-gray-800" role="toolbar" aria-label="Text formatting">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={cn(
              "p-2 rounded-lg hover:bg-gray-800/50 transition-colors",
              editor?.isActive('bold') ? 'bg-gray-800/50 text-blue-300' : 'text-gray-300'
            )}
            aria-label="Bold"
            aria-pressed={editor?.isActive('bold')}
          >
            <Bold className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={cn(
              "p-2 rounded-lg hover:bg-gray-800/50 transition-colors",
              editor?.isActive('italic') ? 'bg-gray-800/50 text-blue-300' : 'text-gray-300'
            )}
            aria-label="Italic"
            aria-pressed={editor?.isActive('italic')}
          >
            <Italic className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              "p-2 rounded-lg hover:bg-gray-800/50 transition-colors",
              editor?.isActive('heading', { level: 2 }) ? 'bg-gray-800/50 text-blue-300' : 'text-gray-300'
            )}
            aria-label="Heading 2"
            aria-pressed={editor?.isActive('heading', { level: 2 })}
          >
            <Heading2 className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            className={cn(
              "p-2 rounded-lg hover:bg-gray-800/50 transition-colors",
              editor?.isActive('codeBlock') ? 'bg-gray-800/50 text-blue-300' : 'text-gray-300'
            )}
            aria-label="Code block"
            aria-pressed={editor?.isActive('codeBlock')}
          >
            <Code className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        
        <div className="p-6">
          <EditorContent 
            editor={editor} 
            className="prose prose-invert max-w-none font-geist-mono 
              prose-headings:text-white prose-headings:font-semibold
              prose-p:text-white prose-p:leading-relaxed
              prose-strong:text-blue-300 prose-strong:font-semibold
              prose-code:text-blue-300 prose-code:bg-gray-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-gray-800/50 prose-pre:border prose-pre:border-gray-700
              focus:outline-none
              [&_.ProseMirror]:text-white
              [&_.ProseMirror]:min-h-[200px]
              [&_.ProseMirror]:outline-none"
          />
        </div>
      </motion.div>
    </div>
  );
}; 