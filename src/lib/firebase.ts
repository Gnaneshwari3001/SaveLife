
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCF9tpVp3eDnYJMLpYWGu_b_oDHnhBp76M",
  authDomain: "savelife-871c3.firebaseapp.com",
  databaseURL: "https://savelife-871c3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "savelife-871c3",
  storageBucket: "savelife-871c3.appspot.com",
  messagingSenderId: "760109239873",
  appId: "1:760109239873:web:1d74d87cf8556534e8c0c0",
  measurementId: "G-T37QRFD07W"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const database = getDatabase(app);
const auth = getAuth(app);

export { app, database, auth };
