// public/firebase-messaging-sw.js
// Firebase v9+ compatible service worker
// Note: Service workers have limitations with ES modules, so we use the compat version
// but with modern Firebase v9+ configuration

importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging.js");

// Initialize Firebase in the service worker with v9+ compatible config
firebase.initializeApp({
  apiKey: "AIzaSyA_Cn2R-W4XwNKA60CToCyA8w5zkhFfO8k",
  authDomain: "digital-menu-a7c41.firebaseapp.com",
  projectId: "digital-menu-a7c41",
  storageBucket: "digital-menu-a7c41.firebasestorage.app",
  messagingSenderId: "854080846928",
  appId: "1:854080846928:web:adba07e501bdec6b7da555",
  measurementId: "G-TXEZ09QWBF"
});

const messaging = firebase.messaging();

// Handle background messages with modern payload structure
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Extract notification data with modern structure support
  const notificationTitle = payload.notification?.title || 
                           payload.data?.title || 
                           'New Message';
  
  const notificationBody = payload.notification?.body || 
                          payload.data?.body || 
                          'You have a new message';
  
  const notificationIcon = payload.notification?.icon || 
                          payload.data?.icon || 
                          '/logo192.png';
  
  // Create notification options with modern features
  const notificationOptions = {
    body: notificationBody,
    icon: notificationIcon,
    badge: '/logo192.png',
    tag: 'firebase-messaging',
    requireInteraction: false,
    data: payload.data || {},
    actions: payload.data?.actions || [],
    silent: false,
    vibrate: [200, 100, 200]
  };

  // Show the notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Modern service worker lifecycle management
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installing...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activating...');
  // Claim all clients immediately
  event.waitUntil(self.clients.claim());
});

// Enhanced notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  // Close the notification
  event.notification.close();
  
  // Enhanced client management
  event.waitUntil(
    clients.matchAll({ 
      type: 'window',
      includeUncontrolled: true 
    }).then((clientList) => {
      // Try to focus existing window first
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no existing window, open a new one
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] Notification closed:', event);
  
  // You can add analytics or other tracking here
  if (event.notification.data) {
    console.log('Notification data:', event.notification.data);
  }
});

// Handle push event (fallback for older browsers)
self.addEventListener('push', (event) => {
  console.log('[firebase-messaging-sw.js] Push event received:', event);
  
  if (event.data) {
    try {
      const payload = event.data.json();
      console.log('Push payload:', payload);
      
      // Show notification if Firebase messaging didn't handle it
      const title = payload.notification?.title || 'New Message';
      const options = {
        body: payload.notification?.body || 'You have a new message',
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: 'firebase-messaging',
        data: payload.data || {}
      };
      
      event.waitUntil(
        self.registration.showNotification(title, options)
      );
    } catch (error) {
      console.error('Error parsing push data:', error);
    }
  }
});
