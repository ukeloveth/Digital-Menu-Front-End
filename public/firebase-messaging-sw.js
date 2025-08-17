//public/firebase-messaging-sw.js
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// //Initialize Firebase in the service worker
// firebase.initializeApp({
//   apiKey: "AIzaSyC8QS2khALh2u4SQt2JB_QEcz1GBuLHxjo",
//   authDomain: "qrcode-b2f82.firebaseapp.com",
//   projectId: "qrcode-b2f82",
//   storageBucket: "qrcode-b2f82.firebasestorage.app",
//   messagingSenderId: "721686140912",
//   appId: "1:721686140912:web:5be91d8c070b558f58ef35",
//   measurementId: "G-0L2J7BEJJ0"
// });

// const messaging = firebase.messaging();

//Handle background messages
// messaging.onBackgroundMessage(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
//   //Customize notification here
//   const notificationTitle = payload.notification?.title || 'New Message';
//   const notificationOptions = {
//     body: payload.notification?.body || 'You have a new message',
//     icon: '/logo192.png',
//     badge: '/logo192.png',
//     tag: 'firebase-messaging',
//     requireInteraction: false
//   };

//   //Show the notification
//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });

//Handle service worker installation
// self.addEventListener('install', (event) => {
//   console.log('[firebase-messaging-sw.js] Service Worker installing...');
//   self.skipWaiting();
// });

// Handle service worker activation
// self.addEventListener('activate', (event) => {
//   console.log('[firebase-messaging-sw.js] Service Worker activating...');
//   event.waitUntil(self.clients.claim());
// });


// IMPORTANT: use a compat CDN version that matches your SDK major version
// importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

//     firebase.initializeApp({
//         apiKey: "AIzaSyC8QS2khALh2u4SQt2JB_QEcz1GBuLHxjo",
//         authDomain: "qrcode-b2f82.firebaseapp.com",
//         projectId: "qrcode-b2f82",
//         storageBucket: "qrcode-b2f82.firebasestorage.app",
//         messagingSenderId: "721686140912",
//         appId: "1:721686140912:web:5be91d8c070b558f58ef35",
//         measurementId: "G-0L2J7BEJJ0"
//     });

// const messaging = firebase.messaging();

// // handle background messages
// messaging.onBackgroundMessage(function(payload) {
//     console.log(payload,"New notofication------")
//   const title = payload.notification?.title || 'Background message';
//   const options = { body: payload.notification?.body || '', icon: '/favicon.ico' };
//   self.registration.showNotification(title, options);
// });
