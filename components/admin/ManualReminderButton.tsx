'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'

interface Schedule {
  id: number
  scheduledTime: string
  patient: { name: string }
  medication: { name: string }
}

interface Props {
  schedules: Schedule[]
}

export default function ManualReminderButton({ schedules }: Props) {
  const [scheduleId, setScheduleId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ url: string } | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleSend() {
    if (!scheduleId) { setError('Please select a schedule.'); return }
    setLoading(true)
    setError('')
    setResult(null)

    const res = await fetch('/api/reminders/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduleId: Number(scheduleId) }),
    })

    setLoading(false)
    if (res.ok) {
      const data = await res.json()
      setResult(data)
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to send reminder.')
    }
  }

  function handleCopy() {
    if (result?.url) {
      navigator.clipboard.writeText(result.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-800">Send Manual Reminder</h2>
      <div className="flex gap-3">
        <select
          value={scheduleId}
          onChange={e => setScheduleId(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        >
          <option value="">Select a schedule...</option>
          {schedules.map(s => (
            <option key={s.id} value={s.id}>
              {s.patient.name} — {s.medication.name} at {s.scheduledTime}
            </option>
          ))}
        </select>
        <Button onClick={handleSend} loading={loading}>
          Send Now
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {result && (
        <div className="mt-3 rounded-lg bg-green-50 border border-green-200 p-3">
          <p className="text-sm font-medium text-green-800 mb-1">Reminder created! Share this link:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-white border border-green-200 px-2 py-1 text-xs text-green-900 break-all">
              {result.url}
            </code>
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
