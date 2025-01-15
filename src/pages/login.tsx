import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Container, Box } from '@mui/material';

/**
 * Login component renders a login form with email and password fields.
 * It handles form submission, performs login via an API call, and navigates to the home page upon successful login.
 * Displays error messages for invalid credentials or other errors.
 *
 * @component
 * @example
 * return (
 *   <Login />
 * )
 *
 * @returns {JSX.Element} The rendered login form component.
 */
function Login() {
    const navigate = useNavigate();
  
  // State for handling form inputs and error messages
  const [email, setEmail] = useState<String>('');
  const [password, setPassword] = useState<String>('');
  const [error, setError] = useState<String|null>(null);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setError(null);

    try {
        const response = await axios.post('/api/auth/login', 
            { email, password }, 
            { withCredentials: true }
        );

        if (response.status === 200) { 
            navigate('/'); // Navigate to home or another route after successful login
        }
    } catch (err) {
        if (err.response && err.response.status === 401) {
            // Invalid credentials
            setError('Invalid email or password');
        } else {
            // Other errors
            setError('An error occurred. Please try again.');
        }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>

        {/* Error Message */}
        {error && <Typography color="error" variant="body2" gutterBottom>{error}</Typography>}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>

        {/* Optionally, add a "Sign Up" link */}
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Don't have an account? <a href="/register" style={{ textDecoration: 'none' }}>Sign Up</a>
          </Typography>
        </Box>
        {/* Optionally, add a "Forgot Password" link */}
        <Box sx={{ marginTop: 1 }}>
          <Typography variant="body2" color="textSecondary">
            <a href="/resetPasswordEmail" style={{ textDecoration: 'none' }}>Forgot Password</a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;