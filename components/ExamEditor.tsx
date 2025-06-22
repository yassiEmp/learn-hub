import React, { useState } from 'react';
// import { cn } from '../lib/utils';
import FloatingParticle from './FloatingParticle';
import { ExamHeader } from './exam-editor/ExamHeader';
// import { ExamDetailsSection } from './exam-editor/ExamDetailsSection';
// import { ExamOverviewSidebar } from './exam-editor/ExamOverviewSidebar';
// import { ExamQuestionSections } from './exam-editor/ExamQuestionSections';
import { AIChatPanel } from './exam-editor/AIChatPanel';
import { ChatMessage } from './exam-editor/types';

export const ExamEditor: React.FC = () => {
  // const [examTitle, setExamTitle] = useState('');
  // const [examDescription, setExamDescription] = useState('');
  // const [timeLimit, setTimeLimit] = useState(60);
  // const [sections, setSections] = useState<ExamSectionType[]>([
  //   {
  //     id: '1',
  //     title: 'Section 1: Fundamentals',
  //     description: 'Basic concepts and definitions',
  //     questions: [],
  //     isExpanded: true
  //   }
  // ]);
  // const [selectedQuestionType, setSelectedQuestionType] = useState<string>('multiple-choice');
  
  // AI Chat states
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. I can help you create better exam questions, suggest improvements, and provide insights about your exam structure. What would you like to work on?',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Settings state
  // const [settings, setSettings] = useState({
  //   shuffleQuestions: false,
  //   showResults: true,
  //   allowRetakes: false
  // });

  // const addSection = () => {
  //   const newSection: ExamSectionType = {
  //     id: Date.now().toString(),
  //     title: `Section ${sections.length + 1}`,
  //     description: 'New section description',
  //     questions: [],
  //     isExpanded: true
  //   };
  //   setSections([...sections, newSection]);
  // };

  // const addQuestion = (sectionId: string) => {
  //   const newQuestion: Question = {
  //     id: Date.now().toString(),
  //     type: selectedQuestionType as Question['type'],
  //     question: '',
  //     options: selectedQuestionType === 'multiple-choice' ? ['', '', '', ''] : undefined,
  //     points: 1
  //   };

  //   setSections(sections.map(section => 
  //     section.id === sectionId 
  //       ? { ...section, questions: [...section.questions, newQuestion] }
  //       : section
  //   ));
  // };

  // const updateQuestion = (sectionId: string, questionId: string, updates: Partial<Question>) => {
  //   setSections(sections.map(section => 
  //     section.id === sectionId 
  //       ? {
  //           ...section,
  //           questions: section.questions.map(q => 
  //             q.id === questionId ? { ...q, ...updates } : q
  //           )
  //         }
  //       : section
  //   ));
  // };

  // const deleteQuestion = (sectionId: string, questionId: string) => {
  //   setSections(sections.map(section => 
  //     section.id === sectionId 
  //       ? { ...section, questions: section.questions.filter(q => q.id !== questionId) }
  //       : section
  //   ));
  // };

  // const toggleSection = (sectionId: string) => {
  //   setSections(sections.map(section => 
  //     section.id === sectionId 
  //       ? { ...section, isExpanded: !section.isExpanded }
  //       : section
  //   ));
  // };

  // const updateSectionTitle = (sectionId: string, title: string) => {
  //   setSections(sections.map(section =>
  //     section.id === sectionId ? { ...section, title } : section
  //   ));
  // };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(newMessage),
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (message: string): string => {
    const responses = [
      "I can help you create multiple choice questions for that topic. Would you like me to suggest some options?",
      "That's a great question type for this subject. Consider adding some scenario-based questions to test practical application.",
      "For better assessment, try mixing different question types. I can generate some true/false questions to complement your multiple choice ones.",
      "I notice your exam could benefit from more higher-order thinking questions. Would you like me to suggest some analysis or synthesis questions?",
      "The difficulty level seems appropriate. Consider adding a few challenging questions to differentiate top performers."
    ];
    console.log(message)
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // const totalQuestions = sections.reduce((total, section) => total + section.questions.length, 0);
  // const totalPoints = sections.reduce((total, section) => 
  //   total + section.questions.reduce((sectionTotal, q) => sectionTotal + q.points, 0), 0
  // );

  // const handleSettingChange = (setting: string, value: boolean) => {
  //   setSettings(prev => ({ ...prev, [setting]: value }));
  // };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      
      <FloatingParticle />

      {/* Large background glow */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 pt-24 pb-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <ExamHeader
            onBack={() => {}}
            onPreview={() => {}}
            onSave={() => {}}
          />

          {/* Responsive Grid Layout */}
          <div className='w-full h-full flex justify-between'>
            
          <AIChatPanel
              isChatOpen={isChatOpen}
              isChatMinimized={isChatMinimized}
              chatMessages={chatMessages}
              newMessage={newMessage}
              isTyping={isTyping}
              onToggleChat={() => setIsChatOpen(!isChatOpen)}
              onMinimizeChat={() => setIsChatMinimized(!isChatMinimized)}
              onCloseChat={() => setIsChatOpen(false)}
              onNewMessageChange={setNewMessage}
              onSendMessage={sendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

