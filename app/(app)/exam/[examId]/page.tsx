"use client"
import { ExamComponant } from '@/components/ExamComponant'
import Nav from '@/components/hearderApp'
import BGglow from '@/components/bg-glow'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

const fetchExam = async (examId: string) => {
  const res = await fetch(`/api/v1/exam/${examId}`)
  if (!res.ok) throw new Error('Failed to fetch exam')
  return res.json()
}

const Page = () => {
  const params = useParams()
  const examId = params.examId as string
  
  const { data: exam, isLoading, error } = useQuery({
    queryKey: ['exam', examId],
    queryFn: () => fetchExam(examId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (isLoading) return <div className="text-center mt-24">Loading exam...</div>
  if (error) return <div className="text-center mt-24 text-red-500">Failed to load exam.</div>

  return (
    <section className='pt-24'>
      <Nav currentPath="/exam" />
      <BGglow />
      <ExamComponant Exam={exam} />
    </section>
  )
}

export default Page