import React, { useEffect, useState } from "react";
import User from "../interfaces/user";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Recipe from "../interfaces/recipe";
import Navbar from "../components/navbar.tsx";
import { Typography,Grid } from "@mui/material";
import RecipeCard from "../components/recipeCard.tsx";

/**
 * UserPage component fetches and displays user information and their favorite recipes.
 * 
 * This component performs the following tasks:
 * - Fetches the authenticated user's data from the server.
 * - Redirects to the login page if the user is not authenticated.
 * - Fetches and displays the user's favorite recipes.
 * 
 * @component
 * @example
 * return (
 *   <UserPage />
 * )
 * 
 * @returns {JSX.Element} The rendered component.
 * 
 * @remarks
 * This component uses the `useEffect` hook to fetch user data and favorite recipes when the component mounts.
 * It also uses the `useNavigate` hook from `react-router-dom` to handle navigation.
 * @hook
 * @name useEffect
 * @description Fetches user data and favorite recipes when the component mounts.
 * 
 * @hook
 * @name useState
 * @description Manages the state of the user, loading status, and favorite recipes.
 * 
 * @hook
 * @name useNavigate
 * @description Handles navigation to the login page if the user is not authenticated.
 */
function UserPage() {
    const [user , setUser] = useState<User | null>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);
    const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const res = await axios.get('/api/auth/user', { withCredentials: true });
        
            if (res.status === 200) {
                const { id, email, username, appUserRole, enabled } = res.data;
                setUser({ id, email, username, appUserRole, enabled });
            } else {
                setUser(null);
            }
        } catch (error) {
            console.log(error);
            setUser(null); 
            setLoadingUser(false);
        }finally{
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if(!loadingUser){
            if(user === null ){
                navigate("/login");
            }
        }
        axios.get('/api/recipe/get/favorites', { withCredentials: true })
            .then((res) => {
                setFavoriteRecipes(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    },[loadingUser]);

    return (
        <>
        <Navbar user={user} setUser={setUser}/>
        {user && (
            <>
            <Typography variant="h3" align="center" sx={{marginTop: 4}}>Hello, {user.username}</Typography>
            <Typography variant="h5" align="center">Account activated: {user.enabled ? "Yes" : "No"}</Typography>
            <Typography variant="h5" align="center">Role: {user.appUserRole}</Typography>
            <Typography variant="h5" align="center">Email: {user.email}</Typography>
            </>
        )}
        
        <Typography variant="h4" align="center" sx={{marginTop: 4}}>Your favorite recipes</Typography>
        <Grid container spacing={2}>
            {favoriteRecipes.map((recipe) => (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={recipe.id}>
                    <RecipeCard recipe={recipe}/>
                </Grid>
            ))}
        </Grid>
        </>
    );
}

export default UserPage;