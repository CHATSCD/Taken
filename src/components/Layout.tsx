import { Outlet } from 'react-router-dom'
import Nav from './Nav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Nav />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="max-w-6xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
