import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
//@ts-ignore
import logo from "../pages/logo.svg";
import { Link,useNavigate } from "react-router-dom";
import User from "../interfaces/user.tsx";
import axios from "axios";

interface NavbarProps {
    user: User | null;
    setUser: (user:User|null) => void;
}

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
        axios.post('http://localhost:8080/auth/logout', {}, { withCredentials: true })
        .then((res) => {
            if(res.status === 200){
                setUser(null);
            }
        });
        handleMenuClose();
    };

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

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            </Typography>

            {/* User Settings */}
            {/* username */}
            {user && (
            <Typography variant="button">
                {user.username}
            </Typography>
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
                    <MenuItem onClick={handleMenuClose}>Your Account</MenuItem>
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