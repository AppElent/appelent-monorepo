import { getAuth } from "firebase/auth";
import { collection, where } from "firebase/firestore";
import { db } from "./firebase";
import { siteSettings } from "config";

import { AppelentFramework, useData } from "libs/appelent-framework";
import { FirebaseAuth } from "libs/appelent-framework/authProviders/firebase";
import { useEffect, useMemo } from "react";
import { ActionType } from "./appelent-framework/caching";
import dataProvider from "@pankod/refine-simple-rest";
import { MuiInferencer } from "@pankod/refine-inferencer/mui";
import { logger } from "libs/appelent-framework/logging";

const CustomApp = ({ queryClient, children }) => {
  const auth = getAuth();
  logger.log("Environment variables", process.env);

  const website = useMemo(() => {
    if (typeof window !== "undefined") {
      let returnLastSegment = (str) => str.split(".").pop();
      const hostname = window.location.hostname
        .toLowerCase()
        .replace(".appelent.com", "");
      return returnLastSegment(hostname);
    }
    return "";
  }, []);

  useEffect(() => {
    if (website && siteSettings[website]) {
      const newSiteSettings = { ...siteSettings };
      siteSettings.website = website;
      Object.keys(siteSettings[website]).forEach((key) => {
        siteSettings[key] = siteSettings[website][key];
        newSiteSettings[key] = siteSettings[website][key];
      });
    }
  }, [website]);

  const initialGlobalData = useMemo(() => {
    return {
      data: {
        settings: {
          ...siteSettings,
          website,
          sections: siteSettings[website]?.sections,
        },
      },
    };
  }, []);

  const resources = [
    {
      name: "dummy01",
      options: {
        collection: collection(db, "dummy"),
        dataProviderName: "firestore",
      },
    },
    {
      name: "testdocument",
      options: {
        collection: collection(db, "dummy"),
        document: "dumm03",
        dataProviderName: "firestore",
      },
    },
    {
      name: "test01",
      options: {
        dataProviderName: "localStorage",
      },
    },
    {
      name: "dummy03",
      options: {
        collection: collection(db, "dummy"),
        dataProviderName: "firestore",
        postProcess: (data) => {
          var object = data?.reduce(
            (obj, item) => Object.assign(obj, { [item.id]: { ...item } }),
            {}
          );
          return object;
        },
      },
    },
  ];

  const refineResources = [
    {
      name: "events",
      list: MuiInferencer,
      show: MuiInferencer,
      edit: MuiInferencer,
      options: {
        route: "refine/events",
        label: "Events",
      },
    },
    {
      name: "products",
      list: MuiInferencer,
      show: MuiInferencer,
      create: MuiInferencer,
      edit: MuiInferencer,
      options: {
        route: "refine/products",
        label: "Products",
        dataProviderName: "dummy",
      },
    },
    {
      name: "posts",
      list: MuiInferencer,
      show: MuiInferencer,
      create: MuiInferencer,
      edit: MuiInferencer,
      options: {
        route: "refine/posts",
        dataProviderName: "dummy",
      },
    },
  ];

  const httpRedirect = useMemo(() => {
    if (typeof window !== "undefined") {
      if (
        !(
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
        ) &&
        process.env.NODE_ENV !== "development"
      ) {
        return true;
      }
    }
    return false;
  }, []);

  return (
    // <GlobalDataContext.Provider value={{ ...data, dispatch }}>
    <AppelentFramework
      confirmDefaultOptions={{
        confirmationButtonProps: { variant: "contained", color: "error" },
        cancellationButtonProps: { variant: "contained" },
      }}
      dataProvider={dataProvider}
      httpsRedirect={httpRedirect}
      initialData={initialGlobalData}
      refineProps={{
        authProvider: new FirebaseAuth(
          undefined,
          undefined,
          getAuth()
        ).getAuthProvider(),
        // dataProvider: dataProvider(API_URL, BackendClient),
        resources: refineResources,
      }}
      resources={resources}
    >
      <CustomAppChild queryClient={queryClient}>{children}</CustomAppChild>
      {/* </GlobalDataContext.Provider> */}
    </AppelentFramework>
  );
};

const CustomAppChild = ({ children }) => {
  const auth = getAuth();
  const globalData = useData();
  // useAuth();

  let returnComponent = <>{children}</>;

  useEffect(() => {
    if (
      auth.currentUser?.uid &&
      globalData.dispatch &&
      (siteSettings.website === "satisfactory" ||
        siteSettings.website === "localhost")
    ) {
      console.log("Adding resource satisfactory_games");
      globalData.dispatch({
        type: ActionType.ADD_RESOURCE,
        payload: {
          resource: {
            name: "satisfactory_games",
            options: {
              dataProviderName: "firestore",
              collection: collection(db, "satisfactory_games"),
              query: [
                where("playerIds", "array-contains", auth.currentUser.uid),
                //where("owner", "==", auth.currentUser.uid),
              ],
            },
            loadData: false,
          },
        },
      });
    } else if (!auth.currentUser?.uid && globalData.dispatch) {
    }
  }, [auth.currentUser, globalData.dispatch, siteSettings.website]);

  // const firestoreComponents = useLoadFirestore(globalData);

  // returnComponent = (
  //   <>
  //     {returnComponent}
  //     {firestoreComponents}
  //   </>
  // );

  return returnComponent;
};

export default CustomApp;
