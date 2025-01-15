import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";


/**
 * The Register component renders a registration form with fields for username, email, password, and repeat password.
 * It includes client-side validation and integrates with Google reCAPTCHA for bot protection.
 * 
 * State:
 * - `username`: The username input value.
 * - `email`: The email input value.
 * - `password`: The password input value.
 * - `repeatPassword`: The repeat password input value.
 * - `error`: Error message to display if validation or registration fails.
 * - `success`: Success message to display if registration is successful.
 * 
 * Methods:
 * - `handleSubmit`: Handles form submission, performs client-side validation, executes reCAPTCHA, and sends registration data to the server.
 * 
 * Dependencies:
 * - `useGoogleReCaptcha`: Hook to execute Google reCAPTCHA.
 * - `axios`: HTTP client for making API requests.
 * 
 * @returns {JSX.Element} The rendered registration form component.
 */
function Register() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!username || !email || !password || !repeatPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    if(!executeRecaptcha){
        setError("reCAPTCHA not loaded. Please try again.");
        return;
    }

    try {
        // Execute reCAPTCHA and get the token
      const token = await executeRecaptcha("register_action");

      if (!token) {
        setError("Failed to validate reCAPTCHA. Please try again.");
        return;
      }

      const captchaResponse = await axios.post(`/api/auth/verifyCaptcha?token=${token}`);
      console.log(captchaResponse.data);
      
      if(captchaResponse.data === "Success"){
        console.log("Captcha verified successfully");
        const response = await axios.post("/api/auth/register", {
            username,
            email,
            password,
            repeatPassword,
        });

        console.log(response);
        if (response.status === 200) {
            setSuccess("Registration successful!");
            setUsername("");
            setEmail("");
            setPassword("");
            setRepeatPassword("");
        }
      }else{
        setError("Failed to validate reCAPTCHA. Please try again.");
        setUsername("");
        setEmail("");
        setPassword("");
        setRepeatPassword("");
      }

    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
        >
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="repeatPassword"
            label="Repeat Password"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;