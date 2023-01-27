import { useState } from "react";
import { QueryClientProvider } from "react-query";
import { getAuth } from "firebase/auth";

const CustomApp = ({
  httpsRedirect,
  queryClient,
  firebaseContext,
  children,
}) => {
  const auth = getAuth();

  /**
   * HTTPS redirect
   */
  if (
    httpsRedirect &&
    window.location.protocol !== "https:" &&
    process.env.NODE_ENV !== "development"
  ) {
    window.location.href = `https:${window.location.href.substring(
      window.location.protocol.length
    )}`;
  }

  const returnComponent = <>{children}</>;

  // if queryClient present add it
  returnComponent = (
    <QueryClientProvider client={queryClient}>
      {returnComponent}
    </QueryClientProvider>
  );

  // if firebaseContext present, add it
  if (firebaseContext) {
    returnComponent = (
      <firebaseContext.Provider>{returnComponent}</firebaseContext.Provider>
    );
  }

  return returnComponent;
};