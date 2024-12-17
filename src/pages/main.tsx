import React,{useState,useEffect} from 'react';
import "./App.css"
import axios from 'axios';
import Navbar from '../components/navbar.tsx';
import useAuth from '../hooks/useAuth.tsx';
import Recipe from '../interfaces/recipe.tsx';
import RecipeCard from '../components/recipeCard.tsx';
import { Grid } from '@mui/material';

function Main() {
    const [user, setUser] = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/recipe/get/recipes')
            .then((res) => {
                if(res.status === 200){
                    setRecipes(res.data);
                }else{
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
            <Grid container spacing={2}>
                {recipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={recipe.id}>
                        <RecipeCard recipe={recipe} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default Main;