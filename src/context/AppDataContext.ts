import { createContext, useContext } from 'react'
import type { useAppData } from '../hooks/useAppData'

type AppData = ReturnType<typeof useAppData>

export const AppDataContext = createContext<AppData | null>(null)

export function useAppDataContext(): AppData {
  const ctx = useContext(AppDataContext)
  if (!ctx)
    throw new Error('useAppDataContext must be used within AppDataContext.Provider')
  return ctx
}
