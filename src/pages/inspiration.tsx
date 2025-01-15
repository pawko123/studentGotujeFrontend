import React,{useState,useEffect} from "react";
import axios from 'axios';
import Navbar from "../components/navbar.tsx";
import useAuth from "../hooks/useAuth.tsx";
import Recipe from "../interfaces/recipe.tsx";
import ListOf5Recipes from "../components/listOf5Recipes.tsx";

/**
 * The `Inspiration` component fetches and displays random recipes for breakfast, dinner, and supper.
 * It uses the `useAuth` hook to get the current user and the `useState` hook to manage the state of the recipes.
 * The `useEffect` hook is used to fetch the recipes from the API when the component mounts.
 * 
 * The component renders a `Navbar` component with the user information and three `ListOf5Recipes` components,
 * each displaying a list of recipes for breakfast, dinner, and supper respectively.
 * 
 * @component
 * @example
 * return (
 *   <Inspiration />
 * )
 */
function Inspiration() {
    const [user, setUser] = useAuth();
    const [breakfastRecipes, setBreakfastRecipes] = useState<Recipe[]>([]);
    const [dinnerRecipes, setDinnerRecipes] = useState<Recipe[]>([]);
    const [supperRecipes, setSupperRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        axios.get('/api/recipe/get/randomRecipes?type=BREAKFAST')
            .then((res) => {
                if(res.status === 200){
                    setBreakfastRecipes(res.data);
                }else{
                    setBreakfastRecipes([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        axios.get('/api/recipe/get/randomRecipes?type=DINNER')
            .then((res) => {
                if(res.status === 200){
                    setDinnerRecipes(res.data);
                }else{
                    setDinnerRecipes([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        axios.get('/api/recipe/get/randomRecipes?type=SUPPER')
            .then((res) => {
                if(res.status === 200){
                    setSupperRecipes(res.data);
                }else{
                    setSupperRecipes([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return (
        <>
        <Navbar user={user} setUser={setUser}/>
        <ListOf5Recipes recipes={breakfastRecipes} title="Breakfast Recipes"/>
        <ListOf5Recipes recipes={dinnerRecipes} title="Dinner Recipes"/>
        <ListOf5Recipes recipes={supperRecipes} title="Supper Recipes"/>
        </>
    );
}

export default Inspiration;