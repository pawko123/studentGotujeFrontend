import React ,{useState} from 'react';
import Recipe from '../interfaces/recipe';
import { Card, CardMedia, CardContent, Typography, Box, Rating } from '@mui/material';
import { Link } from 'react-router-dom';
//@ts-ignore
import RecipeDefaultImage  from '../images/recipe.png';

interface RecipeCardProps {
    recipe: Recipe;
}

/**
 * RecipeCard component displays a card with recipe details.
 * 
 * @component
 * @param {RecipeCardProps} props - The properties for the RecipeCard component.
 * @param {Object} props.recipe - The recipe object containing details to be displayed.
 * @param {Array} props.recipe.images - An array of image objects related to the recipe.
 * @param {string} props.recipe.images[].imagePath - The path to the image file.
 * @param {number} props.recipe.averageRating - The average rating of the recipe.
 * @param {string} props.recipe.id - The unique identifier for the recipe.
 * @param {string} props.recipe.name - The name of the recipe.
 * @param {string} props.recipe.type - The type/category of the recipe.
 * 
 * @returns {JSX.Element} A JSX element representing the recipe card.
 */
const RecipeCard: React.FC<RecipeCardProps> = ({recipe}) => {

    const firstImage = recipe.images && recipe.images.length > 0 ? recipe.images[0] : null;

    const [userRating, setUserRating] = useState<number>(recipe.averageRating);

    return (
        <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none' }}>
            <Card sx={{ width: '93%' , margin: 2 }}>
                {/* Display first image if exists */}
                {firstImage ? (
                <CardMedia
                    component="img"
                    height="200"
                    image={`/api/files/${firstImage.imagePath}`} // Assuming the image path is correct
                    alt={recipe.name}
                />
                ):(
                <CardMedia
                    component="img"
                    height="200"
                    image={RecipeDefaultImage}
                    alt={recipe.name}
                />
                )}

                <CardContent>
                    {/* Recipe Name */}
                    <Typography variant="h6" component="div">
                    {recipe.name}
                    </Typography>

                    {/* Average Rating */}
                    <Box display="flex" alignItems="center">
                    <Rating value={userRating} precision={1} readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1 }}>
                        {userRating.toFixed(1)}
                    </Typography>
                    </Box>

                    {/* Recipe Type */}
                    <Typography variant="body2" color="text.secondary">
                    {recipe.type}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
}

export default RecipeCard;