import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { name } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const patient = await prisma.patient.update({ where: { id: Number(id) }, data: { name: name.trim() } })
  return NextResponse.json(patient)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.patient.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
