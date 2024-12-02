 // Import the functions you need from the SDKs you need
 import { initializeApp } from "firebase/app";
 import { getAuth } from "firebase/auth";
 import { getFirestore } from 'firebase/firestore';
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 
 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyA0hjDtn6NjPilg_gPV-64HFQWPCdDjzPY",
   authDomain: "chatbot-auth-3879f.firebaseapp.com",
   projectId: "chatbot-auth-3879f",
   storageBucket: "chatbot-auth-3879f.appspot.com",
   messagingSenderId: "1047033697391",
   appId: "1:1047033697391:web:12fa0666f824d85c8aa99a"
 };
 
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app);
 export const db = getFirestore(app);