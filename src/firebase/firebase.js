import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD1xolc3SYmezTyIJMBYkJ6s7Mq1P6WYMs",
  authDomain: "weather-app-nick.firebaseapp.com",
  projectId: "weather-app-nick",
  storageBucket: "weather-app-nick.appspot.com",
  messagingSenderId: "635890607653",
  appId: "1:635890607653:web:e6f21f130c5454273b01cc",
  measurementId: "G-Q3DQZY3N0F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export { auth, db };