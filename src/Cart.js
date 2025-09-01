import React, { useState } from 'react';
import './App.css'
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  IconButton, 
  Divider, 
  Alert,
  Fade,
  Zoom,
  Skeleton
} from '@mui/material';
import { 
  Delete, 
  ShoppingCart, 
  Receipt, 
  CheckCircle
} from '@mui/icons-material';
import { formatPrice } from './utils';
import { orderAPI } from './api';

const Cart = (props) => {
  const cartItems = props.cartItems;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const itemCount = cartItems ? cartItems.reduce((total, item) => total + (item.quantity || 0), 0) : 0;

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const submitOrder = async () => {
    if (!cartItems || cartItems.length === 0) {
      alert("No items in cart to submit!");
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const tableNumber = params.get("tableNumber");
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const orderData = {
        tableNumber: tableNumber,
        items: cartItems,
        totalPrice: calculateTotalPrice(),
        itemCount: itemCount,
        orderDate: new Date().toISOString(),
        status: 'pending'
      };
      console.log(orderData, "Order data");
      console.log('Cart: Submitting order...', orderData);
      const response = await orderAPI.submitOrder(orderData);
      console.log('Cart: Order submission response:', response);

      if (response.status === 200 || response.status === 201) {
        alert("Order submitted successfully!");
        props.clearCart();
        console.log('Cart: Order submitted successfully:', response.data);
        
        // Wait a moment for server to process and send notification
        console.log('Cart: Waiting for server to send notification...');
        setTimeout(() => {
          console.log('Cart: Check AdminView for notifications now');
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setSubmitError(error.message || 'Failed to submit order. Please try again.');
      alert(`Error submitting order: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasItems = cartItems && cartItems.length > 0;

  const renderCartItem = (item, index) => (
    <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
      <Card 
        key={index}
        sx={{ 
          mb: 2, 
          borderRadius: 2,
          border: '1px solid rgba(109, 238, 126, 0.1)',
          '&:hover': {
            borderColor: 'rgba(109, 238, 126, 0.3)',
            boxShadow: '0 4px 12px rgba(109, 238, 126, 0.15)',
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  fontFamily: 'Raleway',
                  color: '#2c3e50',
                  mb: 0.5
                }}
              >
                {item.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  label={`Qty: ${item.quantity}`}
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(109, 238, 126, 0.1)',
                    color: '#6dee7e',
                    fontWeight: 600,
                    fontSize: '0.75rem'
                  }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#7f8c8d',
                    fontFamily: 'Raleway'
                  }}
                >
                  {formatPrice(item.price)} each
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#6dee7e',
                  fontFamily: 'Raleway'
                }}
              >
                {formatPrice(item.price * item.quantity)}
              </Typography>
              <IconButton
                onClick={() => props.handleDelete(index)}
                sx={{ 
                  color: '#e74c3c',
                  '&:hover': {
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                  }
                }}
                size="small"
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );

  return (
    <Card 
      className='enhanced-cart'
      sx={{
        position: 'sticky',
        top: '20px',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        zIndex: 1000,
        borderRadius: 3,
        border: '1px solid rgba(109, 238, 126, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3,
          pb: 2,
          borderBottom: '2px solid rgba(109, 238, 126, 0.1)'
        }}>
          <ShoppingCart sx={{ color: '#6dee7e', fontSize: 28 }} />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              fontFamily: 'Raleway',
              color: '#2c3e50'
            }}
          >
            Your Order
          </Typography>
          {itemCount > 0 && (
            <Chip 
              label={itemCount}
              sx={{ 
                backgroundColor: '#6dee7e',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.875rem'
              }}
            />
          )}
        </Box>

        {/* Cart Items */}
        {!hasItems ? (
          <Fade in={true}>
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              color: '#7f8c8d'
            }}>
              <ShoppingCart sx={{ fontSize: 48, color: '#bdc3c7', mb: 2 }} />
              <Typography variant="h6" sx={{ fontFamily: 'Raleway', fontWeight: 500, mb: 1 }}>
                Your cart is empty
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'Raleway' }}>
                Add some delicious items to get started!
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Box sx={{ mb: 3 }}>
            {cartItems.map((item, index) => renderCartItem(item, index))}
          </Box>
        )}

        {/* Error Display */}
        {submitError && (
          <Fade in={true}>
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => setSubmitError(null)}
            >
              {submitError}
            </Alert>
          </Fade>
        )}

        {/* Total and Submit */}
        {hasItems && (
          <Fade in={true}>
            <Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Receipt sx={{ color: '#6dee7e' }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      fontFamily: 'Raleway',
                      color: '#2c3e50'
                    }}
                  >
                    Total Amount
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800, 
                    fontFamily: 'Raleway',
                    color: '#6dee7e'
                  }}
                >
                  £{formatPrice(calculateTotalPrice())}
                </Typography>
              </Box>
              
              <Button 
                variant="contained"
                fullWidth
                size="large"
                onClick={submitOrder} 
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#6dee7e',
                  color: 'white',
                  fontWeight: 700,
                  fontFamily: 'Raleway',
                  fontSize: '1.1rem',
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#5dd86e',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(109, 238, 126, 0.3)',
                  },
                  '&:disabled': {
                    backgroundColor: '#bdc3c7',
                    transform: 'none',
                    boxShadow: 'none',
                  },
                  transition: 'all 0.3s ease'
                }}
                startIcon={isSubmitting ? <Skeleton variant="circular" width={20} height={20} /> : <CheckCircle />}
              >
                {isSubmitting ? 'Submitting Order...' : 'Submit Order'}
              </Button>
            </Box>
          </Fade>
        )}
      </CardContent>
    </Card>
  );
};

export default Cart;