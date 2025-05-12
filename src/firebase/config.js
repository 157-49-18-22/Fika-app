// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
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

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app; 