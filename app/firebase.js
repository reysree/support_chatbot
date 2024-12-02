// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
//  const firebaseConfig = {
//    apiKey: "AIzaSyA0hjDtn6NjPilg_gPV-64HFQWPCdDjzPY",
//    authDomain: "chatbot-auth-3879f.firebaseapp.com",
//    projectId: "chatbot-auth-3879f",
//    storageBucket: "chatbot-auth-3879f.appspot.com",
//    messagingSenderId: "1047033697391",
//    appId: "1:1047033697391:web:12fa0666f824d85c8aa99a"
//  };

const firebaseConfig = {
  apiKey: "AIzaSyDVThAsoY5KYnzgN28oN8O6Zeqawr98DDA",
  authDomain: "support-chatbot-7e6be.firebaseapp.com",
  projectId: "support-chatbot-7e6be",
  storageBucket: "support-chatbot-7e6be.firebasestorage.app",
  messagingSenderId: "409097677611",
  appId: "1:409097677611:web:80e219cd286207cf89f36e",
  measurementId: "G-QPF9PCYLQN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
