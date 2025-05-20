import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || { order: null };
  
  // If no order in state, show error
  if (!order) {
    return (
      <Container sx={{ mt: 12, mb: 5, textAlign: 'center' }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" color="error" gutterBottom>
            No order information found
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Return to Home
          </Button>
        </Paper>
      </Container>
    );
  }
  
  const { items, shipping, payment, createdAt } = order;
  const orderId = `ORD-${Math.floor(Math.random() * 10000)}-${new Date().getTime().toString().slice(-4)}`;
  const orderDate = new Date(createdAt).toLocaleDateString();
  
  return (
    <Container sx={{ mt: 12, mb: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom align="center">
            Order Confirmed!
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Thank you for your purchase. Your order has been received.
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Order #{orderId}</Typography>
          <Typography variant="body2" color="text.secondary">
            Placed on {orderDate}
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Grid container spacing={4}>
          {/* Order Summary */}
          <Grid item xs={12} md={7}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            
            <List disablePadding>
              {items.map((item, index) => (
                <ListItem key={index} sx={{ py: 1, px: 0 }}>
                  <ListItemText 
                    primary={item.name} 
                    secondary={`Size: ${item.size}, Color: ${item.color}, Quantity: ${item.quantity}`} 
                  />
                  <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                </ListItem>
              ))}
            </List>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>${payment.total}</Typography>
            </Box>
          </Grid>
          
          {/* Shipping & Payment Info */}
          <Grid item xs={12} md={5}>
            <Typography variant="h6" gutterBottom>Shipping Information</Typography>
            <Typography variant="body2" gutterBottom>
              {`${shipping.firstName} ${shipping.lastName}`}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {shipping.address}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {`${shipping.city}, ${shipping.state} ${shipping.zipCode}`}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {shipping.country}
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Payment Method</Typography>
              <Typography variant="body2">
                {payment.method === 'credit' ? 'Credit Card' : 'PayPal'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            size="large"
            onClick={() => navigate('/')}
            sx={{ mx: 1 }}
          >
            Continue Shopping
          </Button>
          <Button 
            variant="contained"
            size="large"
            onClick={() => navigate('/account/orders')}
            sx={{ mx: 1 }}
          >
            View All Orders
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderConfirmation;