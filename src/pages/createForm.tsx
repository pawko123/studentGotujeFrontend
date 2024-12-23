import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar.tsx";
import { useNavigate } from "react-router-dom";
import User from "../interfaces/user.tsx";
import axios from "axios";
import Ingredient from "../interfaces/ingredient.tsx";
import Tag from "../interfaces/tag.tsx";
import RecipeIngredient from "../interfaces/recipeIngredient.tsx";
import { Typography,Box,TextField,MenuItem,Autocomplete, Button,Stack } from "@mui/material";

function CreateForm(){

    const [user,setUser] = useState<User|null>(null);
    const navigate = useNavigate();
    const [loadingUser,setLoadingUser] = useState<boolean>(true);
    //database variables
    const [ingredients,setIngredients] = useState<Ingredient[]>([]);
    const [tags,setTags] = useState<Tag[]>([]);

    const availabletypes = ["BREAKFAST","DINNER","SUPPER"];
    //user defined
    const [name,setName] = useState<string>('');
    const [description,setDescription] = useState<string>('');
    const [type,setType] = useState<string>('');
    const [userTags,setUserTags] = useState<Tag[]>([]);
    const [userIngredients,setUserIngredients] = useState<RecipeIngredient[]>([]);
    const [images,setImages] = useState<File[]>([]);

    const [formErrors,setFormErrors] = useState<string[]>([]);

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

    const fetchIngredients = async () => {
        try{
            const res = await axios.get('/api/recipe/get/ingredients');
            if(res.status === 200){
                console.log(res.data);
                setIngredients(res.data);
            }else{
                setIngredients([]);
            }
        }catch(err){
            console.log(err);
            setIngredients([]);
        }
    }

    const fetchTags = async () => {
        try{
            const res = await axios.get('/api/recipe/get/tags');
            if(res.status === 200){
                console.log(res.data);
                setTags(res.data);
            }else{
                setTags([]);
            }
        }catch(err){
            console.log(err);
            setTags([]);
        }
    }

    const handleAddTag = (tag:Tag) => {
        setUserTags([...userTags, tag]);
    };

    const handleRemoveTag = (index: number) => {
        setUserTags(userTags.filter((_, i) => i !== index));
    };

    const handleTagChange = (index: number, value: Tag) => {
        const newTags = [...userTags];
        newTags[index] = value;
        setUserTags(newTags);
    };

    const handleAddIngredient = (ingredient:RecipeIngredient) => {
        console.log("adding ingredient");
        setUserIngredients([...userIngredients, ingredient]);
    };

    const handleRemoveIngredient = (index: number) => {
        console.log("removing ingredient");
        setUserIngredients(userIngredients.filter((_, i) => i !== index));
    };

    const handleIngredientChange = (index: number, value: RecipeIngredient) => {
        console.log("changing ingredient");
        const newIngredients = [...userIngredients];
        newIngredients[index] = value;
        setUserIngredients(newIngredients);
    };

    const sendRecipe = async (event:React.FormEvent) => {
        event.preventDefault();
        if(name === '' ){
            setFormErrors([...formErrors,'Name is empty']);
        }
        if(description === ''){
            setFormErrors([...formErrors,'Description is empty']);
        }
        if(type === ''){
            setFormErrors([...formErrors,'Type is empty']);
        }
        if(userTags.length === 0){
            setFormErrors([...formErrors,'Tags are empty']);
        }else{
            userTags.forEach((tag,index) => {
                if(tag.id === 0){
                    setFormErrors([...formErrors,'Tag nr'+(index+1)+' is empty']);
                }
            });
        }
        if(userIngredients.length === 0){
            setFormErrors([...formErrors,'Ingredients are empty']);
        }else{
            userIngredients.forEach((ingredient,index) => {
                if(ingredient.quantity === 0 || ingredient.quantityType === ''){
                    setFormErrors([...formErrors,'Ingredient nr'+(index+1)+' is not set properly']);
                }
            });
        }
        if(images.length !== 0){
            images.forEach((image) => {
                if(image.size > 1024 * 1024){
                    setFormErrors([...formErrors,'Image is too big. Should be less than 1MB']);
                }
                if(image.type !== 'image/jpeg' && image.type !== 'image/png'){
                    setFormErrors([...formErrors,'Image is not a jpeg or png']);
                }
            });
        }
        if(formErrors.length !== 0){
            return;
        }
        const formData = new FormData();
        formData.append('name',name);
        formData.append('description',description);
        formData.append('type',type);
        formData.append('tags',JSON.stringify(userTags));
        formData.append('ingredients',JSON.stringify(userIngredients));
        for(let i = 0; i < images.length; i++){
            formData.append('images',images[i]);
        }
        console.log(formData);
        try{
            const res = await axios.post('/api/recipe/create/recipe',formData,{withCredentials:true});
            if(res.status === 200){
                console.log(res.data);
            }else{
                console.log("error");
            }
        }catch(err){
            console.log(err);
        }
        //clear form
        setName('');
        setDescription('');
        setType('');
        setUserTags([]);
        setUserIngredients([]);
        setImages([]);
    }

    useEffect(() => {
        fetchUser();
        fetchIngredients();
        fetchTags();
    }, []);

    useEffect(()=>{
        if(!loadingUser){
            if(user === null ){
                navigate("/login");
            }
            if(user?.appUserRole !== "ADMIN"){
                navigate("/");
            }
        }
    },[loadingUser])

    return(
        <>
        <Navbar user = {user} setUser={setUser}/>
        <Typography variant="h1">Create Recipe Form</Typography>
        <Box component="form" onSubmit={sendRecipe} width={{xl:"50%",lg:"75%",md:"100%"}}>
            
            <TextField
                label="Recipe Name"
                variant="outlined"
                margin="normal"
                style={{width:"40%"}}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                label="Description"
                variant="outlined"
                margin="normal"
                multiline
                fullWidth
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
                id="outlined-select-type"
                select
                label="Recipe Type"
                defaultValue=""
                helperText="Please select type of recipe"
                onChange={(e) => setType(e.target.value)}
                >
                {availabletypes.map((type) => (
                    <MenuItem key={type} value={type}>
                        {type}
                    </MenuItem>
                ))}
            </TextField>
            {/*tags box */}
            <Box>
                <Typography variant="h5">Tags</Typography>
                {userTags.map((tag,index) => (
                    <>
                        <Autocomplete
                            key={index}
                            id = {"tag-select"+index}
                            options={tags}
                            autoHighlight
                            style={{width:"40%"}}
                            getOptionLabel={(option) => option.name}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    {option.name}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Choose Tag"
                                    variant="outlined"
                                    margin="normal"
                                />
                            )}
                            onChange={(event, value) => {
                                if(value !== null){
                                    handleTagChange(index, value);
                                }
                            }}
                        />
                        <Button onClick={() => handleRemoveTag(index)}>Remove Tag</Button>
                    </>
                ))}
                <Button 
                    onClick={() => handleAddTag({id:0,name:"",tagType:""})}>
                        Add Tag
                </Button>
            </Box>
            {/*ingredients box */}
            <Box>
                <Typography variant="h5">Ingredients</Typography>
                {userIngredients.map((ingredient,index) => (
                    <>
                        <Typography variant="h6">Ingredient nr{index+1}</Typography>
                        <Stack 
                            key={index} 
                            direction="row"
                            useFlexGap
                            sx={{flexWrap: 'wrap' }}> 
                            <Autocomplete
                                id = {"ingredient-select"+index}
                                options={ingredients}
                                autoHighlight
                                style={{width:"40%"}}
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.name}
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Choose Ingredient"
                                        variant="outlined"
                                        margin="normal"
                                    />
                                )}
                                value={ingredient.ingredient}
                                onChange={(event, value) => {
                                    if(value !== null){
                                        handleIngredientChange(index, { ...userIngredients[index], ingredient: value });
                                    }
                                }}
                                disableClearable
                            />
                            <TextField
                                label="Quantity"
                                variant="outlined"
                                margin="normal"
                                value={ingredient.quantity}
                                onChange={(e) =>{ 
                                    const value = parseInt(e.target.value);
                                    handleIngredientChange(index,{...ingredient,quantity:isNaN(value) ? 0 : value})
                                }}
                            />
                            <TextField
                                label="Quantity Type"
                                variant="outlined"
                                margin="normal"
                                value={ingredient.quantityType}
                                onChange={(e) => handleIngredientChange(index,{...ingredient,quantityType:e.target.value})}
                            />
                            <Button onClick={() => handleRemoveIngredient(index)}>Remove Ingredient</Button>
                        </Stack>
                    </>
                ))}
                <Button 
                    onClick={() => handleAddIngredient({ingredient: ingredients[0], quantity: 0, quantityType: ""})}>
                        Add Ingredient
                </Button>
            </Box>
            {/*images box */}
            <Box>
                <Typography variant="h5">Images</Typography>
                <input type="file" multiple onChange={(e) =>{
                    if (e.target.files) {
                        console.log(e.target.files);
                        setImages(Array.from(e.target.files));
                    }
                }}/>
            </Box>
            <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                >
                    Submit
            </Button>
        </Box>
        </>
    )
}

export default CreateForm;