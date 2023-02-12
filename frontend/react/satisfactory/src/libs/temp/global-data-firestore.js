import React, { useEffect } from "react";
import { useFirestoreCollectionData } from "hooks/use-firestore-collection-data";
import { useFirestoreCollectionDataObject } from "hooks/use-firestore-collection-data-object";
import { ActionType, useGlobalData } from "./global-data";
import { query } from "firebase/firestore";
import _ from "lodash";
import { useFirestoreDocument } from "hooks/use-firestore-document";

export const firestoreKeys = [
  "collections",
  "collectionObjects",
  "documents",
  "queries",
];

export const useLoadFirestore = (globalData) => {
  let dataComponents = [];
  //const globalData = useGlobalData();
  for (const firestoreKey of firestoreKeys) {
    for (const key in globalData.firestore?.[firestoreKey]) {
      const value = globalData.firestore?.[firestoreKey][key];
      if (value.loadData) {
        dataComponents.push(
          <GlobalDataFirestore
            key={firestoreKey + key}
            storeKey={`firestore.${firestoreKey}.${key}`}
            options={value.options}
          />
        );
      }
    }
  }
  return dataComponents;
};

const getQuery = (givenCollection, givenQuery) => {
  if (!givenCollection) return undefined;
  if (!givenQuery) return givenCollection;
  return query(givenCollection, ...givenQuery);
};

export const GlobalDataFirestore = ({ storeKey, options }) => {
  //useGlobalDataFirestoreCollection(storeKey);
  const { dispatch, ...globalData } = useGlobalData();
  let {
    query: givenQuery,
    options: givenOptions,
    collection: givenCollection,
    document: givenDocument,
  } = options || {};
  const type = storeKey.split(".")[1];
  givenQuery = givenQuery
    ? givenQuery
    : _.get(globalData, storeKey + ".options.query");
  givenOptions = givenOptions
    ? givenOptions
    : _.get(globalData, storeKey + ".options.options");
  givenCollection = givenCollection
    ? givenCollection
    : _.get(globalData, storeKey + ".options.collection");
  givenDocument = givenDocument
    ? givenDocument
    : _.get(globalData, storeKey + ".options.collection");
  const newQuery =
    type === "documents"
      ? givenDocument
      : getQuery(givenCollection, givenQuery);

  const hooks = {
    collections: useFirestoreCollectionData,
    collectionObjects: useFirestoreCollectionDataObject,
    documents: useFirestoreDocument,
  };

  //const auth = getAuth();
  const [data, loading, error] = hooks[type](newQuery, givenOptions);

  //Update state on data change
  useEffect(() => {
    if (dispatch && data != undefined) {
      dispatch({
        type: ActionType.SET_DATA,
        payload: { key: storeKey + ".data", value: data },
      });
    }
  }, [data]);

  useEffect(() => {
    if (dispatch && loading != undefined) {
      dispatch({
        type: ActionType.SET_DATA,
        payload: { key: storeKey + ".loading", value: loading },
      });
    }
  }, [loading]);

  useEffect(() => {
    if (dispatch && error != undefined) {
      dispatch({
        type: ActionType.SET_DATA,
        payload: { key: storeKey + ".error", value: error },
      });
    }
  }, [error]);

  return <></>;
};
