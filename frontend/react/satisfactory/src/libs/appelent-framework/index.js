import { createContext, useContext, useEffect, useReducer } from "react";
import { ConfirmProvider } from "./confirmation";
import { reducer, useData } from "./caching";
export { useData } from "./caching";

import { useFirestoreMount } from "./dataProviders/firestore";
import { Refine } from "@pankod/refine-core";
import routerProvider from "@pankod/refine-nextjs-router";
import dataProvider from "@pankod/refine-simple-rest";
import { MuiInferencer } from "@pankod/refine-inferencer/mui";
import { AuthPage } from "@pankod/refine-mui";
import { FirebaseAuth } from "refine-firebase";
import { getAuth } from "firebase/auth";

export { useModal } from "./hooks/use-modal";
import { Layout as DashboardLayout } from "layouts/dashboard";
import { QueryClientProvider } from "react-query";

export const GlobalDataContext = createContext();

export const useAppelentFramework = () => useContext(GlobalDataContext);

export const AppelentFramework = ({
  confirmDefaultOptions,
  queryClient,
  httpsRedirect,
  initialData,
  refineProps,
  resources,
  children,
}) => {
  const [data, dispatch] = useReducer(reducer, {
    ...initialData,
    resources: resources || [],
  });
  console.log("Globaldata", data);

  const {
    routerProvider: givenRouterProvider,
    resources: givenResources,
    authProvider: givenAuthProvider,
  } = refineProps || {};

  let returnComponent = <>{children}</>;

  useEffect(() => {
    // Client-side-only code
    /**
     * HTTPS redirect
     */
    if (typeof window !== "undefined") {
      if (httpsRedirect && window.location.protocol !== "https:") {
        window.location.href = `https:${window.location.href.substring(
          window.location.protocol.length
        )}`;
      }
    }
  }, []);

  if (queryClient) {
    returnComponent = (
      <QueryClientProvider client={queryClient}>
        {returnComponent}
      </QueryClientProvider>
    );
  }

  //Configure authprovider
  const refineAuthProvider =
    givenAuthProvider ||
    new FirebaseAuth(undefined, undefined, getAuth()).getAuthProvider();

  // Configure routerprovider with default props
  let refineRouterProvider = givenRouterProvider || routerProvider;
  refineRouterProvider = {
    ...refineRouterProvider,
    routes: [
      {
        path: "/login",
        element: (
          <AuthPage
            type="login"
            registerLink="/register2"
            forgotPasswordLink="/refine/forgot-password"
          />
        ),
      },
      {
        path: "/register",
        element: <AuthPage type="register" loginLink="/refine/login" />,
      },
      {
        path: "/forgot-password",
        element: <AuthPage type="forgotPassword" loginLink="/refine/login" />,
      },
    ],
  };

  return (
    <GlobalDataContext.Provider value={{ ...data, dispatch }}>
      <Refine
        authProvider={refineAuthProvider}
        dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
        Layout={DashboardLayout}
        LoginPage={AuthPage}
        routerProvider={routerProvider}
        resources={
          givenResources || [
            {
              name: "orders",
              list: MuiInferencer,
              show: MuiInferencer,
              create: MuiInferencer,
              edit: MuiInferencer,
            },
            { name: "posts" },
            {
              name: "products",
              list: MuiInferencer,
              show: MuiInferencer,
              create: MuiInferencer,
              edit: MuiInferencer,
              options: {
                route: "refine/products",
                label: "products",
              },
            },
          ]
        }
      >
        <ConfirmProvider defaultOptions={confirmDefaultOptions}>
          <AppelentFrameworkChild>{returnComponent}</AppelentFrameworkChild>
        </ConfirmProvider>
      </Refine>
    </GlobalDataContext.Provider>
  );
};

const AppelentFrameworkChild = ({ children }) => {
  const state = useData();
  const firestoreComponents = useFirestoreMount(state);
  return (
    <>
      {firestoreComponents}
      {children}
    </>
  );
};
