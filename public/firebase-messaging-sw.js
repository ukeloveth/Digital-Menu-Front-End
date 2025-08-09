// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// firebase.initializeApp({
//   apiKey: self.REACT_APP_FIREBASE_API_KEY,
//   authDomain: self.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: self.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: self.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: self.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: self.REACT_APP_FIREBASE_APP_ID,
//   measurementId: self.REACT_APP_FIREBASE_MEASUREMENT_ID
// });
firebase.initializeApp({
  apiKey:"AIzaSyC8QS2khALh2u4SQt2JB_QEcz1GBuLHxjo",
  authDomain: "qrcode-b2f82.firebaseapp.com",
  projectId: "qrcode-b2f82",
  storageBucket: "qrcode-b2f82.firebasestorage.app",
  messagingSenderId: "721686140912",
  appId: "1:721686140912:web:5be91d8c070b558f58ef35",
  measurementId: "G-0L2J7BEJJ0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
