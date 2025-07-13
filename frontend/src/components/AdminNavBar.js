import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const AdminNavBar = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="nav"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        backgroundColor: '#fff',
      }}
    >
      {/* Top-left: Go to Dashboard with arrow */}
      <Button
        onClick={() => navigate('/admin-home')}
        sx={{
          textTransform: 'none',
          background: 'linear-gradient(to right, #4a00e0, #8e2de2)',
          color: 'white',
          fontWeight: 'bold',
          px: 3,
          py: 1.5,
          borderRadius: 2,
          '&:hover': {
            background: 'linear-gradient(to right, #3a00c0, #6e1cd2)',
          },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <ArrowBackIcon /> Go to Dashboard
      </Button>

      {/* Top-right: Home icon inside gradient container */}
      <Box
        sx={{
          background: 'linear-gradient(to right, #4a00e0, #8e2de2)',
          p: 0.7,
          borderRadius: '20%',
        }}
      >
        <IconButton onClick={() => navigate('/')} sx={{ color: 'white' }}>
          <HomeIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AdminNavBar;
