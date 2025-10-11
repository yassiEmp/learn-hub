"use client"
import { ExamComponant } from '@/components/ExamComponant'
import Nav from '@/components/hearderApp'
import BGglow from '@/components/bg-glow'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const fetchExam = async (examId: string, accessToken: string) => {
  const res = await fetch(`/api/v1/exam/${examId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
  if (!res.ok) throw new Error('Failed to fetch exam')
  const data = await res.json()
  
  // Transform the database response to match the Exam type expected by ExamComponant
  return {
    id: data.data.id,
    title: data.data.title,
    exercises: data.data.exercises,
    mode: 'Exercice' as const, // Default mode for generated exams
    courseId: data.data.course_id // Include course ID for navigation
  }
}

const Page = () => {
  const params = useParams()
  const examId = params.examId as string
  const { session } = useAuth()
  
  const { data: exam, isLoading, error } = useQuery({
    queryKey: ['exam', examId],
    queryFn: () => fetchExam(examId, session?.access_token || ''),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!session?.access_token
  })

  if (isLoading) return <div className="text-center mt-24">Loading exam...</div>
  if (error) return <div className="text-center mt-24 text-red-500">Failed to load exam.</div>
  if (!exam) return <div className="text-center mt-24 text-red-500">Exam not found.</div>

  return (
    <section className='pt-24'>
      <Nav currentPath="/exam" />
      <BGglow />
      <ExamComponant Exam={exam} />
    </section>
  )
}

export default Page