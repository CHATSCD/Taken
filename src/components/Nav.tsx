import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  PackageOpen,
  UtensilsCrossed,
  BarChart3,
  Settings,
} from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/ingredients', label: 'Ingredients', icon: PackageOpen },
  { to: '/menu', label: 'Menu Builder', icon: UtensilsCrossed },
  { to: '/report', label: 'Cost Report', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Nav() {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-brand-700 text-white flex flex-col shadow-lg z-10">
      <div className="px-6 py-5 border-b border-brand-600">
        <h1 className="text-lg font-bold tracking-tight">Food Cost Calc</h1>
        <p className="text-brand-200 text-xs mt-0.5">Restaurant Tools</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-500 text-white'
                  : 'text-brand-100 hover:bg-brand-600 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
