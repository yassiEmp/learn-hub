import { Course } from '../types/course';

export const courses: Course[] = [
  {
    id: '1',
    owner_id: 'mock-user-1',
    title: 'Complete React Development Bootcamp',
    description: 'Master React from basics to advanced concepts including hooks, context, routing, and state management. Build real-world projects and deploy them to production.',
    instructor: 'Sarah Johnson',
    instructorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    thumbnail: '', // Empty thumbnail
    duration: '12 hours',
    lessonsCount: 24,
    studentsCount: 3420,
    rating: 4.8,
    price: 89,
    originalPrice: 129,
    category: 'Web Development',
    level: 'Intermediate',
    tags: ['React', 'JavaScript', 'Frontend'],
    lessons: [
      { id: '1-1', title: 'Introduction to React', duration: '15:30', videoUrl: '#', isCompleted: true },
      { id: '1-2', title: 'Setting Up Your Environment', duration: '12:45', videoUrl: '#', isCompleted: true },
      { id: '1-3', title: 'Your First Component', duration: '18:20', videoUrl: '#', isCurrent: true },
      { id: '1-4', title: 'Props and State', duration: '22:15', videoUrl: '#' },
      { id: '1-5', title: 'Event Handling', duration: '16:40', videoUrl: '#' },
    ],
    isEnrolled: true,
    progress: 35
  },
  {
    id: '2',
    owner_id: 'mock-user-2',
    title: 'Python for Data Science',
    description: 'Learn Python programming specifically for data science applications. Cover pandas, numpy, matplotlib, and machine learning basics.',
    instructor: 'Dr. Michael Chen',
    instructorAvatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    thumbnail: '', // Empty thumbnail
    duration: '16 hours',
    lessonsCount: 32,
    studentsCount: 2890,
    rating: 4.9,
    price: 79,
    originalPrice: 119,
    category: 'Data Science',
    level: 'Beginner',
    tags: ['Python', 'Data Science', 'Machine Learning'],
    lessons: [
      { id: '2-1', title: 'Python Basics for Data Science', duration: '20:15', videoUrl: '#' },
      { id: '2-2', title: 'Working with Pandas', duration: '25:30', videoUrl: '#' },
      { id: '2-3', title: 'Data Visualization', duration: '18:45', videoUrl: '#' },
    ],
    isEnrolled: true,
    progress: 0
  },
  {
    id: '3',
    owner_id: 'mock-user-3',
    title: 'UI/UX Design Fundamentals',
    description: 'Master the principles of user interface and user experience design. Learn design thinking, prototyping, and create stunning digital experiences.',
    instructor: 'Emma Rodriguez',
    instructorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    thumbnail: '', // Empty thumbnail
    duration: '10 hours',
    lessonsCount: 20,
    studentsCount: 1560,
    rating: 4.7,
    price: 69,
    category: 'Design',
    level: 'Beginner',
    tags: ['UI Design', 'UX Design', 'Prototyping'],
    lessons: [
      { id: '3-1', title: 'Design Thinking Process', duration: '22:30', videoUrl: '#' },
      { id: '3-2', title: 'User Research Methods', duration: '19:15', videoUrl: '#' },
    ]
  },
  {
    id: '4',
    owner_id: 'mock-user-4',
    title: 'Advanced JavaScript & Node.js',
    description: 'Deep dive into advanced JavaScript concepts and server-side development with Node.js. Build scalable backend applications.',
    instructor: 'Alex Thompson',
    instructorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    thumbnail: '', // Empty thumbnail
    duration: '18 hours',
    lessonsCount: 36,
    studentsCount: 4120,
    rating: 4.8,
    price: 99,
    originalPrice: 149,
    category: 'Web Development',
    level: 'Advanced',
    tags: ['JavaScript', 'Node.js', 'Backend'],
    lessons: [
      { id: '4-1', title: 'Advanced JavaScript Concepts', duration: '28:20', videoUrl: '#' },
      { id: '4-2', title: 'Asynchronous Programming', duration: '24:15', videoUrl: '#' },
    ]
  }
];

export const categories = ['All', 'Web Development', 'Data Science', 'Design', 'Mobile Development', 'DevOps'];