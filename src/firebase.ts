// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// !! REPLACE THIS WITH YOUR OWN CONFIG FROM FIREBASE !!


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "flower-shop-app-900ea.firebaseapp.com",
  projectId: "flower-shop-app-900ea",
  storageBucket: "flower-shop-app-900ea.firebasestorage.app",
  messagingSenderId: "168262417891",
  appId: "1:168262417891:web:fa85b501c2bc4a461274d6",
  measurementId: "G-8LMBWRFEBV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export our services
// We export them so we can use them anywhere else in our app
export const db = getFirestore(app);
export const auth = getAuth(app);