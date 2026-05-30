import { prisma } from '@/lib/db'
import Badge from '@/components/ui/Badge'
import ManualReminderButton from '@/components/admin/ManualReminderButton'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [confirmedToday, pending, missed, recentConfirmations, schedules] = await Promise.all([
    prisma.confirmation.count({ where: { createdAt: { gte: today } } }),
    prisma.reminder.count({ where: { status: { in: ['pending', 'sent'] } } }),
    prisma.reminder.count({ where: { status: 'missed', scheduledAt: { gte: today } } }),
    prisma.confirmation.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        reminder: {
          include: { schedule: { include: { patient: true, medication: true } } },
        },
      },
    }),
    prisma.schedule.findMany({
      where: { active: true },
      include: { patient: true, medication: true },
      orderBy: { scheduledTime: 'asc' },
    }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Confirmed Today', value: confirmedToday, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Awaiting Response', value: pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Missed Today', value: missed, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm`}>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className={`mt-1 text-4xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <ManualReminderButton schedules={schedules} />

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-gray-800">Recent Confirmations</h2>
          <Link href="/admin/logs" className="text-sm text-sky-600 hover:text-sky-700">View all</Link>
        </div>
        {recentConfirmations.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">No confirmations yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentConfirmations.map(c => (
              <div key={c.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.reminder.schedule.patient.name}</p>
                  <p className="text-xs text-gray-500">{c.reminder.schedule.medication.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">{c.initials}</p>
                  <p className="text-xs text-gray-500">{new Date(c.confirmedAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
