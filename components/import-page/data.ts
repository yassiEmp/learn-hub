import { Brain, Zap, Target, Users, BookOpen, Trophy, Globe, Star } from 'lucide-react';

export const features = [
  {
    icon: Brain,
    title: 'AI-Powered Creation',
    description: 'Advanced algorithms create structured, engaging content tailored to your learning objectives.',
    gradient: 'from-purple-400/20 to-pink-400/20',
    iconColor: 'text-purple-400'
  },
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'Transform your ideas into complete courses in minutes, not hours or days.',
    gradient: 'from-yellow-400/20 to-orange-400/20',
    iconColor: 'text-yellow-400'
  },
  {
    icon: Target,
    title: 'Multi-Format Support',
    description: 'Create courses with videos, images, text, quizzes, and interactive content.',
    gradient: 'from-green-400/20 to-emerald-400/20',
    iconColor: 'text-green-400'
  }
];

export const stats = [
  { icon: Users, value: '50K+', label: 'Active Learners' },
  { icon: BookOpen, value: '1K+', label: 'Courses Created' },
  { icon: Trophy, value: '95%', label: 'Success Rate' },
  { icon: Star, value: '4.9', label: 'Average Rating' }
];

export const benefits = [
  'Personalized learning paths',
  'Real-time progress tracking',
  'Interactive assessments',
  'Community collaboration',
  'Expert mentorship',
  'Industry certifications'
];

export const successStories = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    quote: 'LearnHub transformed my career. I went from a junior developer to a senior engineer in just 8 months using their AI-powered courses.',
    achievement: 'Promoted to Senior Engineer',
    course: 'Advanced React & System Design'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Data Scientist at Microsoft',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    quote: 'The personalized learning paths helped me master machine learning concepts that seemed impossible before. Now I lead ML projects at Microsoft.',
    achievement: 'Career Switch to Data Science',
    course: 'Machine Learning Mastery'
  },
  {
    name: 'Emily Johnson',
    role: 'UX Designer at Airbnb',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    quote: 'The interactive design courses and real-world projects gave me the confidence to transition from marketing to UX design.',
    achievement: 'Complete Career Pivot',
    course: 'UX Design Fundamentals'
  }
]; 