import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const schedules = await prisma.schedule.findMany({
    include: { patient: true, medication: true },
    orderBy: { scheduledTime: 'asc' },
  })
  return NextResponse.json(schedules)
}

export async function POST(req: NextRequest) {
  const { patientId, medicationId, scheduledTime, daysOfWeek } = await req.json()
  if (!patientId || !medicationId || !scheduledTime) {
    return NextResponse.json({ error: 'patientId, medicationId, and scheduledTime are required' }, { status: 400 })
  }
  const schedule = await prisma.schedule.create({
    data: {
      patientId: Number(patientId),
      medicationId: Number(medicationId),
      scheduledTime,
      daysOfWeek: JSON.stringify(daysOfWeek || [0, 1, 2, 3, 4, 5, 6]),
    },
    include: { patient: true, medication: true },
  })
  return NextResponse.json(schedule, { status: 201 })
}
