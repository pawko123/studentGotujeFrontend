import RecipeIngredient from './recipeIngredient';
import image from './image';
import Comment from './comment';
import Tag from './tag';

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