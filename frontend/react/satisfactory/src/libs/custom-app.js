import { getAuth } from "firebase/auth";
import { doc, collection, limit, orderBy } from "firebase/firestore";
import { useAuth } from "hooks/use-auth";
import { db } from "./firebase";
import { siteSettings } from "config";

import {
  AppelentFramework,
  useAppelentFramework,
  useData,
} from "libs/appelent-framework";
import { FirebaseAuth } from "refine-firebase";

const CustomApp = ({ httpsRedirect, queryClient, children }) => {
  // const getInitialGlobalData = () => {
  //   return {
  //     firestore: {
  //       collections: {
  //         dummy: {
  //           options: { collection: collection(db, "dummy") },
  //         },
  //         dummy3: {
  //           options: {
  //             collection: collection(db, "dummy"),
  //             query: [limit(3), orderBy("testfield01")],
  //           },
  //         },
  //       },
  //       collectionObjects: {
  //         tokens: {},
  //       },
  //       documents: {},
  //       isInitialized: false,
  //     },
  //     isInitialized: false,
  //     settings: {
  //       ...siteSettings,
  //     },
  //   };
  // };

  const initialGlobalData = {
    settings: {
      ...siteSettings,
    },
  };

  //const [data, dispatch] = useReducer(reducer, getInitialGlobalData(getAuth()));
  // console.log("Globaldata", data);

  // useEffect(() => {
  //   // Client-side-only code
  //   /**
  //    * HTTPS redirect
  //    */
  //   const isLocalhost =
  //     location.hostname === "localhost" || location.hostname === "127.0.0.1";
  //   if (
  //     httpsRedirect &&
  //     window.location.protocol !== "https:" &&
  //     process.env.NODE_ENV !== "development" &&
  //     !isLocalhost
  //   ) {
  //     window.location.href = `https:${window.location.href.substring(
  //       window.location.protocol.length
  //     )}`;
  //   }
  // }, []);

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

  const dataProvider = {
    default: "",
  };

  return (
    // <GlobalDataContext.Provider value={{ ...data, dispatch }}>
    <AppelentFramework
      confirmDefaultOptions={{
        confirmationButtonProps: { variant: "contained", color: "error" },
        cancellationButtonProps: { variant: "contained" },
      }}
      dataProvider={dataProvider}
      httpsRedirect={
        process.env.NODE_ENV !== "development" &&
        !(
          location.hostname === "localhost" || location.hostname === "127.0.0.1"
        )
      }
      initialData={initialGlobalData}
      refineProps={{
        authProvider: new FirebaseAuth(
          undefined,
          undefined,
          getAuth()
        ).getAuthProvider(),
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
  // useAuth();

  // const userDataLoadKey = auth.currentUser
  //   ? "firestore.documents.userSettings"
  //   : undefined;
  // const userdata = useData(userDataLoadKey, {
  //   document: doc(db, `users/${auth?.currentUser?.uid}`),
  // });

  let returnComponent = <>{children}</>;

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
