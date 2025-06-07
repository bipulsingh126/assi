import { useState, useEffect } from 'react';
import { 
  Typography, Grid, Paper, Box, 
  Card, CardContent, CardHeader,
  LinearProgress
} from '@mui/material';
import {
  ShoppingCart as OrderIcon,
  Inventory as ProductIcon,
  Person as UserIcon,
  AttachMoney as RevenueIcon
} from '@mui/icons-material';
import { dashboardAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    users: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await dashboardAPI.getStats();
        setStats({
          orders: response.data.orders,
          products: response.data.products,
          users: response.data.users,
          revenue: response.data.revenue
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    { title: 'Total Orders', value: stats.orders, icon: <OrderIcon fontSize="large" color="primary" /> },
    { title: 'Total Products', value: stats.products, icon: <ProductIcon fontSize="large" color="secondary" /> },
    { title: 'Total Users', value: stats.users, icon: <UserIcon fontSize="large" color="success" /> },
    { title: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: <RevenueIcon fontSize="large" color="warning" /> }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper elevation={3} sx={{ height: '100%' }}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader
                    title={card.title}
                    action={card.icon}
                  />
                  <CardContent>
                    <Typography variant="h4">
                      {card.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          ))}
          
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body1">
                Welcome to your admin dashboard! You can manage products, view orders, and more.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
} 