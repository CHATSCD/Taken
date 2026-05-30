'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'

interface Patient { id: number; name: string }
interface Medication { id: number; name: string }
interface Schedule {
  id: number
  scheduledTime: string
  daysOfWeek: string
  active: boolean
  patient: Patient
  medication: Medication
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [patientId, setPatientId] = useState('')
  const [medicationId, setMedicationId] = useState('')
  const [time, setTime] = useState('08:00')
  const [days, setDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])
  const [loading, setLoading] = useState(false)

  async function load() {
    const [s, p, m] = await Promise.all([
      fetch('/api/schedules').then(r => r.json()),
      fetch('/api/patients').then(r => r.json()),
      fetch('/api/medications').then(r => r.json()),
    ])
    setSchedules(s)
    setPatients(p)
    setMedications(m)
  }

  useEffect(() => { load() }, [])

  function toggleDay(d: number) {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort())
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!patientId || !medicationId || !time || days.length === 0) return
    setLoading(true)
    await fetch('/api/schedules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patientId, medicationId, scheduledTime: time, daysOfWeek: days }) })
    setLoading(false)
    load()
  }

  async function handleToggle(id: number, active: boolean) {
    await fetch(`/api/schedules/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !active }) })
    load()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this schedule?')) return
    await fetch(`/api/schedules/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Schedules</h1>

      <form onSubmit={handleAdd} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="font-semibold text-gray-800">Add Schedule</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Patient</label>
            <select value={patientId} onChange={e => setPatientId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none">
              <option value="">Select patient...</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Medication</label>
            <select value={medicationId} onChange={e => setMedicationId(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none">
              <option value="">Select medication...</option>
              {medications.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">Days of Week</label>
          <div className="flex gap-2">
            {DAY_LABELS.map((label, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleDay(i)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${days.includes(i) ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" loading={loading}>Add Schedule</Button>
      </form>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {schedules.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">No schedules yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Patient</th>
                <th className="px-6 py-3 text-left">Medication</th>
                <th className="px-6 py-3 text-left">Time</th>
                <th className="px-6 py-3 text-left">Days</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {schedules.map(s => {
                let parsedDays: number[] = []
                try { parsedDays = JSON.parse(s.daysOfWeek) } catch {}
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{s.patient.name}</td>
                    <td className="px-6 py-4 text-gray-700">{s.medication.name}</td>
                    <td className="px-6 py-4 text-gray-700 font-mono">{s.scheduledTime}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {DAY_LABELS.map((label, i) => (
                          <span key={i} className={`rounded px-1.5 py-0.5 text-xs ${parsedDays.includes(i) ? 'bg-sky-100 text-sky-700 font-medium' : 'text-gray-300'}`}>
                            {label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        {s.active ? 'Active' : 'Paused'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button size="sm" variant="secondary" onClick={() => handleToggle(s.id, s.active)}>
                        {s.active ? 'Pause' : 'Resume'}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
