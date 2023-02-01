import { createContext, useContext, useEffect } from "react";
import { siteSettings } from "config";
import { collection } from "firebase/firestore";
import { db } from "./firebase";
import { getAuth } from "firebase/auth";
const auth = getAuth();

export const initialGlobalData = {
  firestore: {
    collections: {
      dummy: {
        query: collection(db, "dummy"),
      },
    },
    collectionObjects: {
      tokens: {
        query: collection(db, `users/${auth?.currentUser?.uid}/tokens`),
      },
    },
    documents: {},
    queries: {},
    isInitialized: false,
  },
  isInitialized: false,
  settings: {
    ...siteSettings,
  },
  dispatch: () => {},
};

//Set dataobjects to load

// const dataObjects = {
//   firestore: {
//     collections: {
//       dummy: {
//         query: collection(db, "dummy"),
//       },
//     },
//     collectionObjects: {
//       tokens: {
//         query: collection(db, `users/${auth?.currentUser?.uid}/tokens`),
//       },
//     },
//     documents: {},
//     queries: {},
//   },
//   isInitialized: false,
//   settings: {
//     ...siteSettings,
//   },
// };

export const GlobalDataContext = createContext();

export const useGlobalData = () => useContext(GlobalDataContext);

export const useLoadData = (key) => {
  const { dispatch } = useGlobalData();
  useEffect(() => {
    dispatch({
      type: ActionType.LOAD_DATA,
      payload: key,
    });
  }, []);
};

export let ActionType;
(function (ActionType) {
  ActionType["INITIALIZE"] = "INITIALIZE";
  ActionType["LOAD_DATA"] = "LOAD_DATA";
  ActionType["STORE_DATA"] = "STORE_DATA";
})(ActionType || (ActionType = {}));

function set(schema, path, value) {
  //var schema = newState; // a moving reference to internal objects within obj
  var pList = path.split(".");
  var len = pList.length;
  for (var i = 0; i < len - 1; i++) {
    var elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    schema = schema[elem];
  }

  schema[pList[len - 1]] = value;
}

export const reducer = (state, action) => {
  console.log("Globaldatadispatch", state, action);
  let newState = state;
  switch (action.type) {
    case "INITIALIZE":
      newState = { ...state, dispatch: action.payload.dispatch };
      return newState;
    case "LOAD_DATA":
      set(newState, action.payload + ".loadData", true);

      return newState;
    case "SET_DATA":
      set(newState, action.payload.key, action.payload.value);

      return newState;
    case "STORE_DATA":
      set(newState, action.payload.storeKey + ".data", action.payload.data);
      set(
        newState,
        action.payload.storeKey + ".loading",
        action.payload.loading
      );
      set(newState, action.payload.storeKey + ".error", action.payload.error);

      return newState;
    default:
      return state;
  }
};
