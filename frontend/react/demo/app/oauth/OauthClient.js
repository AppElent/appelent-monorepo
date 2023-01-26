"use client";

import React, { useState, useContext, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useRouter } from "next/navigation";

// Firebase and firestore
import { collection, doc, where, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";

export const OauthClientContext = React.createContext();

export const useOauthClient = () => useContext(OauthClientContext);

export const OauthClientProvider = ({ children, configurations, baseUrl }) => {
  const searchParams = new URLSearchParams(document.location.search);
  console.log(searchParams);
  const router = useRouter();

  const getFirestoreTokenPath = (user) => {
    const username = user?.uid || "demo_user";
    return `users/${username}/tokens`;
  };

  const auth = getAuth();
  const username = auth.currentUser?.uid || "demo_user";
  const [tokens, loading, error, snapshot] = useCollectionData(
    collection(db, getFirestoreTokenPath(auth.currentUser)),
    where("environment", "==", "dev")
  );
  console.log(configurations, baseUrl);
  console.log(tokens, loading, error);

  useEffect(() => {
    const state = searchParams.get("state");
    const config = searchParams.get("config");
    const fetchToken = async (state, config) => {
      const configuration = configurations[config];
      const url = baseUrl
        ? `${baseUrl}/${configuration.tokenUrl}`
        : configuration.tokenUrl;
      const urlWithState = url + "?state=" + state;
      const token = await (
        await fetch(urlWithState, { method: "POST" })
      ).json();
      console.log(token);
      const data = {
        token,
        environment: "local",
        tokenUrl: url,
      };
      await setDoc(
        doc(db, getFirestoreTokenPath(auth.currentUser), config),
        data
      );

      // Redirect back to path without query params
      router.push(window.location.pathname);
    };

    if (state && config) {
      fetchToken(state, config);
    }
  }, []);

  const test = () => {
    return true;
  };

  const redirect = (config) => {
    const provider = configurations[config];
    if (!provider) console.error("Provider " + config + " cannot be found");
    const redirectUrl = baseUrl
      ? `${baseUrl}/${provider.redirectUrl}`
      : provider.redirectUrl;
    window.location.href = redirectUrl;
  };

  // const retrieveAccessToken = async (name) => {
  //   const provider = configurations[config];
  //   let params = new URLSearchParams(window.location.search);
  //   let urlState = params.get("state");
  //   console.log(urlState);

  //   // Fetching token
  //   const token = await fetch(
  //     `${baseUrl}${provider.tokenUrl}?state=${urlState}`
  //   );
  //   state.tokens[name] = token;
  //   return token;
  // };

  const getAccessToken = async () => {
    return state.name;
  };

  const returnValue = {
    test,
    redirect,
    //retrieveAccessToken,
    getAccessToken,
    var1: true,
  };

  return (
    <OauthClientContext.Provider value={returnValue}>
      {children}
    </OauthClientContext.Provider>
  );
};
