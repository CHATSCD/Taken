import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { name, description } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const med = await prisma.medication.update({ where: { id: Number(id) }, data: { name: name.trim(), description: description?.trim() || null } })
  return NextResponse.json(med)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.medication.delete({ where: { id: Number(id) } })
  return NextResponse.json({ ok: true })
}
