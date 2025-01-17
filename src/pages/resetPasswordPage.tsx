import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { useLocation,useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

/**
 * ResetPasswordPage component allows users to reset their password.
 * 
 * This component handles the following:
 * - Capturing and validating new password and confirmation password inputs.
 * - Displaying appropriate messages for various states (e.g., passwords do not match, invalid token, etc.).
 * - Integrating with Google reCAPTCHA for bot protection.
 * - Making API calls to verify reCAPTCHA and reset the password.
 * - Redirecting users to the login page upon successful password reset.
 * 
 * @component
 * @returns {JSX.Element} The rendered ResetPasswordPage component.
 * 
 * @example
 * // Usage example:
 * <ResetPasswordPage />
 * 
 * @remarks
 * This component uses the following hooks:
 * - `useState` to manage password, repeatPassword, message, and loading states.
 * - `useLocation` to access the query parameters from the URL.
 * - `useNavigate` to programmatically navigate to the login page.
 * - `useGoogleReCaptcha` to execute the reCAPTCHA verification.
 * - `useEffect` to check the validity of the token on component mount.
 * 
 * @requires axios for making HTTP requests.
 * @requires @mui/material components for UI elements.
 * @requires react-google-recaptcha-v3 for reCAPTCHA integration.
 */
function ResetPasswordPage(){
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or expired token");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== repeatPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    if(!executeRecaptcha){
        setMessage("reCAPTCHA not loaded. Please try again.");
        return;
    }

    try {

      const captchaToken = await executeRecaptcha("register_action");

      if (!token) {
        setMessage("Failed to validate reCAPTCHA. Please try again.");
        return;
      }

      const captchaResponse = await axios.post(`/api/auth/verifyCaptcha?token=${captchaToken}`);
      console.log(captchaResponse.data);
      
      const response = await axios.post(
        '/api/auth/reset',
        { password, repeatPassword },
        { params: { token } }
      );
      setMessage(response.data); // Success message
      if (response.status === 200) {
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      setMessage("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Reset Your Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          required
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Reset Password"}
        </Button>
      </form>
      {message && (
        <Typography variant="body2" color={message.includes("failed") || message === "Passwords do not match" ? "error" : "success"}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default ResetPasswordPage;