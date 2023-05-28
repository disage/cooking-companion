import { initializeApp, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFMgvlI4S4ZjbOpu6PXIY6RMwigCixMyY",
  authDomain: "cooking-companion-2023.firebaseapp.com",
  projectId: "cooking-companion-2023",
  storageBucket: "cooking-companion-2023.appspot.com",
  messagingSenderId: "972209189779",
  appId: "1:972209189779:web:08b17aecfcc41c9e4fee66",
  measurementId: "G-2DZP0THKFS"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const auth = getAuth(getApp());
const db = getFirestore(getApp());

export { auth, db };