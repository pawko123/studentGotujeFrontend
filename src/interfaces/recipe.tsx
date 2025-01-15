import RecipeIngredient from './recipeIngredient';
import image from './image';
import Comment from './comment';
import Tag from './tag';

/**
 * Represents a recipe.
 * 
 * @property {number} id - The unique identifier for the recipe.
 * @property {string} name - The name of the recipe.
 * @property {string} description - A brief description of the recipe.
 * @property {number} averageRating - The average rating of the recipe.
 * @property {string} type - The type or category of the recipe.
 * @property {RecipeIngredient[]} ingredients - The list of ingredients required for the recipe.
 * @property {image[]} images - The list of images associated with the recipe.
 * @property {Comment[]} comments - The list of comments on the recipe.
 * @property {Tag[]} tags - The list of tags associated with the recipe.
 */
interface Recipe {
    id: number;
    name: string;
    description: string;
    averageRating: number;
    type: string;
    ingredients: RecipeIngredient[];
    images:image[];
    comments: Comment[];
    tags: Tag[];
}

export default Recipe;