import { useState, useEffect, useCallback } from 'react';

const useTabs = (initialTab = '', tabname = 'tab', onTabChange) => {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    if (tabname) {
      // If there is a query param named tab then set that tab
      const params = new URLSearchParams(window.location.search);
      const tabQuery = params.get(tabname);
      if (tabQuery) {
        setTab(tabQuery);
      }
    }
  }, [location.search]);

  const handleTabChange = useCallback((_e, newValue) => {
    setTab(newValue);
  }, []);

  return { tab, handleTabChange, setTab };
};

export default useTabs;
