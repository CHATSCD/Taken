import { useState } from 'react'
import { useAppDataContext } from '../context/AppDataContext'
import { formatPercent } from '../utils/formatters'

export default function Settings() {
  const { settings, updateSettings, clearAllData, ingredients, menuItems } =
    useAppDataContext()

  const [localTarget, setLocalTarget] = useState(
    Math.round(settings.foodCostTarget * 100)
  )
  const [confirmClear, setConfirmClear] = useState(false)

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (val >= 1 && val <= 100) {
      setLocalTarget(val)
      updateSettings({ foodCostTarget: val / 100 })
    }
  }

  const handleClearData = () => {
    clearAllData()
    setLocalTarget(30)
    setConfirmClear(false)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure pricing targets and manage your data</p>
      </div>

      <div className="space-y-6 max-w-xl">
        {/* Food Cost Target */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Food Cost Target
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            The percentage of your selling price that goes to food cost. Industry
            standard is 28–35%. Default is 30%.
          </p>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="number"
                min={1}
                max={100}
                step={1}
                value={localTarget}
                onChange={handleTargetChange}
                className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm text-right pr-8 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                %
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Current target:{' '}
              <strong className="text-gray-900">
                {formatPercent(settings.foodCostTarget * 100)}
              </strong>
            </span>
          </div>

          <div className="mt-5 p-4 bg-brand-50 rounded-lg text-sm text-brand-800">
            <p className="font-medium mb-1">Formula</p>
            <p>
              Suggested Retail = Food Cost ÷{' '}
              {formatPercent(settings.foodCostTarget * 100)}
            </p>
            <p className="text-brand-600 mt-1">
              Example: $3.00 cost ÷ {settings.foodCostTarget} ={' '}
              <strong>${(3 / settings.foodCostTarget).toFixed(2)} retail</strong>
            </p>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Data Management
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            All data is stored locally in your browser.
          </p>

          <div className="text-sm text-gray-600 mb-5 space-y-1">
            <div>
              Ingredients &amp; supplies:{' '}
              <strong className="text-gray-900">{ingredients.length}</strong>
            </div>
            <div>
              Menu items:{' '}
              <strong className="text-gray-900">{menuItems.length}</strong>
            </div>
          </div>

          {confirmClear ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-red-600 font-medium">
                Are you sure? This cannot be undone.
              </span>
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, clear all data
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmClear(true)}
              className="px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear All Data
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
