import { useEffect } from "react";
import { useFirestoreCollectionData } from "hooks/use-firestore-collection-data";
import { useFirestoreCollectionDataObject } from "hooks/use-firestore-collection-data-object";
import { ActionType, useGlobalData } from "./global-data";

export const firestoreKeys = [
  "collections",
  "collectionObjects",
  "documents",
  "queries",
];

export const useLoadFirestore = (globalData) => {
  let dataComponents = [];
  console.log(456, globalData);
  for (const firestoreKey of firestoreKeys) {
    for (const key in globalData.firestore?.[firestoreKey]) {
      const value = globalData.firestore?.[firestoreKey][key];
      console.log(
        firestoreKey,
        key,
        value,
        value.loadData,
        globalData.firestore.collections.dummy.loadData
      );
      if (value.loadData) {
        console.log("jawel1", value.loadData);
        if (firestoreKey === "collections") {
          console.log("jawel");
          dataComponents.push(
            <GlobalDataFirestoreCollection
              key={key}
              storeKey={`firestore.${firestoreKey}.${key}`}
              query={value.query}
              options={value.options}
            />
          );
        } else if (firestoreKey === "collectionObjects") {
          dataComponents.push(
            <GlobalDataFirestoreCollectionObject
              key={key}
              storeKey={`firestore.${firestoreKey}.${key}`}
              query={value.query}
              options={value.options}
            />
          );
        }
      }
    }
  }
  console.log(dataComponents);
  return dataComponents;
};

export const GlobalDataFirestoreCollection = ({ storeKey, query, options }) => {
  useGlobalDataFirestoreCollection(storeKey, query, options);
  console.log(123, storeKey);
  return <></>;
};

export const useGlobalDataFirestoreCollection = (storeKey, query, options) => {
  const [data, loading, error] = useFirestoreCollectionData(query, options);
  const { dispatch } = useGlobalData();
  console.log(123, data, loading, error);
  //Update state on data change
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: ActionType.STORE_DATA,
        payload: { storeKey, data, loading, error },
      });
    }
  }, [data, loading, error]);
};

export const GlobalDataFirestoreCollectionObject = ({
  storeKey,
  query,
  options,
}) => {
  useGlobalDataFirestoreCollectionObject(storeKey, query, options);
  return <></>;
};

export const useGlobalDataFirestoreCollectionObject = (
  storeKey,
  query,
  options
) => {
  const [data, loading, error] = useFirestoreCollectionDataObject(
    query,
    options
  );
  const { dispatch } = useGlobalData();

  //Update state on data change
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: ActionType.STORE_DATA,
        payload: { storeKey, data, loading, error },
      });
    }
  }, [data, loading, error]);
};
