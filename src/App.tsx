import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Ingredients from './pages/Ingredients'
import MenuBuilder from './pages/MenuBuilder'
import CostReport from './pages/CostReport'
import Settings from './pages/Settings'
import { useAppData } from './hooks/useAppData'
import { AppDataContext } from './context/AppDataContext'

export default function App() {
  const appData = useAppData()

  return (
    <AppDataContext.Provider value={appData}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/menu" element={<MenuBuilder />} />
          <Route path="/report" element={<CostReport />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </AppDataContext.Provider>
  )
}
