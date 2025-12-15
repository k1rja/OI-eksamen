import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "oi-eksamen-abe77.firebaseapp.com",
  databaseURL: "https://oi-eksamen-abe77-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "oi-eksamen-abe77",
  storageBucket: "oi-eksamen-abe77.firebasestorage.app",
  messagingSenderId: "920899434310",
  appId: "1:920899434310:web:5bb000e375df51a635d747"
};

// Initialier Firebase
export const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)