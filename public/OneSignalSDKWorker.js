importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js");

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyA_Cn2R-W4XwNKA60CToCyA8w5zkhFfO8k",
  authDomain: "digital-menu-a7c41.firebaseapp.com",
  projectId: "digital-menu-a7c41",
  storageBucket: "digital-menu-a7c41.appspot.com",
  messagingSenderId: "854080846928",
  appId: "1:854080846928:web:adba07e501bdec6b7da555",
  measurementId: "G-TXEZ09QWBF"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[OneSignalSDKWorker.js] Received Firebase background message:', payload);

  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/logo192.png',
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});