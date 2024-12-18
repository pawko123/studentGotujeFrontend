import React ,{useState} from 'react';
import Recipe from '../interfaces/recipe';
import { Card, CardMedia, CardContent, Typography, Box, Rating } from '@mui/material';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
    recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({recipe}) => {

    const firstImage = recipe.images && recipe.images.length > 0 ? recipe.images[0] : null;

    const [userRating, setUserRating] = useState<number>(recipe.averageRating);

    return (
        <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none' }}>
            <Card sx={{ width: '93%' , margin: 2 }}>
                {/* Display first image if exists */}
                {firstImage && (
                <CardMedia
                    component="img"
                    height="200"
                    image={`/api/files/${firstImage.imagePath}`} // Assuming the image path is correct
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
                    <Rating value={userRating} precision={1} 
                    onChange={(event, newValue) => {
                        setUserRating(newValue || 0);
                    }}
                    />
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