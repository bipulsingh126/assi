import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography } from '@mui/material';

export default function AuthLayout() {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5'
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={6} 
          sx={{ 
            p: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
            Admin Panel
          </Typography>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
} 