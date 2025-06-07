import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Box, Button, TextField, Typography, 
  Alert, CircularProgress 
} from '@mui/material';
import { authAPI } from '../services/api';

export default function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (!formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      // Call login API
      const response = await authAPI.login(formData);
      
      if (!response || !response.token) {
        throw new Error('Invalid response from server');
      }
      
      // Store token in localStorage
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Update auth state
      setIsAuthenticated(true);
      
      // Redirect to dashboard
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password');
      // Clear any potentially corrupt tokens
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={formData.email}
        onChange={handleChange}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Sign In'}
      </Button>
      
      <Typography variant="body2" align="center">
        Don't have an account?{' '}
        <Link to="/register" style={{ textDecoration: 'none' }}>
          Sign Up
        </Link>
      </Typography>
    </Box>
  );
} 