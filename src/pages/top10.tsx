import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid } from '@mui/material';
import RecipeCard from '../components/recipeCard.tsx';
import Recipe from '../interfaces/recipe.tsx';
import Navbar from '../components/navbar.tsx';
import useAuth from '../hooks/useAuth.tsx';

function Top10Recipes(){
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [user, setUser] = useAuth();

    useEffect(() => {
        axios.get('/api/recipe/get/recipes')
            .then((res) => {
                if (res.status === 200) {
                    const sortedRecipes = res.data.sort((a, b) => b.averageRating - a.averageRating);
                    
                    const top10Recipes = sortedRecipes.slice(0, 10);

                    setRecipes(top10Recipes);
                } else {
                    setRecipes([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <>
            <Navbar user={user} setUser={setUser}/>
            <Typography variant="h4" gutterBottom>
                Top 10 Recipes
            </Typography>
            <Grid container spacing={2}>
                {recipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={recipe.id}>
                        <RecipeCard recipe={recipe} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default Top10Recipes;