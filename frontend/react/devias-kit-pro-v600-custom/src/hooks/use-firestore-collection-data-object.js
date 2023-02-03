import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

export const useFirestoreCollectionDataObject = (query, options, process) => {
  const [values, loading, error, snapshot] = useCollection(query, options);
  const [valuesNew, setValuesNew] = useState();

  useEffect(() => {
    if (values) {
      let valueObject = {};
      values.forEach((value) => {
        const id = value.id;
        valueObject[id] = { id, ...value.data(), docRef: value };
      });

      if (process) {
        valueObject = process(valueObject);
      }

      setValuesNew(valueObject);
    } else {
      setValuesNew(values);
    }
  }, [values]);

  return [valuesNew, loading, error, snapshot];
};
