import { createContext, useContext, useState } from "react";
import { QueryClientProvider } from "react-query";
import { getAuth } from "firebase/auth";
import { FirebaseContext } from "libs/firebase";

const SettingsContext = createContext();
const GlobalDataContext = createContext();

export const useSettings = () => useContext(SettingsContext);
export const useGlobalData = () => useContext(GlobalDataContext)

const CustomApp = ({ httpsRedirect, queryClient, firebaseData, children }) => {
  const auth = getAuth();
  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT
    ? process.env.NEXT_PUBLIC_ENVIRONMENT
    : "undefined";
  const [settings, setSettings] = useState({ environment });

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

  const settingsData = {
    ...settings,
    set: setSettings,
  };

  let returnComponent = (
    <SettingsContext.Provider value={settingsData}>
      {children}
    </SettingsContext.Provider>
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
