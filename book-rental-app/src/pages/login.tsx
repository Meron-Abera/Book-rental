import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import BookIcon from '@mui/icons-material/AutoStories';

const Login: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const { token, role } = await response.json();
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role); 

        if (role === 'owner') {
          router.push('/OwnerDashboard');
        } else if (role === 'admin') {
          router.push('/Admindashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('An unexpected error happened:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flex: 1, bgcolor: '#1a1a3d', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BookIcon sx={{ fontSize: 150, color: 'white' }} />
      </Box>
      <Box sx={{ flex: 1, p: 4, bgcolor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom color="textPrimary">Book Rent</Typography>
        <Typography variant="h6" gutterBottom color="textPrimary">Login to Book Rent</Typography>
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
          <Button fullWidth variant="contained" color="primary" type="submit">
            LOGIN
          </Button>
        </form>
        <Typography variant="body2" align="center" color="textPrimary">
          Don't have an account? <a href="/signup">Signup</a>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
