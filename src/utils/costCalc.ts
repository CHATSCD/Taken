import type { RecipeIngredient, Ingredient } from '../types'

export function computeItemFoodCost(
  recipe: RecipeIngredient[],
  ingredientMap: Map<string, Ingredient>
): number {
  return recipe.reduce((sum, ri) => {
    const ing = ingredientMap.get(ri.ingredientId)
    return ing ? sum + ing.unitCost * ri.quantity : sum
  }, 0)
}

export function computeSuggestedRetail(
  foodCost: number,
  targetPercent: number
): number {
  return targetPercent > 0 ? foodCost / targetPercent : 0
}

export function computeProfitMargin(retail: number, foodCost: number): number {
  return retail > 0 ? ((retail - foodCost) / retail) * 100 : 0
}

export function computeMarkup(retail: number, foodCost: number): number {
  return foodCost > 0 ? ((retail - foodCost) / foodCost) * 100 : 0
}
