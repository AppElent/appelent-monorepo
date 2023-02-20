import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
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
import { useTranslation } from "react-i18next";
import useLocalStorage from "./hooks/use-local-storage";
import axios from "axios";
import _ from "lodash";

export const GlobalDataContext = createContext();

export const useAppelentFramework = () => useContext(GlobalDataContext);

const userDataLocalStorageKey = "user_data";

export const AppelentFramework = ({
  confirmDefaultOptions,
  queryClient,
  httpsRedirect,
  initialData,
  refineProps,
  resources,
  children,
}) => {
  const usersettings = useMemo(() => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(userDataLocalStorageKey);
      return item ? JSON.parse(item) : {};
    }
    return {};
  }, []);

  _.set(initialData, "data.settings.usersettings", usersettings);

  const [data, dispatch] = useReducer(reducer, {
    ...initialData,
    resources: resources || [],
  });
  console.log("Globaldata", data);

  let {
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

  /**?
   *   Create i18nProvider from Refine
   *
   */
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key, options) => t(key, options),
    changeLocale: (lang) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

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

  givenResources = givenResources || [];

  useEffect(() => {
    givenResources.push({
      name: "posts",
      list: MuiInferencer,
      show: MuiInferencer,
      create: MuiInferencer,
      edit: MuiInferencer,
      options: {
        route: "refine/posts",
        dataProviderName: "dummy",
      },
    });
    givenResources.push({
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
    });
  }, []);

  const BackendClient = useMemo(() => {
    const client = axios.create({ baseURL: "http://localhost:8000" });
    client.interceptors.request.use(
      async function (config) {
        const token = await getAuth().currentUser?.getIdToken();
        if (token) {
          config.headers["Authorization"] = "Firebase " + token;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
    // client.interceptors.request.use((request) => {
    //   console.log("Starting Request", JSON.stringify(request, null, 2));
    //   return request;
    // });
    return client;
  }, []);
  const API_URL =
    (data.data?.settings?.usersettings?.backend ||
      data.data?.settings?.backend) + "/crud";

  return (
    <GlobalDataContext.Provider value={{ ...data, dispatch }}>
      <Refine
        authProvider={refineAuthProvider}
        dataProvider={{
          dummy: dataProvider("https://api.fake-rest.refine.dev"),
          default: dataProvider(API_URL, BackendClient),
        }}
        i18nProvider={i18nProvider}
        Layout={DashboardLayout}
        LoginPage={AuthPage}
        routerProvider={routerProvider}
        resources={givenResources}
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

  const [localStorageValue, setLocalStorageValue, deleteLocalStorageValue] =
    useLocalStorage(userDataLocalStorageKey);

  useEffect(() => {
    if (setLocalStorageValue && state.data?.settings?.usersettings) {
      if (
        !_.isEqual(
          JSON.stringify(state.data.settings?.usersettings),
          JSON.stringify(localStorageValue)
        )
      ) {
        setLocalStorageValue(state.data.settings?.usersettings);
      }
    }
  }, [state]);

  return (
    <>
      {firestoreComponents}
      {children}
    </>
  );
};
