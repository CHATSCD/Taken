interface ReminderCardProps {
  patientName: string
  medicationName: string
  medicationDescription?: string | null
  scheduledAt: string
}

export default function ReminderCard({ patientName, medicationName, medicationDescription, scheduledAt }: ReminderCardProps) {
  const time = new Date(scheduledAt).toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white text-2xl">
          💊
        </div>
        <div>
          <p className="text-sm text-sky-700 font-medium">Medication Reminder</p>
          <p className="text-xs text-sky-500">Please confirm you have taken your medication</p>
        </div>
      </div>
      <dl className="space-y-2">
        <div className="flex justify-between">
          <dt className="text-sm font-medium text-gray-500">Patient</dt>
          <dd className="text-sm font-semibold text-gray-900">{patientName}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-sm font-medium text-gray-500">Medication</dt>
          <dd className="text-sm font-semibold text-gray-900">{medicationName}</dd>
        </div>
        {medicationDescription && (
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="text-sm text-gray-700">{medicationDescription}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-sm font-medium text-gray-500">Scheduled</dt>
          <dd className="text-sm text-gray-700">{time}</dd>
        </div>
      </dl>
    </div>
  )
}
