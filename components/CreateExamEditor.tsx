import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { 
  Plus,
  Trash2,
  GripVertical,
  FileText,
  CheckCircle,
  Circle,
  Square,
  ToggleLeft,
  Settings,
  Save,
  Eye,
  ArrowLeft,
  Brain,
  Clock,
  Users,
  Target,
  ChevronDown,
  ChevronRight,
  Edit3,
  MoreVertical
} from 'lucide-react';
import FloatingParticle from './FloatingParticle';

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}

interface ExamSection {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  isExpanded: boolean;
}

const questionTypes = [
  { id: 'multiple-choice', label: 'Multiple Choice', icon: Circle, description: 'Select one correct answer' },
  { id: 'true-false', label: 'True/False', icon: ToggleLeft, description: 'Yes or No questions' },
  { id: 'short-answer', label: 'Short Answer', icon: Edit3, description: 'Brief text response' },
  { id: 'essay', label: 'Essay', icon: FileText, description: 'Long form response' },
];

export const CreateExamEditor: React.FC = () => {
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);
  const [sections, setSections] = useState<ExamSection[]>([
    {
      id: '1',
      title: 'Section 1: Fundamentals',
      description: 'Basic concepts and definitions',
      questions: [],
      isExpanded: true
    }
  ]);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('multiple-choice');

  const addSection = () => {
    const newSection: ExamSection = {
      id: Date.now().toString(),
      title: `Section ${sections.length + 1}`,
      description: 'New section description',
      questions: [],
      isExpanded: true
    };
    setSections([...sections, newSection]);
  };

  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: selectedQuestionType as Question['type'],
      question: '',
      options: selectedQuestionType === 'multiple-choice' ? ['', '', '', ''] : undefined,
      points: 1
    };

    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, questions: [...section.questions, newQuestion] }
        : section
    ));
  };

  const updateQuestion = (sectionId: string, questionId: string, updates: Partial<Question>) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            questions: section.questions.map(q => 
              q.id === questionId ? { ...q, ...updates } : q
            )
          }
        : section
    ));
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, questions: section.questions.filter(q => q.id !== questionId) }
        : section
    ));
  };

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  const totalQuestions = sections.reduce((total, section) => total + section.questions.length, 0);
  const totalPoints = sections.reduce((total, section) => 
    total + section.questions.reduce((sectionTotal, q) => sectionTotal + q.points, 0), 0
  );

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      
      <FloatingParticle />

      {/* Large background glow */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <motion.button
                  className="flex items-center text-white/60 hover:text-white group transition-all duration-300"
                  whileHover={{ x: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="font-geist-mono text-sm">Back to exams</span>
                </motion.button>
                
                <div className="h-6 w-px bg-white/20" />
                
                <span className="px-3 py-1 text-xs font-geist-mono text-white bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  Exam Builder
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 font-geist-mono text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </motion.button>
                <motion.button
                  className="flex items-center space-x-2 px-6 py-2 bg-white text-black rounded-xl font-geist-mono font-medium hover:bg-white/90 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Exam</span>
                </motion.button>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-syne font-medium text-white mb-4 tracking-tight">
              Create New Exam
            </h1>
            <p className="text-lg text-white/60 font-geist-mono">
              Build comprehensive assessments with AI-powered question generation and smart analytics.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Exam Details */}
              <motion.div
                className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <motion.div 
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400/20 to-cyan-400/20 border border-white/10 flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Brain className="w-5 h-5 text-blue-400" />
                  </motion.div>
                  <h2 className="text-xl font-syne font-medium text-white">Exam Details</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-geist-mono text-white/70 mb-2">Exam Title</label>
                    <input
                      type="text"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                      placeholder="Enter exam title..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-geist-mono text-white/70 mb-2">Description</label>
                    <textarea
                      value={examDescription}
                      onChange={(e) => setExamDescription(e.target.value)}
                      placeholder="Describe what this exam covers..."
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-geist-mono text-white/70 mb-2">Time Limit (minutes)</label>
                      <input
                        type="number"
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-geist-mono text-white/70 mb-2">Difficulty Level</label>
                      <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Question Type Selector */}
              <motion.div
                className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-lg font-syne font-medium text-white mb-6">Question Types</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {questionTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => setSelectedQuestionType(type.id)}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-300 text-left",
                        selectedQuestionType === type.id
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <type.icon className="w-5 h-5 mb-2" />
                      <h4 className="font-geist-mono font-medium text-sm mb-1">{type.label}</h4>
                      <p className="text-xs text-white/50">{type.description}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Sections */}
              <div className="space-y-6">
                <AnimatePresence>
                  {sections.map((section, sectionIndex) => (
                    <motion.div
                      key={section.id}
                      className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6, delay: 0.3 + sectionIndex * 0.1 }}
                    >
                      {/* Section Header */}
                      <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => toggleSection(section.id)}
                              className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                            >
                              {section.isExpanded ? (
                                <ChevronDown className="w-5 h-5" />
                              ) : (
                                <ChevronRight className="w-5 h-5" />
                              )}
                            </button>
                            <div>
                              <input
                                type="text"
                                value={section.title}
                                onChange={(e) => {
                                  const newSections = [...sections];
                                  newSections[sectionIndex].title = e.target.value;
                                  setSections(newSections);
                                }}
                                className="text-lg font-syne font-medium text-white bg-transparent border-none outline-none focus:bg-white/5 rounded px-2 py-1 transition-all duration-200"
                              />
                              <p className="text-white/50 font-geist-mono text-sm">
                                {section.questions.length} questions
                              </p>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => addQuestion(section.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 font-geist-mono text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add Question</span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Section Content */}
                      <AnimatePresence>
                        {section.isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="p-6 space-y-6">
                              {section.questions.length === 0 ? (
                                <div className="text-center py-12">
                                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-white/40" />
                                  </div>
                                  <p className="text-white/50 font-geist-mono">No questions yet. Add your first question to get started.</p>
                                </div>
                              ) : (
                                section.questions.map((question, questionIndex) => (
                                  <QuestionEditor
                                    key={question.id}
                                    question={question}
                                    questionIndex={questionIndex}
                                    onUpdate={(updates) => updateQuestion(section.id, question.id, updates)}
                                    onDelete={() => deleteQuestion(section.id, question.id)}
                                  />
                                ))
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Add Section Button */}
                <motion.button
                  onClick={addSection}
                  className="w-full p-6 border-2 border-dashed border-white/20 rounded-2xl text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300 flex items-center justify-center space-x-2 font-geist-mono"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New Section</span>
                </motion.button>
              </div>
            </div>

            {/* Sidebar */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="sticky top-8 space-y-6">
                {/* Exam Stats */}
                <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-syne font-medium text-white mb-6">Exam Overview</h3>
                  <div className="space-y-4">
                    {[
                      { icon: FileText, label: 'Questions', value: totalQuestions },
                      { icon: Target, label: 'Total Points', value: totalPoints },
                      { icon: Clock, label: 'Time Limit', value: `${timeLimit}m` },
                      { icon: Users, label: 'Sections', value: sections.length },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      >
                        <div className="flex items-center space-x-3">
                          <stat.icon className="w-4 h-4 text-white/60" />
                          <span className="font-geist-mono text-sm text-white/70">{stat.label}</span>
                        </div>
                        <span className="font-geist-mono font-medium text-white">{stat.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* AI Assistant */}
                <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <motion.div 
                      className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400/20 to-pink-400/20 border border-white/10 flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Brain className="w-4 h-4 text-purple-400" />
                    </motion.div>
                    <h3 className="font-syne font-medium text-white">AI Assistant</h3>
                  </div>
                  <p className="text-white/60 font-geist-mono text-sm mb-4">
                    Get AI-powered suggestions for questions and improvements.
                  </p>
                  <motion.button
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-400/20 to-pink-400/20 border border-white/10 rounded-xl text-white hover:bg-gradient-to-r hover:from-purple-400/30 hover:to-pink-400/30 transition-all duration-300 font-geist-mono text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Generate Questions
                  </motion.button>
                </div>

                {/* Settings */}
                <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Settings className="w-5 h-5 text-white/60" />
                    <h3 className="font-syne font-medium text-white">Settings</h3>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="font-geist-mono text-sm text-white/70">Shuffle Questions</span>
                      <input type="checkbox" className="rounded" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="font-geist-mono text-sm text-white/70">Show Results</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="font-geist-mono text-sm text-white/70">Allow Retakes</span>
                      <input type="checkbox" className="rounded" />
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Question Editor Component
interface QuestionEditorProps {
  question: Question;
  questionIndex: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ 
  question, 
  questionIndex, 
  onUpdate, 
  onDelete 
}) => {
  return (
    <motion.div
      className="bg-white/5 border border-white/10 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center">
            <span className="font-geist-mono text-sm font-medium text-white">{questionIndex + 1}</span>
          </div>
          <div>
            <span className="font-geist-mono text-sm text-white/70 capitalize">
              {question.type.replace('-', ' ')}
            </span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-white/50">Points:</span>
              <input
                type="number"
                value={question.points}
                onChange={(e) => onUpdate({ points: Number(e.target.value) })}
                className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs font-geist-mono"
                min="1"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200">
            <GripVertical className="w-4 h-4" />
          </button>
          <button className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200">
            <MoreVertical className="w-4 h-4" />
          </button>
          <button 
            onClick={onDelete}
            className="p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-geist-mono text-white/70 mb-2">Question</label>
          <textarea
            value={question.question}
            onChange={(e) => onUpdate({ question: e.target.value })}
            placeholder="Enter your question..."
            rows={2}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono resize-none"
          />
        </div>

        {question.type === 'multiple-choice' && (
          <div>
            <label className="block text-sm font-geist-mono text-white/70 mb-2">Options</label>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={question.correctAnswer === index}
                    onChange={() => onUpdate({ correctAnswer: index })}
                    className="text-blue-400"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.options || [])];
                      newOptions[index] = e.target.value;
                      onUpdate({ options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-white/20 focus:outline-none transition-all duration-200 font-geist-mono text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {question.type === 'true-false' && (
          <div>
            <label className="block text-sm font-geist-mono text-white/70 mb-2">Correct Answer</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={question.correctAnswer === 'true'}
                  onChange={() => onUpdate({ correctAnswer: 'true' })}
                  className="text-blue-400"
                />
                <span className="font-geist-mono text-sm text-white">True</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={question.correctAnswer === 'false'}
                  onChange={() => onUpdate({ correctAnswer: 'false' })}
                  className="text-blue-400"
                />
                <span className="font-geist-mono text-sm text-white">False</span>
              </label>
            </div>
          </div>
        )}

        {(question.type === 'short-answer' || question.type === 'essay') && (
          <div>
            <label className="block text-sm font-geist-mono text-white/70 mb-2">
              {question.type === 'essay' ? 'Expected Answer/Rubric' : 'Correct Answer'}
            </label>
            <textarea
              value={question.correctAnswer as string || ''}
              onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
              placeholder={question.type === 'essay' ? 'Describe the expected answer or grading rubric...' : 'Enter the correct answer...'}
              rows={question.type === 'essay' ? 4 : 2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 font-geist-mono resize-none"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};