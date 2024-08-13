import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import BookIcon from '@mui/icons-material/AutoStories';

const Signup: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    phoneNumber: '',
    termsAccepted: false,
    isOwner: false, 
  });
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flex: 1, bgcolor: '#1a1a3d', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BookIcon sx={{ fontSize: 150, color: 'white' }} />
      </Box>
      <Box sx={{ flex: 1, p: 4, bgcolor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom color="textPrimary">Book Rent</Typography>
        <Typography variant="h6" gutterBottom color="textPrimary">Signup into Book Rent</Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
          <TextField
            fullWidth
            label="Email address"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            margin="normal"
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                name="termsAccepted"
                checked={form.termsAccepted}
                onChange={handleChange}
                required
              />
            }
            label="I accept the Terms and Conditions"
          />
         
          <Button fullWidth variant="contained" color="primary" type="submit">
            SIGN UP
          </Button>
        </form>
        <Typography color="textPrimary" variant="body2" align="center">
          Already have an account? <a href="/login">Login</a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;
