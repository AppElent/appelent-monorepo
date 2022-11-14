"use client";

import React from "react";
import { OauthClientProvider, useOauthClient } from "./OauthClient";

const ChildComponent = () => {
  const { getAccessToken, redirect } = useOauthClient();
  console.log(999);
  //redirect("enelogic");
  return (
    <>
      <br />
      <button onClick={() => redirect("enelogic")}>Redirect enelogic</button>
    </>
  );
};

export default function Oauth() {
  const configurations = {
    enelogic: {
      redirectUrl: "/enelogic/authorize?redirect=true",
      tokenUrl: "/enelogic/token",
    },
  };

  return (
    <div>
      Oauth demo
      <OauthClientProvider
        test="yes"
        configurations={configurations}
        baseUrl="http://localhost:8000"
      >
        <ChildComponent />
      </OauthClientProvider>
    </div>
  );
}
