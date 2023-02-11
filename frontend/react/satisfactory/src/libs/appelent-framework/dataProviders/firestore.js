import React, { useEffect, useMemo } from "react";
import { useFirestoreCollectionData } from "../hooks/use-firestore-collection-data";
import { ActionType, useData } from "../caching";
import { doc, query } from "firebase/firestore";
import _ from "lodash";
import { useFirestoreDocument } from "../hooks/use-firestore-document";

export const firestoreKeys = [
  "collections",
  "collectionObjects",
  "documents",
  "queries",
];

export const useFirestoreMount = (globalData) => {
  let dataComponents = [];

  const resources = globalData.resources.filter(
    (one) => one.options?.dataProviderName === "firestore"
  );
  for (const resource of resources) {
    if (resource.loadData) {
      dataComponents.push(
        <GlobalDataFirestore key={resource.name} resource={resource} />
      );
    }
  }
  return dataComponents;
};

const getQuery = (givenCollection, givenQuery) => {
  if (!givenCollection) return undefined;
  if (!givenQuery) return givenCollection;
  return query(givenCollection, ...givenQuery);
};

export const GlobalDataFirestore = ({ resource }) => {
  //useGlobalDataFirestoreCollection(storeKey);
  const { dispatch, ...globalData } = useData();
  let {
    query: givenQuery,
    options: givenOptions,
    collection: givenCollection,
    document: givenDocument,
  } = resource.options || {};
  // const resource = globalData.resources?.find(
  //   (resource) => resource.name === storeKey
  // );
  const type = resource.options.document ? "document" : "collection";
  givenQuery = givenQuery
    ? givenQuery
    : _.get(globalData, resource.name + ".options.query");
  givenOptions = givenOptions
    ? givenOptions
    : _.get(globalData, resource.name + ".options.options");
  givenCollection = givenCollection
    ? givenCollection
    : _.get(globalData, resource.name + ".options.collection");
  givenDocument = givenDocument
    ? givenDocument
    : _.get(globalData, resource.name + ".options.document");
  const newQuery =
    type === "document"
      ? doc(givenCollection, givenDocument)
      : getQuery(givenCollection, givenQuery);

  const hooks = {
    collection: useFirestoreCollectionData,
    //collectionObjects: useFirestoreCollectionDataObject,
    document: useFirestoreDocument,
  };

  const meta = useMemo(() => {
    const metaObject = {
      dataProviderName: "firestore",
    };
    if (type === "document") {
      return {
        ...metaObject,
        path: doc(givenCollection, givenDocument).path,
        type: "document",
      };
    }
    return { ...metaObject, path: givenCollection.path, type: "collection" };
  }, [resource]);

  //const auth = getAuth();
  const [data, loading, error] = hooks[type](newQuery, givenOptions);

  //Update state on data change
  useEffect(() => {
    if (dispatch && data != undefined) {
      let newData = data;
      if (resource.options?.postProcess) {
        newData = resource.options.postProcess(data);
      }
      dispatch({
        type: ActionType.SET_DATA,
        payload: { key: "data." + resource.name + ".data", value: newData },
      });
    }
  }, [data]);

  useEffect(() => {
    if (dispatch && loading != undefined) {
      dispatch({
        type: ActionType.SET_DATA,
        payload: { key: "data." + resource.name + ".loading", value: loading },
      });
    }
  }, [loading]);

  useEffect(() => {
    if (dispatch && error != undefined) {
      dispatch({
        type: ActionType.SET_DATA,
        payload: { key: "data." + resource.name + ".error", value: error },
      });
    }
  }, [error]);

  useEffect(() => {
    if (dispatch && meta != undefined) {
      dispatch({
        type: ActionType.SET_DATA,
        payload: {
          key: "data." + resource.name + ".meta",
          value: meta,
        },
      });
    }
  }, [meta]);

  return <></>;
};
