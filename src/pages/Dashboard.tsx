import { useNavigate } from 'react-router-dom'
import { PackageOpen, UtensilsCrossed, TrendingDown, AlertTriangle, Plus } from 'lucide-react'
import { useAppDataContext } from '../context/AppDataContext'
import { formatCurrency, formatPercent } from '../utils/formatters'

export default function Dashboard() {
  const { ingredients, menuItems, costSummaries, settings } = useAppDataContext()
  const navigate = useNavigate()

  const avgFoodCostPct =
    costSummaries.length > 0
      ? costSummaries.reduce((s, c) => s + c.foodCostPercent, 0) /
        costSummaries.length
      : 0

  const attentionCount = costSummaries.filter(c => c.exceedsTarget).length
  const recentSummaries = [...costSummaries].slice(-5).reverse()

  const stats = [
    {
      label: 'Total Ingredients',
      value: ingredients.length,
      icon: PackageOpen,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Menu Items',
      value: menuItems.length,
      icon: UtensilsCrossed,
      color: 'bg-brand-50 text-brand-600',
    },
    {
      label: 'Avg Food Cost %',
      value: formatPercent(avgFoodCostPct),
      icon: TrendingDown,
      color: 'bg-purple-50 text-purple-600',
      subtext: `Target: ${formatPercent(settings.foodCostTarget * 100)}`,
    },
    {
      label: 'Need Attention',
      value: attentionCount,
      icon: AlertTriangle,
      color: attentionCount > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400',
      subtext: 'Items with no recipe',
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, subtext }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
              <Icon size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
            {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => navigate('/ingredients')}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus size={16} />
          Add Ingredient
        </button>
        <button
          onClick={() => navigate('/menu')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Plus size={16} />
          Add Menu Item
        </button>
      </div>

      {/* Recent Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Menu Items</h2>
        </div>
        {recentSummaries.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-400">
            <UtensilsCrossed size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No menu items yet. Go to Menu Builder to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentSummaries.map(s => (
              <div key={s.menuItem.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{s.menuItem.name}</div>
                  <div className="text-xs text-gray-400">{s.section.name}</div>
                </div>
                <div className="text-right">
                  {s.exceedsTarget ? (
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">
                      No recipe
                    </span>
                  ) : (
                    <>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(s.suggestedRetail)}
                      </div>
                      <div className="text-xs text-gray-400">
                        Cost: {formatCurrency(s.totalFoodCost)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
