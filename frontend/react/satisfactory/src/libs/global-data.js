import { createContext, useContext, useEffect } from "react";
import { siteSettings } from "config";
import { collection, limit, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";
import _ from "lodash";
import { current } from "@reduxjs/toolkit";

export const getInitialGlobalData = () => {
  return {
    firestore: {
      collections: {
        dummy: {
          options: { collection: collection(db, "dummy") },
        },
        dummy3: {
          options: {
            collection: collection(db, "dummy"),
            query: [limit(3), orderBy("testfield01")],
          },
        },
      },
      collectionObjects: {
        tokens: {},
      },
      documents: {},
      isInitialized: false,
    },
    isInitialized: false,
    settings: {
      ...siteSettings,
    },
  };
};

export const GlobalDataContext = createContext();

export const useGlobalData = () => useContext(GlobalDataContext);

export const useLoadData = (key, options) => {
  const globalData = useGlobalData();
  const data = _.get(globalData, key);
  useEffect(() => {
    if (globalData.dispatch && key) {
      globalData.dispatch({
        type: ActionType.LOAD_DATA,
        payload: { key, options },
      });
    }
  }, [key, globalData.dispatch]);

  return data;
};

export let ActionType;
(function (ActionType) {
  ActionType["INITIALIZE"] = "INITIALIZE";
  ActionType["LOAD_DATA"] = "LOAD_DATA";
  ActionType["STORE_DATA"] = "STORE_DATA";
  ActionType["SET_DATA"] = "SET_DATA";
})(ActionType || (ActionType = {}));

const setProperty = (obj, path, value) => {
  const [head, ...rest] = path.split(".");

  return {
    ...obj,
    [head]: rest.length ? setProperty(obj[head], rest.join("."), value) : value,
  };
};

export const reducer = (state, action) => {
  console.log("Globaldatadispatch", state, action);
  //let newState = global.structuredClone(state);
  let newState = state; //JSONfn.clone(state);
  let currentValue;
  state;
  switch (action.type) {
    case "LOAD_DATA":
      currentValue = _.get(newState, action.payload.key + ".loadData");
      if (currentValue) {
        return state;
      }
      newState = _.set(newState, action.payload.key + ".loadData", true);

      if (action.payload.options) {
        newState = _.set(
          newState,
          action.payload.key + ".options",
          action.payload.options
        );
      }

      return { ...newState };
    case "SET_DATA":
      currentValue = _.get(newState, action.payload.key);
      if (currentValue === action.payload.value) return state;

      newState = _.set(newState, action.payload.key, action.payload.value);

      return { ...newState };
    // case "STORE_DATA":
    //   //console.log("voor", newState);
    //   newState = _.set(
    //     newState,
    //     action.payload.storeKey + ".data",
    //     action.payload.data
    //   );
    //   newState = _.set(
    //     newState,
    //     action.payload.storeKey + ".loading",
    //     action.payload.loading
    //   );
    //   newState = _.set(
    //     newState,
    //     action.payload.storeKey + ".error",
    //     action.payload.error
    //   );
    //   //console.log("na", newState, { ...newState });

    //   return { ...newState };
    default:
      return state;
  }
};
