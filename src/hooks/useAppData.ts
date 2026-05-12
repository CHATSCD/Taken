import { useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useLocalStorage from './useLocalStorage'
import {
  computeItemFoodCost,
  computeSuggestedRetail,
  computeProfitMargin,
  computeMarkup,
} from '../utils/costCalc'
import type {
  Ingredient,
  MenuItem,
  MenuSection,
  AppSettings,
  RecipeIngredient,
  MenuItemCostSummary,
} from '../types'

const KEYS = {
  INGREDIENTS: 'fcc:ingredients',
  SECTIONS: 'fcc:sections',
  MENU_ITEMS: 'fcc:menuItems',
  SETTINGS: 'fcc:settings',
} as const

export function useAppData() {
  const [ingredients, setIngredients] = useLocalStorage<Ingredient[]>(
    KEYS.INGREDIENTS,
    []
  )
  const [sections, setSections] = useLocalStorage<MenuSection[]>(
    KEYS.SECTIONS,
    []
  )
  const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>(
    KEYS.MENU_ITEMS,
    []
  )
  const [settings, setSettings] = useLocalStorage<AppSettings>(KEYS.SETTINGS, {
    foodCostTarget: 0.3,
  })

  // Ingredients
  const addIngredient = useCallback(
    (data: Omit<Ingredient, 'id'>) => {
      setIngredients(prev => [...prev, { ...data, id: uuidv4() }])
    },
    [setIngredients]
  )

  const updateIngredient = useCallback(
    (id: string, data: Omit<Ingredient, 'id'>) => {
      setIngredients(prev => prev.map(i => (i.id === id ? { ...data, id } : i)))
    },
    [setIngredients]
  )

  const deleteIngredient = useCallback(
    (id: string) => {
      setIngredients(prev => prev.filter(i => i.id !== id))
      setMenuItems(prev =>
        prev.map(item => ({
          ...item,
          ingredients: item.ingredients.filter(ri => ri.ingredientId !== id),
        }))
      )
    },
    [setIngredients, setMenuItems]
  )

  // Sections
  const addSection = useCallback(
    (name: string) => {
      setSections(prev => [...prev, { id: uuidv4(), name }])
    },
    [setSections]
  )

  const updateSection = useCallback(
    (id: string, name: string) => {
      setSections(prev => prev.map(s => (s.id === id ? { ...s, name } : s)))
    },
    [setSections]
  )

  const deleteSection = useCallback(
    (id: string) => {
      setSections(prev => prev.filter(s => s.id !== id))
      setMenuItems(prev => prev.filter(item => item.sectionId !== id))
    },
    [setSections, setMenuItems]
  )

  // Menu items
  const addMenuItem = useCallback(
    (data: Omit<MenuItem, 'id'>) => {
      setMenuItems(prev => [...prev, { ...data, id: uuidv4() }])
    },
    [setMenuItems]
  )

  const updateMenuItem = useCallback(
    (id: string, data: Omit<MenuItem, 'id'>) => {
      setMenuItems(prev =>
        prev.map(item => (item.id === id ? { ...data, id } : item))
      )
    },
    [setMenuItems]
  )

  const deleteMenuItem = useCallback(
    (id: string) => {
      setMenuItems(prev => prev.filter(item => item.id !== id))
    },
    [setMenuItems]
  )

  const updateRecipe = useCallback(
    (itemId: string, recipe: RecipeIngredient[]) => {
      setMenuItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, ingredients: recipe } : item
        )
      )
    },
    [setMenuItems]
  )

  const updateSettings = useCallback(
    (data: Partial<AppSettings>) => {
      setSettings(prev => ({ ...prev, ...data }))
    },
    [setSettings]
  )

  const clearAllData = useCallback(() => {
    setIngredients([])
    setSections([])
    setMenuItems([])
    setSettings({ foodCostTarget: 0.3 })
  }, [setIngredients, setSections, setMenuItems, setSettings])

  // Derived / computed
  const ingredientMap = useMemo(
    () => new Map(ingredients.map(i => [i.id, i])),
    [ingredients]
  )

  const costSummaries = useMemo((): MenuItemCostSummary[] => {
    const sectionMap = new Map(sections.map(s => [s.id, s]))
    return menuItems.map(item => {
      const section = sectionMap.get(item.sectionId) ?? {
        id: '',
        name: 'Unknown',
      }
      const totalFoodCost = computeItemFoodCost(item.ingredients, ingredientMap)
      const target = settings.foodCostTarget
      const suggestedRetail = computeSuggestedRetail(totalFoodCost, target)
      const foodCostPercent =
        suggestedRetail > 0 ? (totalFoodCost / suggestedRetail) * 100 : 0
      const profitMargin = computeProfitMargin(suggestedRetail, totalFoodCost)
      const markupPercent = computeMarkup(suggestedRetail, totalFoodCost)
      const exceedsTarget = item.ingredients.length === 0 || totalFoodCost === 0

      return {
        menuItem: item,
        section,
        totalFoodCost,
        suggestedRetail,
        foodCostPercent,
        profitMargin,
        markupPercent,
        exceedsTarget,
      }
    })
  }, [menuItems, sections, ingredientMap, settings.foodCostTarget])

  return {
    ingredients,
    sections,
    menuItems,
    settings,
    ingredientMap,
    costSummaries,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    addSection,
    updateSection,
    deleteSection,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateRecipe,
    updateSettings,
    clearAllData,
  }
}
