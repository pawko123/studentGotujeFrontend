import React,{useState,useEffect} from 'react';
import "./App.css"
import axios from 'axios';
import Navbar from '../components/navbar.tsx';
import useAuth from '../hooks/useAuth.tsx';
import Recipe from '../interfaces/recipe.tsx';
import RecipeCard from '../components/recipeCard.tsx';
import { Grid,Stack,Chip,Button,Typography,Box,TextField,FormControlLabel,Checkbox,FormControl,InputLabel,Select,MenuItem } from '@mui/material';
import Tag from '../interfaces/tag.tsx';

/**
 * The Main component is the primary page for displaying and searching recipes.
 * It fetches initial data for recipes, tags, and recipe types from the server
 * and allows users to search for recipes based on various criteria.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <Main />
 *
 * @remarks
 * This component uses several hooks:
 * - `useAuth` to get the current user and set user state.
 * - `useState` to manage state for recipes, tags, recipe types, search criteria, and sorting order.
 * - `useEffect` to fetch initial data from the server.
 *
 * The component includes a search form with fields for recipe name, type, and tags,
 * as well as a checkbox to sort results by rating. The search results are displayed
 * as a grid of RecipeCard components.
 */
function Main() {
    const [user, setUser] = useAuth();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [recipeTypes, setRecipeTypes] = useState<string[]>([]);
    const [recipeName, setRecipeName] = useState<string>('');
    const [recipeType, setRecipeType] = useState<string>('');
    const [recipeTags, setRecipeTags] = useState<Tag[]>([]);
    const [orderBy, setOrderBy] = useState<boolean>(false);

    useEffect(() => {
        axios.get('/api/recipe/get/recipes')
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
        axios.get('/api/recipe/get/tags')
            .then((res) => {
                if(res.status === 200){
                    console.log(res.data);
                    setTags(res.data);
                }else{
                    setTags([]);
                }
            })
            .catch((err) => {
                console.log(err);
                setTags([]);
            });
        axios.get('/api/recipe/get/recipeTypes')
            .then((res) => {
                if(res.status === 200){
                    setRecipeTypes(res.data);
                }else{
                    setRecipeTypes([]);
                }
            })
            .catch((err) => {
                console.log(err);
                setRecipeTypes([]);
            });
    }, []);

    const handleSearch = () => {

        const data: any = {};

        if (recipeName !== '') {
            data.name = recipeName;
        }
        if (recipeType !== '') {
            data.type = recipeType;
        }
        if (recipeTags.length > 0) {
            data.tags = recipeTags;
        }
        data.sortByRatingDesc = orderBy ? 1 : 0;

        axios.post('/api/recipe/get/recipeSearch',{
            ...data
        })
            .then((res) => {
                if(res.status === 200){
                    setRecipes(res.data);
                }else{
                    setRecipes([]);
                }
            })
            .catch((err) => {
                console.log(err);
            }
    )};

    const handleTagClick = (tag: Tag) => {
        setRecipeTags((prevTags) => {
          if (prevTags.some((t) => t.id === tag.id)) {
            // Remove tag if already selected
            return prevTags.filter((t) => t.id !== tag.id);
          } else {
            // Add tag if not selected
            return [...prevTags, tag];
          }
        });
      };
    
    const isTagSelected = (tag: Tag) =>
        recipeTags.some((t) => t.id === tag.id);

    useEffect(() => {
        console.log(recipeTags);
    }, [recipeTags]);

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
        <Navbar user={user} setUser={setUser}/>
        <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
                <Box component="form" sx={{ p: 2 }}>
                    <Typography variant="h6">Search Criteria</Typography>
                    <TextField
                        label="Recipe Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={recipeName}
                        onChange={(e) => setRecipeName(e.target.value)}
                    />
                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel>Recipe Type</InputLabel>
                        <Select
                            value={recipeType}
                            onChange={(e) => setRecipeType(e.target.value)}
                            label="Recipe Type"
                        >
                            {recipeTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Typography variant="h6">Tags</Typography>
                    {Object.entries(groupTagsByType(tags)).map(([tagType, tags]) => (
                        <>
                        <Typography key={tagType} variant="subtitle1">{tagType}</Typography>
                        <Stack
                            direction="row"
                            useFlexGap
                            sx={{flexWrap: 'wrap' }}> 
                        {tags.map((tag) => (
                            <Chip
                                key={tag.id}
                                label={tag.name}
                                onClick={() => handleTagClick(tag)}
                                clickable
                                color={isTagSelected(tag) ? 'primary' : 'default'}
                                variant={isTagSelected(tag) ? 'filled' : 'outlined'}
                            />
                        ))}
                        </Stack>
                        </>
                    ))}
                    <FormControlLabel
                            control={
                                <Checkbox
                                    checked={orderBy}
                                    onChange={(e) => setOrderBy(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Sort by top rated"
                        />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSearch}
                        sx={{ mt: 2 }}
                    >
                        Search
                    </Button>
                </Box>
            </Grid>
            <Grid container spacing={2} item xs={12} md={9}>
                {recipes.map((recipe) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={recipe.id}>
                        <RecipeCard recipe={recipe} />
                    </Grid>
                ))}
            </Grid>
        </Grid>
        </>
    );
}

export default Main;