import Ingredient from "./ingredient";

/**
 * Represents an ingredient used in a recipe.
 * 
 * @interface RecipeIngredient
 * @property {number} [id] - The unique identifier for the recipe ingredient (optional).
 * @property {Ingredient} ingredient - The ingredient used in the recipe.
 * @property {number} quantity - The quantity of the ingredient.
 * @property {string} quantityType - The unit of measurement for the quantity.
 */
interface RecipeIngredient {
    id?: number;
    ingredient: Ingredient;
    quantity: number;
    quantityType: string;
}

export default RecipeIngredient;