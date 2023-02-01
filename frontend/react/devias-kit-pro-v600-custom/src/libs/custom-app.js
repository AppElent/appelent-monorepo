import { createContext, useContext, useEffect, useState } from "react";
import { QueryClientProvider } from "react-query";
import { getAuth } from "firebase/auth";
import { ActionType, GlobalDataContext, useGlobalData } from "./global-data";
import { useLoadFirestore } from "./global-data-firestore";

const CustomApp = ({ httpsRedirect, queryClient, globalData, children }) => {
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

  const auth = getAuth();
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT
    ? process.env.NEXT_PUBLIC_ENVIRONMENT
    : "undefined";

  console.log(globalData);

  useEffect(() => {
    globalData.dispatch({
      type: ActionType.INITIALIZE,
      payload: { dispatch: globalData.dispatch },
    });
  }, []);

  let returnComponent = <>{children}</>;

  returnComponent = (
    <>
      {returnComponent}
      {/* {firestoreComponents} */}
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
  if (globalData) {
    returnComponent = (
      <GlobalDataContext.Provider value={globalData.data}>
        <CustomAppChild>{returnComponent}</CustomAppChild>
      </GlobalDataContext.Provider>
    );
  }

  return returnComponent;
};

const CustomAppChild = ({ children }) => {
  const globalData = useGlobalData();
  console.log(globalData);
  const firestoreComponents = useLoadFirestore(globalData);
  console.log(123, globalData, firestoreComponents);
  return <>{children}</>;
};

export default CustomApp;
