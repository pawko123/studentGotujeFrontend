import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';

function ResetPasswordEmailPage(){
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/resetPasswordEmail', { email });
      setMessage(response.data); // Success message
    } catch (error) {
      setMessage("Email not found or failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Reset Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {loading ? <CircularProgress size={24} /> : "Send Reset Email"}
        </Button>
      </form>
      {message && (
        <Typography variant="body2" color={message.includes("failed") ? "error" : "success"}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default ResetPasswordEmailPage;