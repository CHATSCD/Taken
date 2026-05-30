import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const confirmations = await prisma.confirmation.findMany({
    include: {
      reminder: {
        include: {
          schedule: { include: { patient: true, medication: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
  return NextResponse.json(confirmations)
}
