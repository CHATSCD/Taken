import { prisma } from './db'
import { v4 as uuidv4 } from 'uuid'

export async function generateDueReminders(): Promise<void> {
  const now = new Date()
  const currentDay = now.getDay()
  const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const schedules = await prisma.schedule.findMany({
    where: { active: true },
  })

  for (const schedule of schedules) {
    let days: number[]
    try {
      days = JSON.parse(schedule.daysOfWeek)
    } catch {
      continue
    }

    if (!days.includes(currentDay)) continue
    if (schedule.scheduledTime !== currentHHMM) continue

    // Build the exact scheduledAt datetime for this slot
    const scheduledAt = new Date(now)
    scheduledAt.setSeconds(0, 0)

    // Check if reminder already exists for this schedule+time (within this minute)
    const windowStart = new Date(scheduledAt.getTime() - 30000)
    const windowEnd = new Date(scheduledAt.getTime() + 30000)

    const existing = await prisma.reminder.findFirst({
      where: {
        scheduleId: schedule.id,
        scheduledAt: { gte: windowStart, lte: windowEnd },
      },
    })

    if (!existing) {
      await prisma.reminder.create({
        data: {
          scheduleId: schedule.id,
          token: uuidv4(),
          scheduledAt,
          status: 'pending',
        },
      })
    }
  }
}

export async function markMissedReminders(): Promise<void> {
  const cutoff = new Date(Date.now() - 60 * 60 * 1000)

  await prisma.reminder.updateMany({
    where: {
      status: { in: ['pending', 'sent'] },
      scheduledAt: { lt: cutoff },
    },
    data: { status: 'missed' },
  })
}
