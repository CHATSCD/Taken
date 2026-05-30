'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Patient { id: number; name: string; createdAt: string }

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [name, setName] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await fetch('/api/patients')
    setPatients(await res.json())
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    await fetch('/api/patients', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) })
    setName('')
    setLoading(false)
    load()
  }

  async function handleEdit(id: number) {
    if (!editName.trim()) return
    await fetch(`/api/patients/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editName }) })
    setEditId(null)
    setEditName('')
    load()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this patient? This cannot be undone.')) return
    await fetch(`/api/patients/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Patients</h1>

      <form onSubmit={handleAdd} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-800">Add Patient</h2>
        <div className="flex gap-3">
          <Input placeholder="Patient name" value={name} onChange={e => setName(e.target.value)} className="flex-1" />
          <Button type="submit" loading={loading}>Add</Button>
        </div>
      </form>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {patients.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">No patients yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Added</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {editId === p.id ? (
                      <Input value={editName} onChange={e => setEditName(e.target.value)} className="w-48" />
                    ) : p.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {editId === p.id ? (
                      <>
                        <Button size="sm" onClick={() => handleEdit(p.id)}>Save</Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditId(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => { setEditId(p.id); setEditName(p.name) }}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Delete</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
