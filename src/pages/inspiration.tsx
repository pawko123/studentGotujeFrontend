import React,{useState,useEffect} from "react";
import axios from 'axios';
import Navbar from "../components/navbar.tsx";
import useAuth from "../hooks/useAuth.tsx";
import Recipe from "../interfaces/recipe.tsx";
import ListOf5Recipes from "../components/listOf5Recipes.tsx";

function Inspiration() {
    const [user, setUser] = useAuth();
    const [breakfastRecipes, setBreakfastRecipes] = useState<Recipe[]>([]);
    const [dinnerRecipes, setDinnerRecipes] = useState<Recipe[]>([]);
    const [supperRecipes, setSupperRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/recipe/get/randomRecipes?type=BREAKFAST')
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
        axios.get('http://localhost:8080/recipe/get/randomRecipes?type=DINNER')
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
        axios.get('http://localhost:8080/recipe/get/randomRecipes?type=SUPPER')
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