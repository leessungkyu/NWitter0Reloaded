import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyARdrEWsewrHcopmE5H92KbwK1Z_ln06DQ",
  authDomain: "nwitter-reloaded-a5360.firebaseapp.com",
  projectId: "nwitter-reloaded-a5360",
  storageBucket: "nwitter-reloaded-a5360.firebasestorage.app",
  messagingSenderId: "840992303998",
  appId: "1:840992303998:web:fb47472181e06cbe93212f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);