import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const { scheduleId } = await req.json()
  if (!scheduleId) return NextResponse.json({ error: 'scheduleId required' }, { status: 400 })

  const schedule = await prisma.schedule.findUnique({ where: { id: Number(scheduleId) } })
  if (!schedule) return NextResponse.json({ error: 'Schedule not found' }, { status: 404 })

  const token = uuidv4()
  const reminder = await prisma.reminder.create({
    data: {
      scheduleId: Number(scheduleId),
      token,
      scheduledAt: new Date(),
      status: 'pending',
    },
  })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return NextResponse.json({ reminder, url: `${baseUrl}/confirm/${token}` }, { status: 201 })
}
