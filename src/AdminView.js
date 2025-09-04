import './App.css'
import React, { useState, useEffect } from 'react';

import OrderView from './OrderView';
import QrcodeView from './QrcodeView'
import oneSignalService from "./oneSignalService";
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton, 
  Chip,
  Fade,
  Zoom,
  Skeleton
} from '@mui/material';
import { 
  Notifications, 
  AdminPanelSettings, 
  CheckCircle, 
  Error,
  Info,
  Warning
} from '@mui/icons-material';
import { orderAPI } from './api';

const AdminView = ()=>{
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Listen for incoming push notifications
  useEffect(() => {
    console.log('AdminView: Setting up notification listener...');
    
    // Wait for OneSignal to be ready and set up listeners
    const initializeOneSignal = async () => {
      try {
        console.log('AdminView: Waiting for OneSignal to be ready...');
        const ready = await oneSignalService.waitForReady();
        
        if (!ready) {
          console.error('AdminView: OneSignal not ready, retrying in 3 seconds...');
          setTimeout(initializeOneSignal, 3000);
          return;
        }

        console.log('AdminView: OneSignal is ready, setting up listeners...');
        
        // Test notification detection first
        const testResult = oneSignalService.testNotificationDetection();
        console.log('AdminView: Notification detection test result:', testResult);
        
        oneSignalService.setupNotificationListeners((notificationData) => {
          console.log('🔔 AdminView: Received OneSignal notification:', notificationData);
          
          const newNotification = {
            id: Date.now(),
            title: notificationData.data?.title || notificationData.data?.heading || 'New Notification',
            body: notificationData.data?.body || notificationData.data?.content || 'You have a new message',
            timestamp: new Date().toLocaleTimeString(),
            data: notificationData.data || {},
            read: false
          };
          
          console.log('AdminView: Adding new OneSignal notification:', newNotification);
          setNotifications(prev => [newNotification, ...prev]);
        });
        
        // Also force setup additional listeners for debugging
        oneSignalService.forceSetupNotificationListeners((notificationData) => {
          console.log('🔔 AdminView: Received notification via force setup:', notificationData);
        });
      } catch (error) {
        console.error('AdminView: Error setting up OneSignal:', error);
        // Retry after 3 seconds
        setTimeout(initializeOneSignal, 3000);
      }
    };

    initializeOneSignal();
  
    console.log('AdminView: Notification listener set up successfully');
  }, []);
  

  const enableNotifications = async () => {
    console.log("enableNotifications function called.");
    try {
      // Wait for OneSignal to be ready
      const ready = await oneSignalService.waitForReady();
      if (!ready) {
        console.error("OneSignal not ready");
        return;
      }

      // Get player ID with retry
      let playerId = await oneSignalService.getPlayerId();
      if (!playerId) {
        console.log("Player ID not available immediately, trying refresh method...");
        playerId = await oneSignalService.refreshPlayerId();
      }
      
      if (playerId) {
        console.log("OneSignal Player ID:", playerId);
        
        // Store player ID for server-side notifications
        let data = {};
        data.deviceId = playerId;
        data.token = playerId;
        await addPushNotificationDevice(data);
        console.log("OneSignal Player ID stored:", playerId);
      } else {
        console.log("OneSignal Player ID not available after retry");
      }
    } catch (err) {
      console.error("Error with OneSignal setup", err);
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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle sx={{ color: '#27ae60' }} />;
      case 'error':
        return <Error sx={{ color: '#e74c3c' }} />;
      case 'warning':
        return <Warning sx={{ color: '#f39c12' }} />;
      default:
        return <Info sx={{ color: '#3498db' }} />;
    }
  };

  const renderNotification = (notification) => (
    <Zoom in={true} key={notification.id}>
      <Card 
        sx={{ 
          mb: 2, 
          borderRadius: 3,
          border: notification.read ? '1px solid rgba(0,0,0,0.1)' : '2px solid #1976d2',
          backgroundColor: notification.read ? 'background.paper' : 'rgba(25, 118, 210, 0.05)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                {getNotificationIcon(notification.type)}
                <Typography 
                  variant="subtitle1" 
                  component="h3" 
                  sx={{ 
                    fontWeight: notification.read ? 500 : 700, 
                    color: notification.read ? 'text.secondary' : 'text.primary',
                    fontFamily: 'Raleway'
                  }}
                >
                  {notification.title}
                </Typography>
                {!notification.read && (
                  <Chip 
                    label="New" 
                    size="small" 
                    sx={{ 
                      backgroundColor: '#1976d2',
                      color: 'white',
                      fontSize: '0.7rem',
                      height: '20px'
                    }}
                  />
                )}
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 1.5,
                  fontFamily: 'Raleway',
                  lineHeight: 1.5
                }}
              >
                {notification.body}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  fontFamily: 'Raleway',
                  display: 'block'
                }}
              >
                {notification.timestamp}
              </Typography>
              {Object.keys(notification.data).length > 0 && (
                <Typography 
                  variant="caption" 
                  display="block" 
                  sx={{ 
                    mt: 1, 
                    fontFamily: 'monospace',
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    padding: '4px 8px',
                    borderRadius: 1,
                    fontSize: '0.7rem'
                  }}
                >
                  Data: {JSON.stringify(notification.data)}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {!notification.read && (
                <IconButton 
                  size="small" 
                  onClick={() => markNotificationAsRead(notification.id)}
                  sx={{ 
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    }
                  }}
                >
                  <CheckCircle fontSize="small" />
                </IconButton>
              )}
              <IconButton 
                size="small" 
                onClick={() => clearNotification(notification.id)}
                sx={{ 
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  }
                }}
              >
                ×
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );

  return (
    <div className='main-body'>
      {/* Header Section */}
      <Box sx={{ 
        width: '100%', 
        mb: 4,
        textAlign: 'left'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3,
          pb: 2,
          borderBottom: '3px solid rgba(109, 238, 126, 0.2)'
        }}>
          <AdminPanelSettings sx={{ color: '#6dee7e', fontSize: 36 }} />
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800, 
              fontFamily: 'Raleway',
              color: '#2c3e50',
              background: 'linear-gradient(135deg, #2c3e50 0%, #6dee7e 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Back Office Dashboard
          </Typography>
        </Box>
      </Box>
      
      {/* Notifications Section */}
      <Card sx={{ 
        mb: 4, 
        width: '100%',
        borderRadius: 3,
        border: '1px solid rgba(109, 238, 126, 0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 3,
            pb: 2,
            borderBottom: '1px solid rgba(109, 238, 126, 0.1)'
          }}>
            <Notifications sx={{ color: '#6dee7e', fontSize: 28 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                fontFamily: 'Raleway',
                color: '#2c3e50'
              }}
            >
              Push Notifications
            </Typography>
            {unreadCount > 0 && (
              <Chip 
                label={`${unreadCount} unread`}
                sx={{ 
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              />
            )}
          </Box>
          
          {notifications.length === 0 ? (
            <Fade in={true}>
              <Box sx={{ 
                textAlign: 'center', 
                py: 4,
                color: '#7f8c8d'
              }}>
                <Notifications sx={{ fontSize: 48, color: '#bdc3c7', mb: 2 }} />
                <Typography variant="h6" sx={{ fontFamily: 'Raleway', fontWeight: 500, mb: 1 }}>
                  No notifications yet
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'Raleway', mb: 3 }}>
                  Enable push notifications to start receiving messages.
                </Typography>
                <Button 
                  variant="outlined"
                  onClick={enableNotifications}
                  sx={{
                    borderColor: '#6dee7e',
                    color: '#6dee7e',
                    fontWeight: 600,
                    fontFamily: 'Raleway',
                    '&:hover': {
                      borderColor: '#5dd86e',
                      backgroundColor: 'rgba(109, 238, 126, 0.05)',
                    }
                  }}
                >
                  {isSubmitting ? 'Please wait...' : 'Enable Push Notifications'}
                </Button>
                
                <Button 
                  variant="outlined"
                  onClick={() => {
                    // Simulate receiving a new order notification
                    const mockNotification = {
                      id: Date.now(),
                      title: 'Test Order Received!',
                      body: 'Table 5 has placed an order for £24.50',
                      timestamp: new Date().toLocaleTimeString(),
                      data: {
                        orderId: 'test-123',
                        tableNumber: '5',
                        totalAmount: '24.50'
                      }
                    };
                    
                    // Add the test notification to the list
                    setNotifications(prev => [mockNotification, ...prev]);
                    
                    // Also show browser notification if permission granted
                    if (Notification.permission === 'granted') {
                      new Notification(mockNotification.title, {
                        body: mockNotification.body,
                        icon: '/logo192.png',
                      });
                    }
                    
                    alert('Test notification sent! Check the notifications list above.');
                  }}
                  sx={{
                    borderColor: '#e74c3c',
                    color: '#e74c3c',
                    fontWeight: 600,
                    fontFamily: 'Raleway',
                    ml: 2,
                    '&:hover': {
                      borderColor: '#c0392b',
                      backgroundColor: 'rgba(231, 76, 60, 0.05)',
                    }
                  }}
                >
                  Test New Order Notification
                </Button>
              </Box>
            </Fade>
          ) : (
            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {notifications.map((notification) => renderNotification(notification))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Enable Notifications Button */}
      {notifications.length > 0 && (
        <Box sx={{ mb: 4, width: '100%' }}>
          <Button 
            variant="contained"
            onClick={enableNotifications}
            sx={{
              backgroundColor: '#6dee7e',
              color: 'white',
              fontWeight: 700,
              fontFamily: 'Raleway',
              fontSize: '1rem',
              py: 1.5,
              px: 4,
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
            startIcon={isSubmitting ? <Skeleton variant="circular" width={20} height={20} /> : <Notifications />}
          >
            {isSubmitting ? 'Please wait...' : 'Enable Push Notifications'}
          </Button>
        </Box>
      )}
      
      {/* Main Content Section */}
      <div className='admin-top-section-container'>
         <QrcodeView></QrcodeView>
         <OrderView selectedOrder={selectedOrder} orders={orders} setOrders={setOrders} setSelectedOrder={setSelectedOrder} />
      </div>
   </div>
  )
}
export default AdminView;
