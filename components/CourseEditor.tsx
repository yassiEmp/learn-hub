import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import {
  ChevronRight,
  Book,
  Bold,
  Italic,
  Heading2,
  Code,
  Play,
  CheckCircle,
  Clock,
  ArrowLeft,
  Settings,
} from 'lucide-react';
import FloatingParticle from './FloatingParticle';
import Link from 'next/link';

interface CourseEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  courseTitle?: string;
  setCurrentLesson: (index: number) => void;
  lessons?: Array<{
    id: string;
    title: string;
    isActive?: boolean;
    isCompleted?: boolean;
    duration?: string;
  }>;
}

export const CourseEditor: React.FC<CourseEditorProps> = ({
  content,
  onChange,
  className,
  courseTitle = "Untitled Course",
  lessons = [],
  setCurrentLesson,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when the content prop changes (e.g., when switching lessons)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '', false);
    }
  }, [content, editor]);

  const activeLesson = lessons.find(lesson => lesson.isActive);
  const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />


      <div className='w-full h-full absolute top-0 left-0 overflow-hidden'>
        <FloatingParticle />
      </div>

      <div className={cn("relative z-10 flex h-screen", className)}>
        {/* Header */}
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href={"/courses"}
                >
                  <motion.button
                    className="flex items-center text-white/60 hover:text-white group transition-all duration-300"
                    whileHover={{ x: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    <span className="font-geist-mono text-sm">Back to course</span>
                  </motion.button>
                </Link>

                <div className="h-6 w-px bg-white/20" />

                <div>
                  <h1 className="text-lg font-syne font-medium text-white">{courseTitle}</h1>
                  {activeLesson && (
                    <p className="text-white/60 font-geist-mono text-sm">{activeLesson.title}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-white/50 font-geist-mono text-sm">
                  {completedLessons} of {lessons.length} completed
                </div>
                <motion.button
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          className={cn(
            "bg-black/40 backdrop-blur-md border-r border-white/10 transition-all duration-300 mt-20",
            sidebarCollapsed ? "w-16" : "w-80"
          )}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {!sidebarCollapsed && (
            <>
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 border border-white/10 flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Book className="w-5 h-5 text-blue-400" />
                    </motion.div>
                    <div>
                      <h2 className="text-white font-syne font-medium">Lessons</h2>
                      <p className="text-white/50 font-geist-mono text-xs">
                        {completedLessons}/{lessons.length} completed
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedLessons / lessons.length) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>

              <nav className="p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
                {lessons.map((lesson, index) => (
                  <motion.button
                    key={lesson.id}
                    className={cn(
                      "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 group",
                      lesson.isActive
                        ? "bg-white/10 text-white border border-white/20 shadow-lg"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                    onClick={() => { setCurrentLesson(index) }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex-shrink-0">
                      {lesson.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : lesson.isActive ? (
                        <Play className="w-5 h-5 text-blue-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center">
                          <span className="text-xs font-medium">{index + 1}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-geist-mono font-medium">{lesson.title}</p>
                      {lesson.duration && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className="w-3 h-3 text-white/40" />
                          <span className="text-xs text-white/40">{lesson.duration}</span>
                        </div>
                      )}
                    </div>
                    {lesson.isActive && (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-blue-400"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                ))}
              </nav>
            </>
          )}

          {sidebarCollapsed && (
            <div className="p-4">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Editor */}
        <motion.div
          className="flex-1 bg-black/20 backdrop-blur-sm mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-md">
            <div className="flex items-center space-x-1">
              {[
                { icon: Bold, action: () => editor?.chain().focus().toggleBold().run(), isActive: () => editor?.isActive('bold'), label: 'Bold' },
                { icon: Italic, action: () => editor?.chain().focus().toggleItalic().run(), isActive: () => editor?.isActive('italic'), label: 'Italic' },
                { icon: Heading2, action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor?.isActive('heading', { level: 2 }), label: 'Heading' },
                { icon: Code, action: () => editor?.chain().focus().toggleCodeBlock().run(), isActive: () => editor?.isActive('codeBlock'), label: 'Code' },
              ].map((tool, index) => (
                <motion.button
                  key={index}
                  onClick={tool.action}
                  className={cn(
                    "p-2 rounded-lg transition-all duration-200",
                    tool.isActive()
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={tool.label}
                >
                  <tool.icon className="w-4 h-4" />
                </motion.button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-white/50 font-geist-mono text-sm">Auto-saved</span>
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
          </div>

          {/* Editor Content */}
          <div className="p-8 h-full overflow-y-auto scrollbar-hide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <EditorContent
                editor={editor}
                className="prose prose-invert max-w-none font-geist-mono 
                  prose-headings:text-white prose-headings:font-syne prose-headings:font-medium
                  prose-p:text-white/90 prose-p:leading-relaxed prose-p:text-base
                  prose-strong:text-blue-300 prose-strong:font-semibold
                  prose-code:text-cyan-300 prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:border prose-code:border-white/10
                  prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-4
                  prose-blockquote:border-l-blue-400 prose-blockquote:bg-blue-400/5 prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
                  prose-ul:text-white/90 prose-ol:text-white/90
                  prose-li:text-white/90 prose-li:marker:text-white/60
                  focus:outline-none
                  [&_.ProseMirror]:text-white/90
                  [&_.ProseMirror]:min-h-[400px]
                  [&_.ProseMirror]:outline-none
                  [&_.ProseMirror]:leading-relaxed
                  [&_.ProseMirror_h1]:text-2xl
                  [&_.ProseMirror_h2]:text-xl
                  [&_.ProseMirror_h3]:text-lg
                  [&_.ProseMirror_p]:mb-4
                  [&_.ProseMirror_ul]:mb-4
                  [&_.ProseMirror_ol]:mb-4"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};