import { useState, useMemo } from 'react'
import { AlertTriangle, Search } from 'lucide-react'
import { useAppDataContext } from '../context/AppDataContext'
import { formatCurrency, formatPercent } from '../utils/formatters'

export default function CostReport() {
  const { costSummaries, sections, settings } = useAppDataContext()
  const [sectionFilter, setSectionFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      costSummaries
        .filter(s => sectionFilter === 'all' || s.menuItem.sectionId === sectionFilter)
        .filter(s =>
          s.menuItem.name.toLowerCase().includes(search.toLowerCase())
        ),
    [costSummaries, sectionFilter, search]
  )

  const avgCostPct =
    filtered.length > 0
      ? filtered.reduce((sum, s) => sum + s.foodCostPercent, 0) / filtered.length
      : 0

  const avgMargin =
    filtered.length > 0
      ? filtered.reduce((sum, s) => sum + s.profitMargin, 0) / filtered.length
      : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cost Report</h1>
          <p className="text-gray-500 text-sm mt-1">
            Suggested retail prices at {formatPercent(settings.foodCostTarget * 100)} food cost target
          </p>
        </div>
        <span className="text-xs text-gray-400 italic">
          Print this page to save as PDF
        </span>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
          <div className="text-xs text-gray-400 mb-1">Items in view</div>
          <div className="text-2xl font-bold text-gray-900">{filtered.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
          <div className="text-xs text-gray-400 mb-1">Avg food cost %</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatPercent(avgCostPct)}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
          <div className="text-xs text-gray-400 mb-1">Avg profit margin</div>
          <div className="text-2xl font-bold text-brand-700">
            {formatPercent(avgMargin)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={sectionFilter}
          onChange={e => setSectionFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        >
          <option value="all">All Sections</option>
          {sections.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <p className="text-sm">
              {costSummaries.length === 0
                ? 'No menu items yet. Build your menu first.'
                : 'No items match your search.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Item</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Section</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Food Cost</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">
                  Suggested Retail
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Cost %</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Margin</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">Markup</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr
                  key={s.menuItem.id}
                  className={s.exceedsTarget ? 'bg-red-50' : 'hover:bg-gray-50'}
                >
                  <td className="px-6 py-3">
                    <div className="font-medium text-gray-900">{s.menuItem.name}</div>
                    {s.menuItem.notes && (
                      <div className="text-xs text-gray-400">{s.menuItem.notes}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{s.section.name}</td>
                  <td className="px-4 py-3 text-right font-mono text-gray-900">
                    {s.exceedsTarget ? '—' : formatCurrency(s.totalFoodCost)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-brand-700">
                    {s.exceedsTarget ? '—' : formatCurrency(s.suggestedRetail)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {s.exceedsTarget ? '—' : formatPercent(s.foodCostPercent)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {s.exceedsTarget ? '—' : formatPercent(s.profitMargin)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {s.exceedsTarget ? '—' : formatPercent(s.markupPercent)}
                  </td>
                  <td className="px-6 py-3 text-right">
                    {s.exceedsTarget ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                        <AlertTriangle size={11} />
                        No Recipe
                      </span>
                    ) : (
                      <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                        Ready
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            {filtered.length > 1 && (
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-3 text-sm font-semibold text-gray-600"
                  >
                    Averages ({filtered.filter(s => !s.exceedsTarget).length} priced items)
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-gray-600">
                    {formatCurrency(
                      filtered
                        .filter(s => !s.exceedsTarget)
                        .reduce((sum, s) => sum + s.totalFoodCost, 0) /
                        Math.max(filtered.filter(s => !s.exceedsTarget).length, 1)
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-brand-700">
                    {formatCurrency(
                      filtered
                        .filter(s => !s.exceedsTarget)
                        .reduce((sum, s) => sum + s.suggestedRetail, 0) /
                        Math.max(filtered.filter(s => !s.exceedsTarget).length, 1)
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatPercent(avgCostPct)}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">
                    {formatPercent(avgMargin)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Formula: Suggested Retail = Food Cost ÷ {formatPercent(settings.foodCostTarget * 100)} target
      </div>
    </div>
  )
}
