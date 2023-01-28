import { createContext, useContext } from "react";
import { QueryClientProvider } from "react-query";
import { getAuth } from "firebase/auth";
import { FirebaseContext } from "libs/firebase";

const CustomApp = ({ httpsRedirect, queryClient, firebaseData, children }) => {
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

  let returnComponent = <>{children}</>;

  // if queryClient present add it
  if (queryClient) {
    returnComponent = (
      <QueryClientProvider client={queryClient}>
        {returnComponent}
      </QueryClientProvider>
    );
  }

  // if firebaseContext present, add it
  if (firebaseData) {
    returnComponent = (
      <FirebaseContext.Provider value={firebaseData}>
        {returnComponent}
      </FirebaseContext.Provider>
    );
  }

  return returnComponent;
};

export default CustomApp;
