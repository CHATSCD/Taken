import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const reminders = await prisma.reminder.findMany({
    include: {
      schedule: { include: { patient: true, medication: true } },
      confirmation: true,
    },
    orderBy: { scheduledAt: 'desc' },
    take: 100,
  })
  return NextResponse.json(reminders)
}
