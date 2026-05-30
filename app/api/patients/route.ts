import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const patients = await prisma.patient.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(patients)
}

export async function POST(req: NextRequest) {
  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const patient = await prisma.patient.create({ data: { name: name.trim() } })
  return NextResponse.json(patient, { status: 201 })
}
