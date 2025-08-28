// src/getFcmToken.js
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export async function requestPermissionAndGetToken() {
  console.log("Requesting notification permission...");
  if (!('Notification' in window)) {
    console.error('This browser does not support notifications.');
    throw new Error('This browser does not support notifications.');
  }
  
  const permission = await Notification.requestPermission();
  console.log("Notification permission:", permission);
  if (permission !== 'granted') {
    console.log("Permission not granted.");
    return null;
  }

  try {
    // register service worker (ensure path matches public/firebase-messaging-sw.js)
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log("Service worker registered successfully:", registration);

    // get token — pass VAPID key and serviceWorkerRegistration if you used a custom registration
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (currentToken) {
      console.log("FCM token obtained:", currentToken);
      return currentToken; // send this to your server and save against the user
    } else {
      console.log("No registration token available. Request permission to generate one.");
      return null;
    }
  } catch (error) {
    console.error("Error during service worker registration or token retrieval:", error);
    throw error;
  }
}

// foreground handler
export function listenForForegroundMessages(callback) {
  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    
    // Display notification for foreground messages
    if (payload.notification) {
      const { title, body, icon } = payload.notification;
      
      // Create and show notification
      const notification = new Notification(title || 'New Message', {
        body: body || 'You have a new message',
        icon: icon || '/logo192.png',
        badge: '/logo192.png',
        tag: 'firebase-messaging',
        requireInteraction: false
      });

      // Optional: Handle notification click
      notification.onclick = () => {
        console.log("Notification clicked:", payload);
        // You can add custom logic here (e.g., navigate to a specific page)
        window.focus();
        notification.close();
      };

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
    }

    // Call the callback if provided
    if (callback && typeof callback === 'function') {
      callback(payload);
    }
  });
}

// Test function to verify FCM setup
export async function testFCMSetup() {
  try {
    console.log("Testing FCM setup...");
    
    // Check if messaging is available
    if (!messaging) {
      console.error("Firebase messaging is not available");
      return false;
    }
    
    // Check if service worker is registered
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
      if (registration) {
        console.log("Service worker is registered:", registration);
      } else {
        console.log("Service worker is not registered");
      }
    }
    
    // Check notification permission
    if ('Notification' in window) {
      const permission = Notification.permission;
      console.log("Notification permission:", permission);
    }
    
    // Try to get token
    const token = await requestPermissionAndGetToken();
    if (token) {
      console.log("FCM setup test successful. Token:", token);
      return true;
    } else {
      console.log("FCM setup test failed - no token received");
      return false;
    }
  } catch (error) {
    console.error("FCM setup test failed:", error);
    return false;
  }
}
