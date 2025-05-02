import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyD1VcZovJeaKiScSJhEuT3dWtSenvjFUj8",
    authDomain: "fika-3865e.firebaseapp.com",
    projectId: "fika-3865e",
    storageBucket: "fika-3865e.firebasestorage.app",
    messagingSenderId: "616823581929",
    appId: "1:616823581929:web:ee8c44165a656f78485478"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }; 