import { prisma } from '@/lib/db'
import ReminderCard from '@/components/confirm/ReminderCard'
import ConfirmationForm from '@/components/confirm/ConfirmationForm'

interface PageProps {
  params: Promise<{ token: string }>
}

async function getReminder(token: string) {
  const reminder = await prisma.reminder.findUnique({
    where: { token },
    include: {
      schedule: { include: { patient: true, medication: true } },
      confirmation: true,
    },
  })
  if (reminder?.status === 'pending') {
    await prisma.reminder.update({ where: { id: reminder.id }, data: { status: 'sent' } })
  }
  return reminder
}

export default async function ConfirmPage({ params }: PageProps) {
  const { token } = await params
  const reminder = await getReminder(token)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-12">
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-center text-2xl font-bold text-sky-700">Taken</h1>
        <p className="mb-8 text-center text-sm text-gray-500">Medication Reminder</p>

        {!reminder && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mb-3 text-4xl">❌</div>
            <h2 className="text-lg font-semibold text-red-800">Reminder Not Found</h2>
            <p className="mt-1 text-sm text-red-700">This reminder link is invalid or has been removed.</p>
          </div>
        )}

        {reminder?.status === 'confirmed' && (
          <div className="space-y-4">
            <ReminderCard
              patientName={reminder.schedule.patient.name}
              medicationName={reminder.schedule.medication.name}
              medicationDescription={reminder.schedule.medication.description}
              scheduledAt={reminder.scheduledAt.toISOString()}
            />
            <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
              <div className="mb-2 text-3xl">✅</div>
              <h2 className="font-semibold text-green-800">Already Confirmed</h2>
              <p className="mt-1 text-sm text-green-700">
                Confirmed by <strong>{reminder.confirmation?.initials}</strong> at{' '}
                {reminder.confirmation && new Date(reminder.confirmation.confirmedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {reminder?.status === 'missed' && (
          <div className="space-y-4">
            <ReminderCard
              patientName={reminder.schedule.patient.name}
              medicationName={reminder.schedule.medication.name}
              medicationDescription={reminder.schedule.medication.description}
              scheduledAt={reminder.scheduledAt.toISOString()}
            />
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 text-center">
              <div className="mb-2 text-3xl">⏰</div>
              <h2 className="font-semibold text-orange-800">Reminder Expired</h2>
              <p className="mt-1 text-sm text-orange-700">This reminder has expired. Please contact your caregiver.</p>
            </div>
          </div>
        )}

        {(reminder?.status === 'sent' || reminder?.status === 'pending') && (
          <div className="space-y-6">
            <ReminderCard
              patientName={reminder.schedule.patient.name}
              medicationName={reminder.schedule.medication.name}
              medicationDescription={reminder.schedule.medication.description}
              scheduledAt={reminder.scheduledAt.toISOString()}
            />
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-800">Confirm You Took This Medication</h2>
              <ConfirmationForm reminderId={reminder.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
