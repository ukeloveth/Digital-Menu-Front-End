//public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
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

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'firebase-messaging',
    requireInteraction: false,
    data: payload.data || {}
  };

  // Show the notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle service worker installation
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installing...');
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activating...');
  event.waitUntil(self.clients.claim());
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  event.notification.close();
  
  // Focus on existing window or open new one
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
