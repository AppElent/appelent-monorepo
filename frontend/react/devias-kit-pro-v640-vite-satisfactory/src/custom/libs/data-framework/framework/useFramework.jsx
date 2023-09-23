import _ from 'lodash';

import { useDataFramwork, logger } from '../index';

export const useResource = (key) => {
  const globalData = useDataFramwork();
  return globalData?.resources.find((resource) => resource.name === key);
};
