
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAsWt1uq2x6vIe0DVeDHFSv70GMi0S4Yfc",
  authDomain: "freefireesports-cdf7e.firebaseapp.com",
  projectId: "freefireesports-cdf7e",
  storageBucket: "freefireesports-cdf7e.firebasestorage.app",
  messagingSenderId: "687824348675",
  appId: "1:687824348675:web:32644422d1c711d6b6d036",
  measurementId: "G-D07ZNR296Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
