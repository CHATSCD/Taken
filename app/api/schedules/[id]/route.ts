import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { scheduledTime, daysOfWeek, active } = await req.json()
  const schedule = await prisma.schedule.update({
    where: { id: Number(id) },
    data: {
      ...(scheduledTime && { scheduledTime }),
      ...(daysOfWeek && { daysOfWeek: JSON.stringify(daysOfWeek) }),
      ...(active !== undefined && { active }),
    },
    include: { patient: true, medication: true },
  })
  return NextResponse.json(schedule)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.schedule.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
