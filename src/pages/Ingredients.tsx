import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { useAppDataContext } from '../context/AppDataContext'
import Modal from '../components/Modal'
import { formatCurrency } from '../utils/formatters'
import type { Ingredient, IngredientCategory } from '../types'

const UNITS = [
  'lb', 'oz', 'g', 'kg', 'fl oz', 'cup', 'pint', 'quart', 'gallon',
  'liter', 'ml', 'each', 'dozen', 'case', 'bag', 'box', 'roll', 'sheet', 'tray',
]

const CATEGORIES: { value: IngredientCategory; label: string; color: string }[] = [
  { value: 'ingredient', label: 'Ingredient', color: 'bg-green-100 text-green-700' },
  { value: 'packaging', label: 'Packaging', color: 'bg-blue-100 text-blue-700' },
  { value: 'supply', label: 'Supply', color: 'bg-orange-100 text-orange-700' },
]

type FilterTab = 'all' | IngredientCategory

const emptyForm = (): Omit<Ingredient, 'id'> => ({
  name: '',
  unit: 'each',
  unitCost: 0,
  category: 'ingredient',
})

export default function Ingredients() {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } =
    useAppDataContext()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Ingredient | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [filter, setFilter] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const filtered = useMemo(
    () =>
      ingredients
        .filter(i => filter === 'all' || i.category === filter)
        .filter(i => i.name.toLowerCase().includes(search.toLowerCase())),
    [ingredients, filter, search]
  )

  const openAdd = () => {
    setEditTarget(null)
    setForm(emptyForm())
    setIsModalOpen(true)
  }

  const openEdit = (ingredient: Ingredient) => {
    setEditTarget(ingredient)
    setForm({
      name: ingredient.name,
      unit: ingredient.unit,
      unitCost: ingredient.unitCost,
      category: ingredient.category,
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (editTarget) {
      updateIngredient(editTarget.id, form)
    } else {
      addIngredient(form)
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    deleteIngredient(id)
    setConfirmDeleteId(null)
  }

  const getCategoryStyle = (cat: IngredientCategory) =>
    CATEGORIES.find(c => c.value === cat)?.color ?? ''

  const getCategoryLabel = (cat: IngredientCategory) =>
    CATEGORIES.find(c => c.value === cat)?.label ?? cat

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ingredients & Supplies</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your ingredient and packaging costs
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
          {(['all', 'ingredient', 'packaging', 'supply'] as FilterTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${
                filter === tab
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <p className="text-sm">
              {ingredients.length === 0
                ? 'No ingredients yet. Click "Add Item" to get started.'
                : 'No items match your search.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Unit</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Cost/Unit</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(ingredient => (
                <tr key={ingredient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-900">{ingredient.name}</td>
                  <td className="px-4 py-3 text-gray-500">{ingredient.unit}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-900">
                    {formatCurrency(ingredient.unitCost)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryStyle(
                        ingredient.category
                      )}`}
                    >
                      {getCategoryLabel(ingredient.category)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    {confirmDeleteId === ingredient.id ? (
                      <span className="flex items-center justify-end gap-2">
                        <span className="text-gray-500 text-xs">Delete?</span>
                        <button
                          onClick={() => handleDelete(ingredient.id)}
                          className="text-xs text-red-600 font-medium hover:text-red-700"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      <span className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(ingredient)}
                          className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(ingredient.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editTarget ? 'Edit Item' : 'Add Ingredient or Supply'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              autoFocus
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="e.g. Brioche Bun"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={form.unit}
                onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                {UNITS.map(u => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost per Unit ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.unitCost}
                onChange={e =>
                  setForm(f => ({ ...f, unitCost: parseFloat(e.target.value) || 0 }))
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="flex gap-3">
              {CATEGORIES.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={value}
                    checked={form.category === value}
                    onChange={() => setForm(f => ({ ...f, category: value }))}
                    className="accent-brand-600"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
            >
              {editTarget ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
