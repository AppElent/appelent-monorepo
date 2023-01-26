"use client";

import React, { useState } from "react";
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
      redirectUrl:
        "/oauth/enelogic/authorize?redirect=true&redirect_url=http://localhost:3000/oauth&config=enelogic",
      tokenUrl: "/oauth/enelogic/token",
      scope: "account",
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
