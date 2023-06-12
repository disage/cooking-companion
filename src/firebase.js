import { initializeApp, getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBFMgvlI4S4ZjbOpu6PXIY6RMwigCixMyY",
  authDomain: "cooking-companion-2023.firebaseapp.com",
  projectId: "cooking-companion-2023",
  storageBucket: "cooking-companion-2023.appspot.com",
  messagingSenderId: "972209189779",
  appId: "1:972209189779:web:08b17aecfcc41c9e4fee66",
  measurementId: "G-2DZP0THKFS"
};

const createUserWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};

const collectionName = 'products'
const app = initializeApp(firebaseConfig);
const auth = getAuth(getApp());
const db = getFirestore(app);
const products = collection(db, collectionName);

export { auth, db, products, collectionName, createUserWithEmail, signInWithEmail };