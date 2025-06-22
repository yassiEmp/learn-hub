import { Course } from '@/types/course';
import { TrendingUp, Clock, Award, BookOpen, Play, LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
type TcourseArray = {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  title: string;
  subtitle: string;
  color: string;
  iconColor: string;
}[]
export const getStats = (enrolledCourses: Course[], completedCourses: Course[], totalHours: number) => [
  {
    label: 'Courses Enrolled',
    value: enrolledCourses.length,
    icon: BookOpen,
    color: 'from-blue-400/20 to-cyan-400/20',
    iconColor: 'text-blue-400',
  },
  {
    label: 'Courses Completed',
    value: completedCourses.length,
    icon: Award,
    color: 'from-green-400/20 to-emerald-400/20',
    iconColor: 'text-green-400',
  },
  {
    label: 'Learning Hours',
    value: totalHours,
    icon: Clock,
    color: 'from-purple-400/20 to-pink-400/20',
    iconColor: 'text-purple-400',
  },
  {
    label: 'Skill Level',
    value: 'Intermediate',
    icon: TrendingUp,
    color: 'from-orange-400/20 to-red-400/20',
    iconColor: 'text-orange-400',
  },
];

export const recentActivities:TcourseArray = [
  {
    icon: Award,
    title: 'Completed "Your First Component"',
    subtitle: 'React Development Bootcamp • 2 hours ago',
    color: 'from-green-400/20 to-emerald-400/20',
    iconColor: 'text-green-400'
  },
  {
    icon: Play,
    title: 'Started "Props and State"',
    subtitle: 'React Development Bootcamp • 1 day ago',
    color: 'from-blue-400/20 to-cyan-400/20',
    iconColor: 'text-blue-400'
  },
  {
    icon: BookOpen,
    title: 'Enrolled in Python for Data Science',
    subtitle: '3 days ago',
    color: 'from-purple-400/20 to-pink-400/20',
    iconColor: 'text-purple-400'
  }
]; 