// src/getFcmToken.js
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

export async function requestPermissionAndGetToken() {
  if (!('Notification' in window)) throw new Error('This browser does not support notifications.');
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  // register service worker (ensure path matches public/firebase-messaging-sw.js)
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

  // get token — pass VAPID key and serviceWorkerRegistration if you used a custom registration
  const currentToken = await getToken(messaging, {
    vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration
  });

  return currentToken; // send this to your server and save against the user
}

// foreground handler
export function listenForForegroundMessages(callback) {
  onMessage(messaging, (payload) => {
    callback(payload);
  });
}
