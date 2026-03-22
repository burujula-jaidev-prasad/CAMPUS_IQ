import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEf9eb83kCR_7fADUmwmxlIWdZMqg4XSw",
  authDomain: "campus-opti.firebaseapp.com",
  projectId: "campus-opti",
  storageBucket: "campus-opti.firebasestorage.app",
  messagingSenderId: "85793866139",
  appId: "1:85793866139:web:35fb8bee9820d1bca3213e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
