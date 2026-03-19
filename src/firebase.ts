import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA2NKNj_0oPPcKh2cU_TvIiJG-UXbZ6blk",
  authDomain: "wedding-invitation-28fc8.firebaseapp.com",
  projectId: "wedding-invitation-28fc8",
  storageBucket: "wedding-invitation-28fc8.firebasestorage.app",
  messagingSenderId: "500701298780",
  appId: "1:500701298780:web:ea41d39a97dc6acac1e699"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
