"use client";

import React, { useState, useContext } from "react";

export const OauthClientContext = React.createContext();

export const useOauthClient = () => useContext(OauthClientContext);

export const OauthClientProvider = ({ children, configurations, baseUrl }) => {
  const [state, setState] = useState({
    tokens: {},
  });
  console.log(state, configurations, baseUrl);

  const test = () => {
    return true;
  };

  const redirect = (config) => {
    const provider = configurations[config];
    const redirectUrl = baseUrl
      ? `${baseUrl}/${provider.redirectUrl}`
      : provider.redirectUrl;
    window.location.href = redirectUrl;
  };

  const retrieveAccessToken = async (name) => {
    const provider = configurations[config];
    let params = new URLSearchParams(window.location.search);
    let urlState = params.get("state");
    console.log(urlState);

    // Fetching token
    const token = await fetch(
      `${baseUrl}${provider.tokenUrl}?state=${urlState}`
    );
    state.tokens[name] = token;
    setState({ ...state });

    setState();

    return token;
  };

  const getAccessToken = async () => {
    return state.name;
  };

  const returnValue = {
    test,
    redirect,
    retrieveAccessToken,
    getAccessToken,
    var1: true,
  };

  return (
    <OauthClientContext.Provider value={returnValue}>
      {children}
    </OauthClientContext.Provider>
  );
};
