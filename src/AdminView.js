import './App.css'
import * as React from 'react';


import OrderView from './OrderView';
import QrcodeView from './QrcodeView'
import { requestPermissionAndGetToken, listenForForegroundMessages } from "./getFcmToken";
import { Button, Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { orderAPI } from './api';
import NotificationsIcon from '@mui/icons-material/Notifications';

  
const AdminView = ()=>{
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [orders, setOrders] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);

  // Listen for incoming push notifications
  React.useEffect(() => {
    const unsubscribe = listenForForegroundMessages((payload) => {
      console.log('Received foreground message:', payload);
      
      const newNotification = {
        id: Date.now(),
        title: payload.notification?.title || 'New Notification',
        body: payload.notification?.body || 'You have a new message',
        timestamp: new Date().toLocaleTimeString(),
        data: payload.data || {},
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => unsubscribe();
  }, []);

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

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className='main-body'>
      <p className="admin-header" style={{alignSelf:'flex-start'}}>Welcome to Back Office</p>
      
      {/* Notifications Section */}
      <Box sx={{ mb: 2, width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <NotificationsIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2">
            Push Notifications ({unreadCount} unread)
          </Typography>
        </Box>
        
        {notifications.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No notifications yet. Enable push notifications to start receiving messages.
          </Typography>
        ) : (
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                sx={{ 
                  mb: 1, 
                  borderLeft: notification.read ? 'none' : '4px solid #1976d2',
                  backgroundColor: notification.read ? 'background.paper' : '#f3f8ff'
                }}
              >
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" component="h3" sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {notification.body}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.timestamp}
                      </Typography>
                      {Object.keys(notification.data).length > 0 && (
                        <Typography variant="caption" display="block" sx={{ mt: 1, fontFamily: 'monospace' }}>
                          Data: {JSON.stringify(notification.data)}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {!notification.read && (
                        <IconButton 
                          size="small" 
                          onClick={() => markNotificationAsRead(notification.id)}
                          sx={{ color: 'primary.main' }}
                        >
                          ✓
                        </IconButton>
                      )}
                      <IconButton 
                        size="small" 
                        onClick={() => clearNotification(notification.id)}
                        sx={{ color: 'error.main' }}
                      >
                        ×
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      <Button variant='text' className='cart-submit-order-btn' onClick={enableNotifications}>
        {isSubmitting ? 'Please wait ...': 'Enable push notification'}
      </Button>
      
      <div className='admin-top-section-container'>
         <QrcodeView></QrcodeView>
         <OrderView selectedOrder={selectedOrder} orders={orders} setOrders={setOrders} setSelectedOrder={setSelectedOrder} />
      </div>
   </div>
  )
}
export default AdminView;
