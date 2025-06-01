import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Added
import { createOrder } from '../services/orderService'; // Added
// import { sendOrderToQueue } from '../services/queueService'; // Removed

const CheckoutPage = () => { // Removed cartItems, clearCart props
  const { user, getAccessToken } = useAuth();
  const { cartItems, cartTotal, clearCart: clearCartFromContext, itemCount } = useCart(); // Added
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.given_name || user?.name?.split(' ')[0] || '', // Updated to use given_name
    lastName: user?.family_name || user?.name?.split(' ')[1] || '', // Updated to use family_name
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0); // Removed, use cartTotal
  const shipping = 10; // Fixed shipping cost
  const tax = cartTotal * 0.08; // 8% tax, uses cartTotal
  const total = cartTotal + shipping + tax; // uses cartTotal
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && itemCount > 0) { // Use itemCount from context
      // Save current cart to session storage before redirecting
      navigate('/login', { state: { from: '/checkout', message: 'Please log in to complete your purchase' } });
    }
  }, [user, navigate, itemCount]); // Use itemCount
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    if (!user) {
      setError('You must be logged in to place an order.');
      setIsSubmitting(false);
      navigate('/login', { state: { from: '/checkout', message: 'Please log in to complete your purchase' } });
      return;
    }

    if (itemCount === 0) { // Use itemCount from context
      setError('Your cart is empty');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const token = await getAccessToken(); // Get token first
      // Create order payload according to C# Order model & orderService requirements
      const orderPayload = {
        orderDate: new Date().toISOString(),
        userId: user.sub, 
        productIds: cartItems.map(item => item.productId || item.id), // Handle variations
        quantities: cartItems.map(item => item.quantity),
      };
      
      // Send to backend using createOrder
      const response = await createOrder(orderPayload, token); 
      
      // Show success and clear cart
      setSuccess(true);
      clearCartFromContext(); // Use clearCart from context
      
      // Redirect after a short delay, passing the original frontend order/cart details for confirmation page
      const confirmationOrderData = {
        ...orderPayload, // The data sent to backend
        shippingInfo, // For display on confirmation page
        paymentMethod, // For display on confirmation page
        items: cartItems, // For display on confirmation page
        total: total.toFixed(2), // For display on confirmation page
        backendResponse: response // Include backend response (e.g., order ID from DB)
      };

      setTimeout(() => {
        navigate('/order-confirmation', { state: { order: confirmationOrderData } });
      }, 2000);
    } catch (err) {
      console.error('Checkout error:', err);
      setError('There was a problem processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (itemCount === 0 && !isSubmitting && !success) { // Use itemCount
    return (
      <Container sx={{ mt: 12, mb: 5 }}>
        <Typography variant="h4" gutterBottom>Checkout</Typography>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Your cart is empty</Typography>
          <Button 
            variant="outlined" 
            sx={{ mt: 2 }} 
            onClick={() => navigate('/collections')}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 12, mb: 5 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      
      <Grid container spacing={3}>
        {/* Order Summary */}
        <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom>Order Summary</Typography>
            <Box sx={{ mb: 3 }}>
              {cartItems.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    {item.productName || item.name} x{item.quantity} ({item.size}, {item.color}) {/* Handle variations */}
                  </Typography>
                  <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal</Typography>
              <Typography>${cartTotal.toFixed(2)}</Typography> {/* Use cartTotal */}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping</Typography>
              <Typography>${shipping.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Estimated Tax</Typography>
              <Typography>${tax.toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${total.toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>
        
        {/* Checkout Form */}
        <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
          <Paper sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" gutterBottom>Shipping Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="City"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="State/Province"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Zip/Postal Code"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={shippingInfo.country}
                      name="country"
                      onChange={handleInputChange}
                    >
                      <MenuItem value="United States">United States</MenuItem>
                      <MenuItem value="Canada">Canada</MenuItem>
                      <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Payment Method</Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <MenuItem value="credit">Credit Card</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                </Select>
              </FormControl>
              
              {paymentMethod === 'credit' && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Expiration Date"
                      placeholder="MM/YY"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="CVV"
                      placeholder="123"
                    />
                  </Grid>
                </Grid>
              )}
              
              <Box sx={{ mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    `Place Order - $${total.toFixed(2)}`
                  )}
                </Button>
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success">
          Your order has been placed successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CheckoutPage;