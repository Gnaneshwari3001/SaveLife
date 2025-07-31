
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "savelife-vyo4b",
  appId: "1:791001388600:web:ca0a75e8ffa1a269a3f8cd",
  storageBucket: "savelife-vyo4b.firebasestorage.app",
  apiKey: "AIzaSyAWSDWTh0w8812k3_V2S0N570vF0WnufIM",
  authDomain: "savelife-vyo4b.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "791001388600",
  databaseURL: "https://savelife-vyo4b-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);
const auth = getAuth(app);

export { app, database, auth };
