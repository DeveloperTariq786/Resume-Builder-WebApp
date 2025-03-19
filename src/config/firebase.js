import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDSYvBvH1BE81frX8IrrIjOBJXAwSmRmAE",
  authDomain: "draftai-b5cb9.firebaseapp.com",
  projectId: "draftai-b5cb9",
  storageBucket: "draftai-b5cb9.appspot.com",
  messagingSenderId: "119139221158",
  appId: "1:119139221158:web:1aeb3548ebd33cdef03e67",
  measurementId: "G-Z6HR1MBQ6T"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();