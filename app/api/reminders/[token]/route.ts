import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const reminder = await prisma.reminder.findUnique({
    where: { token },
    include: {
      schedule: { include: { patient: true, medication: true } },
      confirmation: true,
    },
  })
  if (!reminder) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Mark as "sent" (viewed) if still pending
  if (reminder.status === 'pending') {
    await prisma.reminder.update({ where: { id: reminder.id }, data: { status: 'sent' } })
  }

  return NextResponse.json(reminder)
}
