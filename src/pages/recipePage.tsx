import React, {useState,useEffect} from 'react';
import axios from 'axios';
import Recipe from '../interfaces/recipe';
import Tag from '../interfaces/tag.tsx'
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar.tsx';
import useAuth from '../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Card,Rating,CardMedia,Box,Button,Typography,CardContent,Chip, IconButton, TextField } from '@mui/material';

function RecipePage (){
    const {id} = useParams<{id:string}>();
    const [user, setUser] = useAuth();
    const [index, setIndex] = useState<number>(0);
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [loading , setLoading] = useState<boolean>(false);
    const [userRating, setUserRating] = useState<number>(0);
    const [commentContent, setCommentContent] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/api/recipe/get/recipe?id=${id}`)
            .then((res) => {
                if(res.status === 200){
                    setRecipe(res.data);
                }else{
                    setRecipe(null);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [id]);

    useEffect(() => {
        if(!user || !recipe){
            return;
        }
        axios.get(`/api/recipe/get/favorites`)
            .then((res) => {
                if(res.status === 200){
                    res.data.forEach((favorite: Recipe) => {
                        if(favorite.id === recipe?.id){
                            setIsFavorite(true);
                        }
                    });
                }else{
                    setIsFavorite(false);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [recipe,user]);

    useEffect(() => {
        if(recipe !== null && user !== null){
            axios.get(`/api/recipe/get/userRating?recipeId=${recipe.id}`)
                .then((res) => {
                    if(res.status === 200){
                        console.log(res.data);
                        setUserRating(res.data);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    },[recipe,user]);

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

    const setAsFavorite = () => {
        setLoading(true);
        if (user && recipe) {
            axios.post(`/api/recipe/create/favorite`, {
                recipeId: recipe.id,
            })
                .then((res) => {
                    if (res.status === 200) {
                        setUser(res.data);
                        setIsFavorite(!isFavorite);
                    }
                })
                .catch((err) => {
                    if(err.response.status === 401){
                        navigate('/login');
                    }
                });
        }else{
            if(!user){
                navigate('/login');
            }
        }
        setLoading(false);
    }

    const setRating = (rating: number) => {
        setLoading(true);
        if(!user){
            navigate('/login');
        }
        if(!recipe){
            setLoading(false);
            return;
        }
        axios.post(`/api/recipe/create/rating`, {
            recipeId: recipe!!.id,
            score: rating,
        }, {withCredentials: true})
            .then((res) => {
                if(res.status === 200){
                    setUserRating(rating);
                }
            })
            .catch((err) => {
                console.log(err);
            });
        setLoading(false);
    }

    const addComment = () => {
        setLoading(true);
        if(!user){
            navigate('/login');
            setLoading(false);
            return;
        }
        if(!recipe){
            setLoading(false);
            return;
        }
        axios.post(`/api/recipe/create/comment`, {
            recipeId: recipe.id,
            content: commentContent,
        })
            .then((res) => {
                if(res.status === 200){
                    setRecipe({
                        ...recipe,
                        comments: [...recipe.comments, {id:0, username: user.username, content: commentContent}],
                    });
                    setCommentContent('');
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            }
        );
    }

    const groupTagsByType = (tags: Tag[]) => {
        const tagsByType: { [key: string]: Tag[] } = {};

        tags.forEach((tag) => {
            if (!tagsByType[tag.tagType]) {
                tagsByType[tag.tagType] = [];
            }

            tagsByType[tag.tagType].push(tag);
        });

        return tagsByType;
    }
    

    return (
        <>
            <Navbar user={user} setUser={setUser} />
            <div>
                {recipe && (
                    <div>
                        <h1>{recipe.name}</h1>
                        <p>{recipe.description}</p>
                        <p>{recipe.type}</p>
                    </div>
                )}
            </div>
            

            {recipe&&
            <>
            {/* Favorite Button */}
            <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={setAsFavorite}
                        disabled={loading}
                        color="inherit"
                    >
                        {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            {/* recipe rating */}
            <Typography variant="h5">Average Rating</Typography>
            <Rating name="recipe-rating" value={recipe.averageRating} readOnly />
            {/* user rating*/}
            <Typography variant="h5">Your Rating</Typography>
            <Rating name="user-rating" value={userRating} 
                onChange={
                    (event, newValue) => {setRating(newValue ? newValue : 0)}
                    } 
                disabled={loading}
            />

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
                        image={`/api/files/${recipe.images[index].imagePath}`}
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
        {/*Recipe Tags */}
        {recipe &&
            <>
            <Box mt={2}>
            <Typography variant="h5">Tags</Typography>
            {
                Object.entries(groupTagsByType(recipe.tags)).map(([tagType, tags], index) => (
                    <>
                    <div key={index}>
                        <Typography variant="button">{tagType}:</Typography>
                            {tags.map((tag, index) => (
                                <Chip key={index} label={tag.name} />
                            ))}
                    </div>
                </>))
            }
            </Box>
            </>
        }
        {/*Recipe Comments */}
        {recipe&&
            <>
            <Box 
                mt={2}
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                gap={2} 
            >
                <Typography variant="h5">Add Comment</Typography>
                    <TextField
                        label="Comment"
                        variant="outlined"
                        fullWidth
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        multiline
                        maxRows={3}
                        sx={{width: { xs: "100%", sm: "75%", md: "50%"}}}
                    />
                <Button onClick={() => {addComment()}} disabled={loading}>Add Comment</Button>
            </Box>
            <Box mt={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography variant="h5">Comments</Typography>
            {recipe.comments.map((comment) => (
                <Card key={comment.id} variant="outlined" sx={{width: { xs: "100%", sm: "75%", md: "50%"  }}}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {comment.username}
                        </Typography>
                        <Typography variant="body1">{comment.content}</Typography>
                    </CardContent>
                </Card>
            ))}
            </Box>
            </>
        }
        </>
    );
}

export default RecipePage;

