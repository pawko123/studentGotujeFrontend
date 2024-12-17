import React, {useState,useEffect} from 'react';
import axios from 'axios';
import Recipe from '../interfaces/recipe';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar.tsx';
import useAuth from '../hooks/useAuth.tsx';
import { Card,CardMedia,Box,Button,Typography } from '@mui/material';

function RecipePage (){
    const {id} = useParams<{id:string}>();
    const [user, setUser] = useAuth();
    const [index, setIndex] = useState<number>(0);
    const [recipe, setRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/recipe/get/recipe?id=${id}`)
            .then((res) => {
                if(res.status === 200){
                    console.log(res.data);
                    setRecipe(res.data);
                }else{
                    setRecipe(null);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    const nextImage = () => {
        if (index < recipe?.images.length! - 1) {
            setIndex(index + 1);
        }
    };

    const prevImage = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };
    return (
        <>
            <Navbar user={user} setUser={setUser} />
            <div>
                {recipe && (
                    <div>
                        <h1>{recipe.name}</h1>
                        <p>{recipe.description}</p>
                        <p>{recipe.type}</p>
                        <p>{recipe.averageRating}</p>
                    </div>
                )}
            </div>

            {recipe&&
            <>
            <Box display="flex" justifyContent="center" alignItems="center" position="relative">
                <Card sx={{ maxWidth: 600, position: 'relative' }}>
                    {/* Left Button */}
                    <Button
                        onClick={prevImage}
                        variant="contained"
                        color="primary"
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            minWidth: '40px',
                        }}
                    >
                        ‹
                    </Button>

                    {/* Main Image */}
                    <CardMedia
                        component="img"
                        height="400"
                        image={`http://localhost:8080/files/${recipe.images[index].imagePath}`}
                        alt="Recipe Image"
                        sx={{ objectFit: 'cover' }}
                    />

                    {/* Right Button */}
                    <Button
                        onClick={nextImage}
                        variant="contained"
                        color="primary"
                        sx={{
                            position: 'absolute',
                            right: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            minWidth: '40px',
                        }}
                    >
                        ›
                    </Button>
                </Card>
            </Box>
            {/* Image Counter */}
            <Box mt={2} textAlign="center">
                <Typography variant="body2">
                    {index + 1} / {recipe.images.length}
                </Typography>
            </Box>
        </>
    }
        {/* Recipe Ingredients */}
        {recipe && 
            <>
                <Box mt={2}>
                    <Typography variant="h5">Ingredients</Typography>
                    <ul>
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient.ingredient.name} {ingredient.quantity} {ingredient.quantityType}</li>
                        ))}
                    </ul>
                </Box>
            </>
        }
        </>
    );
}

export default RecipePage;

