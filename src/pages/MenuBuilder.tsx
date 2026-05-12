import { useState, useMemo } from 'react'
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Save,
  X,
} from 'lucide-react'
import { useAppDataContext } from '../context/AppDataContext'
import Modal from '../components/Modal'
import { formatCurrency } from '../utils/formatters'
import type { MenuItem, MenuSection, RecipeIngredient } from '../types'

// ─── Section Modal ────────────────────────────────────────────────────────────

function SectionModal({
  isOpen,
  onClose,
  editTarget,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  editTarget: MenuSection | null
  onSave: (name: string) => void
}) {
  const [name, setName] = useState(editTarget?.name ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave(name.trim())
    onClose()
  }

  // Reset when modal opens
  const handleOpen = () => setName(editTarget?.name ?? '')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTarget ? 'Rename Section' : 'Add Menu Section'}
      size="sm"
    >
      <form
        onSubmit={handleSubmit}
        onFocus={isOpen ? undefined : handleOpen}
        className="space-y-4"
      >
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Burgers, Drinks, Sides"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          required
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
          >
            {editTarget ? 'Rename' : 'Create Section'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Item Modal ───────────────────────────────────────────────────────────────

function ItemModal({
  isOpen,
  onClose,
  sectionId,
  editTarget,
  onSave,
}: {
  isOpen: boolean
  onClose: () => void
  sectionId: string
  editTarget: MenuItem | null
  onSave: (data: Omit<MenuItem, 'id'>) => void
}) {
  const [name, setName] = useState(editTarget?.name ?? '')
  const [notes, setNotes] = useState(editTarget?.notes ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      notes: notes.trim(),
      sectionId,
      ingredients: editTarget?.ingredients ?? [],
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTarget ? 'Edit Menu Item' : 'Add Menu Item'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name
          </label>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Classic Cheeseburger"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <input
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. 8oz patty, served with fries"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
          >
            {editTarget ? 'Save' : 'Add Item'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Recipe Editor ────────────────────────────────────────────────────────────

function RecipeEditor({ item }: { item: MenuItem }) {
  const { ingredients, ingredientMap, updateRecipe, costSummaries } =
    useAppDataContext()

  const summary = costSummaries.find(s => s.menuItem.id === item.id)
  const [draft, setDraft] = useState<RecipeIngredient[]>(item.ingredients)
  const [isDirty, setIsDirty] = useState(false)

  const liveCost = useMemo(
    () =>
      draft.reduce((sum, ri) => {
        const ing = ingredientMap.get(ri.ingredientId)
        return ing ? sum + ing.unitCost * ri.quantity : sum
      }, 0),
    [draft, ingredientMap]
  )

  const addLine = () => {
    setDraft(prev => [...prev, { ingredientId: '', quantity: 1 }])
    setIsDirty(true)
  }

  const updateLine = (
    index: number,
    field: keyof RecipeIngredient,
    value: string | number
  ) => {
    setDraft(prev =>
      prev.map((ri, i) => (i === index ? { ...ri, [field]: value } : ri))
    )
    setIsDirty(true)
  }

  const removeLine = (index: number) => {
    setDraft(prev => prev.filter((_, i) => i !== index))
    setIsDirty(true)
  }

  const handleSave = () => {
    const clean = draft.filter(ri => ri.ingredientId !== '')
    updateRecipe(item.id, clean)
    setDraft(clean)
    setIsDirty(false)
  }

  const handleDiscard = () => {
    setDraft(item.ingredients)
    setIsDirty(false)
  }

  return (
    <div className="border-t border-gray-100 pt-4 mt-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Recipe
        </span>
        <div className="flex items-center gap-3">
          {isDirty && (
            <span className="text-xs text-amber-600 font-medium">
              Live cost: {formatCurrency(liveCost)}
            </span>
          )}
          {!isDirty && summary && !summary.exceedsTarget && (
            <span className="text-xs text-gray-500">
              Saved cost: {formatCurrency(summary.totalFoodCost)}
            </span>
          )}
        </div>
      </div>

      {draft.length > 0 && (
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 font-medium">
                <th className="pb-2">Ingredient</th>
                <th className="pb-2 w-24">Qty</th>
                <th className="pb-2 w-16">Unit</th>
                <th className="pb-2 w-24 text-right">Subtotal</th>
                <th className="pb-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {draft.map((ri, idx) => {
                const ing = ingredientMap.get(ri.ingredientId)
                const subtotal = ing ? ing.unitCost * ri.quantity : 0
                return (
                  <tr key={idx}>
                    <td className="py-1.5 pr-2">
                      <select
                        value={ri.ingredientId}
                        onChange={e =>
                          updateLine(idx, 'ingredientId', e.target.value)
                        }
                        className="w-full border border-gray-200 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                      >
                        <option value="">Select ingredient...</option>
                        {ingredients.map(i => (
                          <option key={i.id} value={i.id}>
                            {i.name} ({i.unit})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-1.5 pr-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={ri.quantity}
                        onChange={e =>
                          updateLine(
                            idx,
                            'quantity',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                      />
                    </td>
                    <td className="py-1.5 pr-2 text-gray-400 text-xs">
                      {ing?.unit ?? '—'}
                    </td>
                    <td className="py-1.5 text-right font-mono text-gray-700 text-xs">
                      {ing ? formatCurrency(subtotal) : '—'}
                    </td>
                    <td className="py-1.5 pl-2">
                      <button
                        onClick={() => removeLine(idx)}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                        aria-label="Remove line"
                      >
                        <X size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={addLine}
          className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium"
        >
          <Plus size={13} />
          Add ingredient
        </button>

        {isDirty && (
          <div className="flex gap-2">
            <button
              onClick={handleDiscard}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 transition-colors font-medium"
            >
              <Save size={12} />
              Save Recipe
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Menu Item Card ───────────────────────────────────────────────────────────

function MenuItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: MenuItem
  onEdit: () => void
  onDelete: () => void
}) {
  const { costSummaries } = useAppDataContext()
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const summary = costSummaries.find(s => s.menuItem.id === item.id)

  return (
    <div className="border border-gray-100 rounded-lg bg-gray-50 mb-2">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-900 text-sm">{item.name}</span>
            {summary && !summary.exceedsTarget ? (
              <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                Cost: {formatCurrency(summary.totalFoodCost)} → Retail:{' '}
                {formatCurrency(summary.suggestedRetail)}
              </span>
            ) : (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                No recipe
              </span>
            )}
          </div>
          {item.notes && (
            <p className="text-xs text-gray-400 mt-0.5">{item.notes}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-3 shrink-0">
          {confirmDelete ? (
            <>
              <span className="text-xs text-gray-500 mr-1">Delete?</span>
              <button
                onClick={onDelete}
                className="text-xs text-red-600 font-medium hover:text-red-700 px-2"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-gray-400 hover:text-gray-600 px-2"
              >
                No
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-white rounded transition-colors"
                aria-label="Edit item"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded transition-colors"
                aria-label="Delete item"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={() => setExpanded(e => !e)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded transition-colors"
                aria-label={expanded ? 'Collapse recipe' : 'Expand recipe'}
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </>
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          <RecipeEditor item={item} />
        </div>
      )}
    </div>
  )
}

// ─── Section Panel ────────────────────────────────────────────────────────────

function SectionPanel({ section }: { section: MenuSection }) {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateSection,
    deleteSection,
  } = useAppDataContext()

  const items = menuItems.filter(i => i.sectionId === section.id)
  const [collapsed, setCollapsed] = useState(false)
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [editItemTarget, setEditItemTarget] = useState<MenuItem | null>(null)
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)
  const [confirmDeleteSection, setConfirmDeleteSection] = useState(false)

  const openAddItem = () => {
    setEditItemTarget(null)
    setIsItemModalOpen(true)
  }

  const openEditItem = (item: MenuItem) => {
    setEditItemTarget(item)
    setIsItemModalOpen(true)
  }

  const handleSaveItem = (data: Omit<MenuItem, 'id'>) => {
    if (editItemTarget) {
      updateMenuItem(editItemTarget.id, data)
    } else {
      addMenuItem(data)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
      {/* Section Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center gap-2 text-left flex-1"
        >
          {collapsed ? (
            <ChevronDown size={16} className="text-gray-400" />
          ) : (
            <ChevronUp size={16} className="text-gray-400" />
          )}
          <span className="font-semibold text-gray-900">{section.name}</span>
          <span className="text-xs text-gray-400 ml-1">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </span>
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={openAddItem}
            className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
          >
            <Plus size={13} />
            Add Item
          </button>
          <button
            onClick={() => setIsSectionModalOpen(true)}
            className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
            aria-label="Rename section"
          >
            <Pencil size={14} />
          </button>
          {confirmDeleteSection ? (
            <>
              <span className="text-xs text-gray-500 ml-1">Delete section?</span>
              <button
                onClick={() => deleteSection(section.id)}
                className="text-xs text-red-600 font-medium hover:text-red-700 px-2"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDeleteSection(false)}
                className="text-xs text-gray-400 hover:text-gray-600 px-2"
              >
                No
              </button>
            </>
          ) : (
            <button
              onClick={() => setConfirmDeleteSection(true)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              aria-label="Delete section"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Section Body */}
      {!collapsed && (
        <div className="p-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No items yet. Click "Add Item" to create one.</p>
            </div>
          ) : (
            items.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={() => openEditItem(item)}
                onDelete={() => deleteMenuItem(item.id)}
              />
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        sectionId={section.id}
        editTarget={editItemTarget}
        onSave={handleSaveItem}
      />
      <SectionModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        editTarget={section}
        onSave={name => updateSection(section.id, name)}
      />
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MenuBuilder() {
  const { sections, addSection } = useAppDataContext()
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Builder</h1>
          <p className="text-gray-500 text-sm mt-1">
            Build your menu sections and assign ingredient recipes
          </p>
        </div>
        <button
          onClick={() => setIsSectionModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus size={16} />
          Add Section
        </button>
      </div>

      {sections.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-16 text-center text-gray-400">
          <p className="text-sm mb-3">No sections yet. Create a section to get started.</p>
          <button
            onClick={() => setIsSectionModalOpen(true)}
            className="text-sm text-brand-600 font-medium hover:text-brand-700"
          >
            + Create your first section
          </button>
        </div>
      ) : (
        sections.map(section => (
          <SectionPanel key={section.id} section={section} />
        ))
      )}

      <SectionModal
        isOpen={isSectionModalOpen}
        onClose={() => setIsSectionModalOpen(false)}
        editTarget={null}
        onSave={name => addSection(name)}
      />
    </div>
  )
}
