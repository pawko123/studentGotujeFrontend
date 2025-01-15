import React from 'react';
import Recipe from '../interfaces/recipe';
import RecipeCard from './recipeCard.tsx';
import { Grid, Typography } from '@mui/material';

interface ListProps {
    recipes: Recipe[];
    title: string;
}

/**
 * Component that displays a list of 5 recipes.
 *
 * @component
 * @param {ListProps} props - The properties object.
 * @param {Array} props.recipes - An array of recipe objects to display.
 * @param {string} props.title - The title to display above the list of recipes.
 * @returns {JSX.Element} The rendered component.
 */
const ListOf5Recipes:React.FC<ListProps> = ({recipes,title}) => {
    return (
        <>
            <Typography variant="h4" gutterBottom>
                {title}
            </Typography>
            <Grid justifyContent="center" container spacing={2}>
                {recipes.map((recipe, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
                        <RecipeCard recipe={recipe}/>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default ListOf5Recipes;