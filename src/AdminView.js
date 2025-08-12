import './App.css'
import * as React from 'react';


import OrderView from './OrderView';
import QrcodeView from './QrcodeView'
import { requestPermissionAndGetToken } from "./getFcmToken";
import { Button } from '@mui/material';
import { orderAPI } from './api';

  
const AdminView = ()=>{
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const enableNotifications = async () => {
    try {
      const fcmToken = await requestPermissionAndGetToken();
      if (fcmToken) {
        let data = {}
        data.deviceId = fcmToken;
        data.token = fcmToken;
        await addPushNotificationDevice(data);
        console.log("FCM Token:", fcmToken);
      } else {
        console.log("Permission not granted or no token received.");
      }
    } catch (err) {
      console.error("Error getting token", err);
    }
  };
  const addPushNotificationDevice = async (data) => {
    if (!data) {
      alert("Device data is empty!");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await orderAPI.registerPushNotificationDevice(data);
      if (response.status === 200 || response.status === 201) {
        alert("Device added successfully!");
        console.log('Device added:', response.data);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(`Error submitting order: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className='main-body'>
      <p className="admin-header" style={{alignSelf:'flex-start'}}>Welcome to Back Office</p>
      <Button variant='text' className='cart-submit-order-btn' onClick={enableNotifications}>{isSubmitting ? 'Please wait ...': 'Enable push notification'}</Button>
      <div className='admin-top-section-container'>
         <QrcodeView></QrcodeView>
         <OrderView selectedOrder={selectedOrder} orders={orders} setOrders={setOrders} setSelectedOrder={setSelectedOrder} />
      </div>
   </div>
  )
}
export default AdminView;
