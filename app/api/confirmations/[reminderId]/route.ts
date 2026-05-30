import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: Promise<{ reminderId: string }> }) {
  const { reminderId } = await params
  const { initials, confirmedAt, notes } = await req.json()

  if (!initials?.trim()) return NextResponse.json({ error: 'Initials required' }, { status: 400 })
  if (!confirmedAt) return NextResponse.json({ error: 'confirmedAt required' }, { status: 400 })

  const reminder = await prisma.reminder.findUnique({ where: { id: Number(reminderId) } })
  if (!reminder) return NextResponse.json({ error: 'Reminder not found' }, { status: 404 })
  if (reminder.status === 'confirmed') return NextResponse.json({ error: 'Already confirmed' }, { status: 409 })
  if (reminder.status === 'missed') return NextResponse.json({ error: 'Reminder has expired' }, { status: 410 })

  const confirmation = await prisma.confirmation.create({
    data: {
      reminderId: Number(reminderId),
      initials: initials.trim().toUpperCase(),
      confirmedAt: new Date(confirmedAt),
      notes: notes?.trim() || null,
    },
  })

  await prisma.reminder.update({ where: { id: Number(reminderId) }, data: { status: 'confirmed' } })

  return NextResponse.json(confirmation, { status: 201 })
}
