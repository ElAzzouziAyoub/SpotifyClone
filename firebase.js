// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUkbsgTrbbXReZpQDt-6XTYFffG4RnZzQ",
  authDomain: "spotify-cd87f.firebaseapp.com",
  projectId: "spotify-cd87f",
  storageBucket: "spotify-cd87f.firebasestorage.app",
  messagingSenderId: "897510147892",
  appId: "1:897510147892:web:1a7c378491f2d5ac690761"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)

