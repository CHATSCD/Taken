export interface Ingredient {
  id: string
  name: string
  unit: string
  unitCost: number
  category: 'ingredient' | 'packaging' | 'supply'
}

export interface RecipeIngredient {
  ingredientId: string
  quantity: number
}

export interface MenuItem {
  id: string
  name: string
  sectionId: string
  ingredients: RecipeIngredient[]
  notes?: string
}

export interface MenuSection {
  id: string
  name: string
}

export interface AppSettings {
  foodCostTarget: number
}

export interface MenuItemCostSummary {
  menuItem: MenuItem
  section: MenuSection
  totalFoodCost: number
  suggestedRetail: number
  foodCostPercent: number
  profitMargin: number
  markupPercent: number
  exceedsTarget: boolean
}

export type IngredientCategory = Ingredient['category']
