import _ from 'lodash';
import { useCallback, useMemo } from 'react';

export const useFormikCrud = (formik, key, options) => {
  const { idKey = 'id' } = options || {};

  const getFieldValue = useCallback((values, key) => {
    const value = _.get(values, key);
    return value;
  }, []);

  const values = useMemo(
    () => getFieldValue(formik.values, key),
    [formik.values, key, getFieldValue]
  );

  const type = useMemo(
    () => (Array.isArray(values) ? 'array' : _.isObject(values) ? 'object' : 'string'),
    [values]
  );

  const addItem = useCallback(
    (value) => {
      if (!type === 'array') return;
      const currentItems = [...values];
      currentItems.push(value);
      //formik.setFieldValue(key, currentItems);
    },
    [values, type]
  );

  const setItem = useCallback(
    (id, value) => {
      let currentItems = values;
      if (type === 'array') {
        currentItems = [...values];
        const index = currentItems.findIndex((currentId) => currentId[idKey] === id);
        currentItems[index] = value;
      } else if (type === 'object') {
        currentItems[id] = value;
      } else {
        currentItems = id;
      }
      //formik.setFieldValue(key, currentItems);
    },
    [idKey, type, values]
  );

  const removeItem = useCallback(
    (id) => {
      if (!type === 'array') return;
      let currentItems = [...values];
      currentItems = currentItems.filter((currentId) => currentId[idKey] !== id);
      //formik.setFieldValue(key, currentItems);
    },
    [idKey, type, values]
  );

  return [values, addItem, setItem, removeItem];
};
