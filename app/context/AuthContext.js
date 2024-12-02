// app/context/AuthContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState("en"); // Default language

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await updateUserLanguage(user.uid, lang);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const logOut = () => signOut(auth);

  const updateUserLanguage = async (userId, language) => {
    const userRef = doc(db, "users", userId);
    try {
      await setDoc(userRef, { lang: language }, { merge: true });
      setLang(language);
    } catch (error) {
      console.error("Error updating user language", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setLang(userDoc.data().lang || "en");
        } else {
          await updateUserLanguage(currentUser.uid, "en");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, googleSignIn, logOut, lang, updateUserLanguage }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
