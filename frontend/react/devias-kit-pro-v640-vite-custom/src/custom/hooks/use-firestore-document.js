import { useEffect, useState } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';

export const useFirestoreDocument = (query, options, process) => {
  const [values, loading, error, snapshot] = useDocument(query, options);
  const [valuesNew, setValuesNew] = useState();

  useEffect(() => {
    if (values) {
      const returnObject = {
        ...values.data(),
        id: values.id,
        //docRef: values.ref,
        meta: {
          type: values.ref.type,
          id: values.ref.id,
          path: values.ref.path,
        },
      };

      if (process) {
        const valueArray = process(returnObject);
      }

      setValuesNew(returnObject);
    } else {
      setValuesNew(values);
    }
  }, [values]);

  return [valuesNew, loading, error, snapshot];
};
