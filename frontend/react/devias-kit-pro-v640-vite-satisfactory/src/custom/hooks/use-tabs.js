import { useState, useEffect, useCallback } from 'react';
import { useQueryParam } from 'use-query-params';

const useTabs = ({ initial = '', queryParamName = 'tab', onTabChange }) => {
  const [tab, setTab] = useState(initial);
  const [query, setQuery] = useQueryParam(queryParamName);

  useEffect(() => {
    if (queryParamName) {
      // If there is a query param named tab then set that tab
      const params = new URLSearchParams(window.location.search);
      const tabQuery = params.get(queryParamName);
      if (tabQuery) {
        setTab(tabQuery);
      }
    }
  }, []);

  const handleTabChange = useCallback((_e, newValue) => {
    setTab(newValue);
    if (queryParamName && setQuery) {
      setQuery(newValue);
    }
  }, []);

  return { tab, handleTabChange, setTab };
};

export default useTabs;
