import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AddIcon from '@mui/icons-material/Add';
//@ts-ignore
import logo from "../pages/logo.svg";
import { Link,useNavigate } from "react-router-dom";
import User from "../interfaces/user.tsx";
import axios from "axios";

interface NavbarProps {
    user: User | null;
    setUser: (user:User|null) => void;
}

/**
 * Navbar component that displays the navigation bar with links and user settings.
 * 
 * @component
 * @param {NavbarProps} props - The props for the Navbar component.
 * @param {object} props.user - The current user object.
 * @param {function} props.setUser - Function to update the current user state.
 * 
 * @returns {JSX.Element} The rendered Navbar component.
 * 
 * @example
 * <Navbar user={user} setUser={setUser} />
 * 
 * @remarks
 * - The component uses Material-UI components such as AppBar, Toolbar, Typography, Button, IconButton, and Menu.
 * - The component handles user login and logout, and navigation to different routes.
 * - If the user is an admin, an additional button to create a recipe is displayed.
 */
const Navbar:React.FC<NavbarProps> = ({ user, setUser }) =>{
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        navigate("/login");
        handleMenuClose();
    };

    const handleLogout = () => {
        axios.post('/api/auth/logout', {}, { withCredentials: true })
        .then((res) => {
            if(res.status === 200){
                setUser(null);
                navigate("/");
            }
        });
        handleMenuClose();
    };

    const redirectToRecipeCreateForm = () => {
        navigate("/recipe/create")
    }

    return (
        <AppBar position="static" color="primary">
        <Toolbar>
            {/* Logo */}
            <Typography variant="h6" component="div">
                <Link to="/">
                    <img src={logo} alt="logo" width="50" height="50" /> 
                </Link> 
            </Typography>

            {/* Navigation Links */}
            <Button color="inherit" href="/inspiration">
            Inspiration
            </Button>

            <Button color="inherit" href="/top10">
            Top 10
            </Button>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            </Typography>

            {/* User Settings */}
            {/* username */}
            {user && (
                <>
                {user.appUserRole === "ADMIN" && (
                    <IconButton
                        size="large"
                        aria-label="link to form"
                        aria-controls="menu-appbar"
                        aria-haspopup="false"
                        onClick={redirectToRecipeCreateForm}
                        color="inherit"
                    >
                        <AddIcon />
                    </IconButton>
                )}
                <Typography variant="button">
                    {user.username}
                </Typography>
                </>
            )}

            {/* Account Menu */}
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {user ? (
                <>
                    <MenuItem onClick={()=>{navigate("/userPage")}}>Your Account</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
                ) : (
                <MenuItem onClick={handleLogin}>Login</MenuItem>
                )}
            </Menu>
        </Toolbar>
        </AppBar>
    );
}

export default Navbar;