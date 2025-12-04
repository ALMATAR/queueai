import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_zzKFzLqf0r_EbXkQSa2QUuyQHwEY2gA",
  authDomain: "kimi-eaea2.firebaseapp.com",
  databaseURL: "https://kimi-eaea2-default-rtdb.firebaseio.com",
  projectId: "kimi-eaea2",
  storageBucket: "kimi-eaea2.firebasestorage.app",
  messagingSenderId: "686260860882",
  appId: "1:686260860882:web:f75df0cf1709a8890fba0b",
  measurementId: "G-PXHPHKE9YV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); // Realtime Database for Queue
export const firestore = getFirestore(app); // Firestore for Doctors/Records
