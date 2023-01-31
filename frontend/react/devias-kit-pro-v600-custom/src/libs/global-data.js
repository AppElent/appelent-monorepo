import { useEffect } from "react";
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, useFirebaseData } from "libs/firebase";
import { getAuth } from "firebase/auth";
import { useFirestoreCollectionData } from "./use-firestore-collection-data";
import { useFirestoreCollectionDataObject } from "./use-firestore-collection-data-object";

export const firebaseInitialData = {
  firestore: {
    collections: {},
    documents: {},
    queries: {},
    isInitialized: false,
  },
  isInitialized: false,
  setData: () => {},
};

export const GlobalDataFirestoreCollection = ({ query, options }) => {
  const data = useGlobalDataFirestoreCollection(query, options);
  return <></>;
};

export const useGlobalDataFirestoreCollection = (key, query, options) => {
  const [data, loading, error] = useFirestoreCollectionData(query, options);
  // const [tokenData, tokenDataLoading, tokenDataError] =
  //   useFirestoreCollectionDataObject(
  //     collection(db, `users/${auth.currentUser.uid}/tokens`)
  //   );
  const firebase = useFirebaseData();

  // Function to report after initialization
  // useEffect(() => {
  //   if (!dummyDataLoading && firebase.setData) {
  //     firebase.setData((prevState) => ({
  //       ...prevState,
  //       isInitialized: true,
  //     }));
  //   }
  // }, [dummyDataLoading, tokenDataLoading]);

  //Update state on data change
  useEffect(() => {
    if (firebase.setData) {
      firebase.setData((prevState) => ({
        ...prevState,
        firestore: {
          ...prevState.firestore,
          collections: {
            ...prevState.firestore.collections,
            [key]: {
              data,
              loading,
              error,
              ref: query,
              options,
            },
          },
        },
      }));
    }
  }, [data, loading, error]);
};
