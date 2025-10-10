import { NextResponse } from 'next/server'
import {sampleExam} from '@/data/exam'

export async function GET() {
  return NextResponse.json(sampleExam)
}
