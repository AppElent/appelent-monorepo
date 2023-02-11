import { useEffect, useMemo } from "react";
import _ from "lodash";

import { useAppelentFramework } from "./index";

export const useData = (key, options) => {
  const globalData = useAppelentFramework();

  useEffect(() => {
    if (key) {
      if (typeof key === "string" || key instanceof String) {
        if (globalData.dispatch && key) {
          globalData.dispatch({
            type: ActionType.LOAD_DATA,
            payload: { key, options },
          });
        }
      } else if (_.isObject(key)) {
        if (globalData.dispatch && key) {
          globalData.dispatch({
            type: ActionType.ADD_RESOURCE,
            payload: { resource: key },
          });
        }
      }
    }
  }, [key, options, globalData.dispatch]);
  if (!key) return globalData;

  let data;
  if (typeof key === "string" || key instanceof String) {
    data = _.get(globalData, "data." + key);
  } else if (_.isObject(key)) {
    data = _.get(globalData, "data." + key.name);
  }

  // const resource = globalData.resources?.find(
  //   (resource) => resource.name === key
  // );

  // if (resource?.options?.postProcess && data?.data) {
  //   const newData = resource.options.postProcess(data.data);
  //   return { ...data, data: newData };
  // }

  return data || {};

  // const returnData = useMemo(() => {
  //   console.log("jaja", data, resource?.postProcess);
  //   if (resource?.options?.postProcess && data?.data) {
  //     const newData = resource.options.postProcess(data.data);
  //     return { ...data, data: newData };
  //   } else {
  //     return data;
  //   }
  // }, [key, globalData.data[key]?.data]);

  // return returnData || {};
};

export let ActionType;
(function (ActionType) {
  ActionType["ADD_RESOURCE"] = "ADD_RESOURCE";
  ActionType["LOAD_DATA"] = "LOAD_DATA";
  ActionType["SET_DATA"] = "SET_DATA";
})(ActionType || (ActionType = {}));

export const reducer = (state, action) => {
  console.log("Globaldatadispatch", state, action);
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
        const resourceToAdd = { ...action.payload.resource, loadData: true };
        newState.resources?.push(resourceToAdd);
      } else {
        return state;
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

      // if (!foundResource) {
      //   foundResource = {
      //     name: action.payload.key,
      //     options: action.payload.options,
      //     loadData: true,
      //   };
      //   newState.resources?.push(foundResource);
      // } else {
      //   foundResource.loadData = true;
      //   newState.resources[foundIndex] = foundResource;
      // }

      return { ...newState };
    case "SET_DATA":
      currentValue = _.get(newState, action.payload.key);
      if (currentValue === action.payload.value) return state;
      // let foundResourceSet = newState.resources?.find(
      //   (one) => one.name === action.payload.key
      // );
      // console.log(action.payload.key, foundResourceSet);
      // if (foundResourceSet && foundResourceSet.options?.postProcess) {
      //   const newValue = foundResourceSet.options.postProcess(
      //     action.payload.value
      //   );
      //   newState = _.set(newState, action.payload.key, newValue);
      // } else {
      //   newState = _.set(newState, action.payload.key, action.payload.value);
      // }

      newState = _.set(newState, action.payload.key, action.payload.value);

      return { ...newState };
    default:
      return state;
  }
};
