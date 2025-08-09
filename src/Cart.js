import React, { useState } from 'react';
import './App.css'
import { Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
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
      const response = await orderAPI.submitOrder(orderData);

      if (response.status === 200 || response.status === 201) {
        alert("Order submitted successfully!");
        props.clearCart();
        console.log('Order submitted:', response.data);
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

  return (
    <div className='cart'>
      <p className='cart-header'>Selected Meal (s)</p>
      <div className='cart-item-header'>
      <p className='cart-item-name'><b>Name</b></p>
       <p className='cart-item-quatity'><b>Quantity</b></p>
       <p className='cart-item-price'><b>Price: &#163;</b></p>
      </div>
      {cartItems.map((item, index) => (
     <div className='cart-item' key={index}>
       <p className='cart-item-name'>{item.name}</p>
       <p className='cart-item-quatity'>{item.quantity}</p>
       <p className='cart-item-price'>{formatPrice(item.price)}</p>
       <Delete fontSize='5px' onClick={() => props.handleDelete(index)} />
     </div>
      ))}
      
      <div className='cart-submit-order'>
      <p className='cart-total-amount'>Total: &#163;{formatPrice(calculateTotalPrice())}</p>
      {submitError && (
        <p style={{ color: 'red', fontSize: '12px', margin: '5px 0' }}>
          {submitError}
        </p>
      )}
      <Button 
        variant='text' 
        className={hasItems ? 'cart-submit-order-btn' : 'cart-submit-order-btn-disabled'} 
        onClick={submitOrder} 
        disabled={!hasItems || isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
      </div>
    </div>
  );
};

export default Cart;