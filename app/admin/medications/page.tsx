'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Medication { id: number; name: string; description: string | null; createdAt: string }

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    const res = await fetch('/api/medications')
    setMedications(await res.json())
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    await fetch('/api/medications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, description }) })
    setName('')
    setDescription('')
    setLoading(false)
    load()
  }

  async function handleEdit(id: number) {
    if (!editName.trim()) return
    await fetch(`/api/medications/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editName, description: editDesc }) })
    setEditId(null)
    load()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this medication?')) return
    await fetch(`/api/medications/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Medications</h1>

      <form onSubmit={handleAdd} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-3">
        <h2 className="font-semibold text-gray-800">Add Medication</h2>
        <div className="flex gap-3">
          <Input placeholder="Medication name" value={name} onChange={e => setName(e.target.value)} className="flex-1" />
          <Input placeholder="Notes / description (optional)" value={description} onChange={e => setDescription(e.target.value)} className="flex-1" />
          <Button type="submit" loading={loading}>Add</Button>
        </div>
      </form>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {medications.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-gray-500">No medications yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Description</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {medications.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {editId === m.id ? <Input value={editName} onChange={e => setEditName(e.target.value)} className="w-36" /> : m.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {editId === m.id ? <Input value={editDesc} onChange={e => setEditDesc(e.target.value)} className="w-48" /> : (m.description || '—')}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {editId === m.id ? (
                      <>
                        <Button size="sm" onClick={() => handleEdit(m.id)}>Save</Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditId(null)}>Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="secondary" onClick={() => { setEditId(m.id); setEditName(m.name); setEditDesc(m.description || '') }}>Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => handleDelete(m.id)}>Delete</Button>
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
