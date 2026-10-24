"use client"
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { ExamComponant } from '@/components/ExamComponant'
import type { Exam } from '@/components/ExamComponant'
import Nav from '@/components/hearderApp'
import BGglow from '@/components/bg-glow'
import { apiFetch, errorMessage } from '@/hooks/apiFetch'

interface ExamDTO {
  id: string
  title: string
  exercises: Exam['exercises']
  course_id: string | null
}

const fetchExam = async (examId: string): Promise<Exam> => {
  const data = await apiFetch<ExamDTO | { exam: ExamDTO }>(`/api/v1/exam/${examId}`)
  const exam = 'exam' in data ? data.exam : data
  return {
    id: exam.id,
    title: exam.title,
    exercises: Array.isArray(exam.exercises) ? exam.exercises : [],
    mode: 'Exercice',
    courseId: exam.course_id ?? undefined,
  }
}

const Page = () => {
  const params = useParams()
  const examId = String(params.examId ?? '')

  const { data: exam, isPending, error, refetch } = useQuery({
    queryKey: ['exam', examId],
    queryFn: () => fetchExam(examId),
    enabled: !!examId,
  })

  return (
    <section className="pt-24 min-h-screen bg-black">
      <Nav />
      <BGglow />
      {isPending ? (
        <p className="flex items-center justify-center gap-2 mt-24 text-white/60 font-geist-mono">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading exam…
        </p>
      ) : error || !exam ? (
        <div className="text-center mt-24 space-y-4">
          <p className="text-red-400 font-geist-mono">{errorMessage(error, 'Exam not found.')}</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => refetch()} className="px-4 py-2 rounded-lg bg-white text-black text-sm font-geist-mono">
              Try again
            </button>
            <Link href="/exams" className="px-4 py-2 rounded-lg border border-white/15 text-white text-sm font-geist-mono">
              All exams
            </Link>
          </div>
        </div>
      ) : exam.exercises.length === 0 ? (
        <p className="text-center mt-24 text-white/60 font-geist-mono">This exam has no questions.</p>
      ) : (
        <ExamComponant Exam={exam} />
      )}
    </section>
  )
}

export default Page
