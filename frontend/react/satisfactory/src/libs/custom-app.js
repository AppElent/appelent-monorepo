import { getAuth } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useAuth } from "hooks/use-auth";
import { createContext, useContext, useEffect, useState } from "react";
import { QueryClientProvider } from "react-query";
import { ConfirmProvider } from "./confirmation-dialog";
import { db } from "./firebase";

import { GlobalDataContext, useGlobalData, useLoadData } from "./global-data";
import { useLoadFirestore } from "./global-data-firestore";

const CustomApp = ({ httpsRedirect, queryClient, globalData, children }) => {
  useEffect(() => {
    // Client-side-only code
    /**
     * HTTPS redirect
     */
    const isLocalhost =
      location.hostname === "localhost" || location.hostname === "127.0.0.1";
    if (
      httpsRedirect &&
      window.location.protocol !== "https:" &&
      process.env.NODE_ENV !== "development" &&
      !isLocalhost
    ) {
      window.location.href = `https:${window.location.href.substring(
        window.location.protocol.length
      )}`;
    }
  }, []);

  return (
    <GlobalDataContext.Provider value={globalData}>
      <ConfirmProvider
        defaultOptions={{
          confirmationButtonProps: { variant: "contained", color: "error" },
          cancellationButtonProps: { variant: "contained" },
        }}
      >
        <CustomAppChild queryClient={queryClient}>{children}</CustomAppChild>
      </ConfirmProvider>
    </GlobalDataContext.Provider>
  );
};

const CustomAppChild = ({ queryClient, children }) => {
  const globalData = useGlobalData();
  const auth = getAuth();
  useAuth();

  const userDataLoadKey = auth.currentUser
    ? "firestore.documents.userSettings"
    : undefined;
  const userdata = useLoadData(userDataLoadKey, {
    document: doc(db, `users/${auth?.currentUser?.uid}`),
  });

  let returnComponent = <>{children}</>;

  const firestoreComponents = useLoadFirestore(globalData);

  returnComponent = (
    <>
      {returnComponent}
      {firestoreComponents}
    </>
  );

  // if queryClient present add it
  if (queryClient) {
    returnComponent = (
      <QueryClientProvider client={queryClient}>
        {returnComponent}
      </QueryClientProvider>
    );
  }

  // if firebaseContext present, add it
  returnComponent = (
    <GlobalDataContext.Provider value={globalData}>
      {/* <GlobalDataFirestoreCollection /> */}
      {returnComponent}
    </GlobalDataContext.Provider>
  );

  return returnComponent;
};

export default CustomApp;
