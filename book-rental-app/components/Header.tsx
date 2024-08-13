import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      
      localStorage.removeItem('authToken'); 

      
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        borderRadius: 4,   
        mb: 6,      
        bgcolor: '#FFFFFF',       
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'black' }}>
          Dashboard
        </Typography>
        <Button sx={{ color: 'blue' }} onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
