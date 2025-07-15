import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZCppWv6sTjy1tt7LIJnOq8kuutXIjp7U",
  authDomain: "daily-tracker-586a8.firebaseapp.com",
  projectId: "daily-tracker-586a8",
  storageBucket: "daily-tracker-586a8.appspot.com",
  messagingSenderId: "354105687889",
  appId: "1:354105687889:web:1f34f7baef0f9c8d951d70",
  measurementId: "G-1G7DPJSGCG",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
