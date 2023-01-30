import { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const useFirestoreCollectionData = (query, options, process) => {
  const [values, loading, error, snapshot] = useCollectionData(query, options);
  const [valuesNew, setValuesNew] = useState();

  useEffect(() => {
    if (values) {
      let valueArray = values;
      if (process) {
        valueArray = process(valueObject);
      }
      setValuesNew(valueArray);
    } else {
      setValuesNew(values);
    }
  }, [values]);

  return [valuesNew, loading, error, snapshot];
};
