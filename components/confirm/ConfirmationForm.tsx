'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Props {
  reminderId: number
}

export default function ConfirmationForm({ reminderId }: Props) {
  const now = new Date()
  const localDate = now.toISOString().slice(0, 10)
  const localTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const [initials, setInitials] = useState('')
  const [date, setDate] = useState(localDate)
  const [time, setTime] = useState(localTime)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!initials.trim()) { setError('Please enter your initials.'); return }
    setLoading(true)
    setError('')

    const confirmedAt = new Date(`${date}T${time}:00`).toISOString()

    const res = await fetch(`/api/confirmations/${reminderId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initials, confirmedAt, notes }),
    })

    setLoading(false)
    if (res.ok) {
      setDone(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong. Please try again.')
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mb-3 text-4xl">✅</div>
        <h2 className="text-xl font-semibold text-green-800">Confirmed!</h2>
        <p className="mt-1 text-sm text-green-700">Your medication has been recorded. Thank you!</p>
        <p className="mt-2 text-xs text-green-600 font-medium">{initials.toUpperCase()} · {date} · {time}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Your Initials *"
        value={initials}
        onChange={e => setInitials(e.target.value.toUpperCase())}
        maxLength={5}
        placeholder="e.g. JD"
        required
      />
      <Input
        label="Date Taken *"
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />
      <Input
        label="Time Taken *"
        type="time"
        value={time}
        onChange={e => setTime(e.target.value)}
        required
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          placeholder="Any notes about this dose..."
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        />
      </div>
      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}
      <Button type="submit" loading={loading} size="lg" className="w-full">
        Confirm Medication Taken
      </Button>
    </form>
  )
}
