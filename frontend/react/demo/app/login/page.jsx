"use client";

import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import React from "react";

import { initializeApp } from "firebase/app";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyDAwdqU-4k5Azb1fNF9RFLAlT-RaMSDUPo",
  authDomain: "appelent-bc868.firebaseapp.com",
  projectId: "appelent-bc868",
  storageBucket: "appelent-bc868.appspot.com",
  messagingSenderId: "726562505952",
  appId: "1:726562505952:web:d05c0d37da55129551fc85",
  measurementId: "G-SCBJ5EM94B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function Login() {
  const auth = getAuth();

  const login = async () => {
    await signInWithEmailAndPassword(auth, "demo@demo.com", "demo123");
    console.log(auth.currentUser);
  };

  const logout = async () => {
    await signOut(auth);
    console.log(auth.currentUser);
  };

  return (
    <>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </>
  );
}
