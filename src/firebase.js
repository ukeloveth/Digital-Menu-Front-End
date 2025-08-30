import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "digital-menu-a7c41.firebaseapp.com",
  projectId: "digital-menu-a7c41",
  storageBucket: "digital-menu-a7c41.appspot.com", // fixed
  messagingSenderId: "854080846928",
  appId: "1:854080846928:web:adba07e501bdec6b7da555",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
