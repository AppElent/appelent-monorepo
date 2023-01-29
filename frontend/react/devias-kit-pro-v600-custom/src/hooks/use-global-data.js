import { useEffect } from "react";
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { db, useFirebaseData } from "libs/firebase";

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

export const useGlobalData = () => {
  const [dummyData, dummyDataLoading, dummyDataError] = useCollectionData(
    collection(db, "dummy")
  );
  const firebase = useFirebaseData();

  // Function to report after initialization
  useEffect(() => {
    if (!dummyDataLoading && firebase.setData) {
      firebase.setData((prevState) => ({
        ...prevState,
        isInitialized: true,
      }));
    }
  }, [dummyDataLoading]);

  //Update state on data change
  useEffect(() => {
    if (firebase.setData) {
      firebase.setData((prevState) => ({
        ...prevState,
        firestore: {
          collections: {
            dummy: {
              data: dummyData,
              loading: dummyDataLoading,
              error: dummyDataError,
              ref: collection(db, "dummy"),
            },
          },
        },
      }));
    }
  }, [dummyData, dummyDataLoading, dummyDataError]);
};
