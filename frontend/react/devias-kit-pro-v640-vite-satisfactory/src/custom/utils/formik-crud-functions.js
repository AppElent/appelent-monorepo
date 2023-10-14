import _ from 'lodash';

export const addFormikArrayItem = (formik, key) => (value) => {
  const values = _.get(formik.values, key) || [];
  const currentItems = [...values];
  currentItems.push(value);
  formik.setFieldValue(key, currentItems);
};

export const removeFormikArrayItem =
  (formik, key) =>
  (id, idKey = 'id') => {
    const values = _.get(formik.values, key) || [];

    let currentItems = [...values];
    currentItems = currentItems.filter((currentId) => currentId[idKey] !== id);
    formik.setFieldValue(key, currentItems);
  };

export const setFormikArrayItem =
  (formik, key) =>
  (id, value, idKey = 'id') => {
    const values = _.get(formik.values, key) || [];
    let currentItems = [...values];
    const index = currentItems.findIndex((currentId) => currentId[idKey] === id);
    currentItems[index] = value;
    formik.setFieldValue(key, currentItems);
  };

export const removeFormikItem = (formik, key) => () => {
  return _.unset(formik.values, key);
};

export const setFormikItem = (formik, key) => (value) => {
  return _.set(formik.values, key, value);
};

export const updateFormikItem = (formik, key) => (updateFn) => {
  return _.update(formik.values, key, updateFn);
};
