import { useEffect, useState } from "react";
import _ from "lodash";

import { useAppelentFramework } from "./index";
import { Logger, logger } from "./logging";

export const useData = (key, options) => {
  const globalData = useAppelentFramework();
  const [stateData, setStateData] = useState({ key, options });

  useEffect(() => {
    if (stateData.key) {
      if (
        typeof stateData.key === "string" ||
        stateData.key instanceof String
      ) {
        if (globalData.dispatch && stateData.key) {
          globalData.dispatch({
            type: ActionType.LOAD_DATA,
            payload: { key: stateData.key, options: stateData.options },
          });
        }
      } else if (_.isObject(stateData.key)) {
        if (globalData.dispatch && stateData.key) {
          globalData.dispatch({
            type: ActionType.ADD_RESOURCE,
            payload: { resource: stateData.key },
          });
        }
      }
    }
  }, [stateData, globalData.dispatch]);
  if (!key) return globalData;

  let data;
  if (typeof key === "string" || key instanceof String) {
    data = _.get(globalData, "data." + key);
  } else if (_.isObject(key)) {
    data = _.get(globalData, "data." + key.name);
  }

  return data || {};
};

export let ActionType;
(function (ActionType) {
  ActionType["ADD_RESOURCE"] = "ADD_RESOURCE";
  ActionType["DELETE_RESOURCE"] = "DELETE_RESOURCE";
  ActionType["LOAD_DATA"] = "LOAD_DATA";
  ActionType["SET_DATA"] = "SET_DATA";
})(ActionType || (ActionType = {}));

export const reducer = (state, action) => {
  logger.log("Globaldatadispatch", { state, action });
  //let newState = global.structuredClone(state);
  let newState = state; //JSONfn.clone(state);
  let currentValue;
  state;
  switch (action.type) {
    case "ADD_RESOURCE":
      let foundIndex = newState.resources?.findIndex(
        (one) => one.name === action.payload.resource.name
      );
      if (foundIndex === -1) {
        const resourceToAdd = {
          ...action.payload.resource,
          loadData:
            action.payload?.resource?.loadData == undefined
              ? true
              : action.payload?.resource?.loadData,
        };
        newState.resources?.push(resourceToAdd);
      } else {
        return state;
      }
      return { ...newState };
    case "DELETE_RESOURCE":
      let foundIndexToDelete = newState.resources?.findIndex(
        (one) => one.name === action.payload.resource.name
      );
      if (foundIndex === -1) {
        return state;
      } else {
        newState = _.remove(newState.resources, function (currentObject) {
          return currentObject.name === action.payload.resource.name;
        });
      }
      return { ...newState };
    case "LOAD_DATA":
      let foundIndexLoad = newState.resources?.findIndex(
        (one) => one.name === action.payload.key
      );
      let foundResource;
      if (foundIndexLoad != undefined) {
        foundResource = newState.resources[foundIndexLoad];
        if (!foundResource) {
          return state;
        }
        if (foundResource.loadData) {
          return state;
        }

        foundResource.loadData = true;
        newState.resources[foundIndexLoad] = foundResource;
      } else {
        return state;
      }

      return { ...newState };
    case "SET_DATA":
      currentValue = _.get(newState, action.payload.key);
      if (currentValue === action.payload.value) return state;

      newState = _.set(newState, action.payload.key, action.payload.value);

      return { ...newState };
    default:
      return state;
  }
};
