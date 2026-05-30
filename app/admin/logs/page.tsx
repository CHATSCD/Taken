import { prisma } from '@/lib/db'
import Badge from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

export default async function LogsPage() {
  const confirmations = await prisma.confirmation.findMany({
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      reminder: {
        include: { schedule: { include: { patient: true, medication: true } } },
      },
    },
  })

  const reminders = await prisma.reminder.findMany({
    orderBy: { scheduledAt: 'desc' },
    take: 100,
    where: { status: { in: ['pending', 'sent', 'missed'] } },
    include: { schedule: { include: { patient: true, medication: true } }, confirmation: true },
  })

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-gray-800">Confirmations ({confirmations.length})</h2>
        </div>
        {confirmations.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">No confirmations yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Patient</th>
                  <th className="px-6 py-3 text-left">Medication</th>
                  <th className="px-6 py-3 text-left">Scheduled</th>
                  <th className="px-6 py-3 text-left">Confirmed At</th>
                  <th className="px-6 py-3 text-left">Initials</th>
                  <th className="px-6 py-3 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {confirmations.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{c.reminder.schedule.patient.name}</td>
                    <td className="px-6 py-4 text-gray-700">{c.reminder.schedule.medication.name}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(c.reminder.scheduledAt).toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-700">{new Date(c.confirmedAt).toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-sky-700">{c.initials}</td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{c.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold text-gray-800">Pending / Missed Reminders</h2>
        </div>
        {reminders.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">No active reminders.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Patient</th>
                  <th className="px-6 py-3 text-left">Medication</th>
                  <th className="px-6 py-3 text-left">Scheduled At</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reminders.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{r.schedule.patient.name}</td>
                    <td className="px-6 py-4 text-gray-700">{r.schedule.medication.name}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(r.scheduledAt).toLocaleString()}</td>
                    <td className="px-6 py-4"><Badge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
