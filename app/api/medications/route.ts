import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const medications = await prisma.medication.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(medications)
}

export async function POST(req: NextRequest) {
  const { name, description } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const medication = await prisma.medication.create({ data: { name: name.trim(), description: description?.trim() || null } })
  return NextResponse.json(medication, { status: 201 })
}
