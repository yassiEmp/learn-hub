import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface ExamData {
  id: string;
  title: string;
  exercises: any[];
  created_at: string;
  updated_at: string;
  course_id: string;
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
  } | null;
  totalQuestions: number;
  estimatedDuration: number;
}

interface UseExamsResult {
  exams: ExamData[];
  loading: boolean;
  error: string | null;
}

export function useExams(): UseExamsResult {
  const [exams, setExams] = useState<ExamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, session } = useAuth();

  useEffect(() => {
    if (!user || !session) {
      setLoading(false);
      return;
    }

    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/v1/exams', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch exams: ${response.statusText}`);
        }

        const data = await response.json();
        setExams(data.data.exams || []);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError(err instanceof Error ? err.message : 'Failed to load exams');
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [user, session]);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    exams,
    loading,
    error
  }), [exams, loading, error]);
}
