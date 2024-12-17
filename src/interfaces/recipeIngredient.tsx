import Ingredient from "./ingredient";

interface RecipeIngredient {
    id: number;
    ingredient: Ingredient;
    quantity: number;
    quantityType: string;
}

export default RecipeIngredient;