import { useCallback, useEffect, useState } from 'react';
import { useMounted } from './use-mounted';

function paginate(array, page_size, page_number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

const useSearch = (initialSearch) => {
  const startingFilters = {
    query: undefined,
    search: undefined,
    filters: undefined,
    function: undefined,
    page: 0,
    rowsPerPage: 5,
    sortBy: undefined,
    sortDir: 'asc',
    ...initialSearch,
  };
  const [search, setSearch] = useState(startingFilters);

  const resetSearch = () => {
    setSearch(startingFilters);
  };

  return {
    search,
    updateSearch: setSearch,
    resetSearch,
  };
};

export const useItems = (items, initialSearch) => {
  const isMounted = useMounted();
  const { search, updateSearch, resetSearch } = useSearch(initialSearch);
  const [state, setState] = useState(items || []);
  const [pageItems, setPageItems] = useState(items || []);
  const [selected, setSelected] = useState();

  const getItems = useCallback(async () => {
    try {
      let response = items;
      // search result
      if (search.search) {
        response = response.filter((obj) => {
          return JSON.stringify(obj)
            .toLowerCase()
            .includes(search?.search?.toLowerCase() || '');
        });
      }

      // Sort results if property is set
      if (search.sortBy) {
        response = response.sort(function (a, b) {
          return a[search.sortBy] > b[search.sortBy]
            ? 1
            : b[search.sortBy] > a[search.sortBy]
            ? -1
            : 0;
        });
        if (search.sortDir && search.sortDir === 'desc') {
          response.reverse();
        }
      }

      if (search.filters) {
        Object.keys(search.filters).forEach((key) => {
          if (Array.isArray(search.filters[key])) {
            response = response.filter((resp) => search.filters[key].includes(resp[key]));
          } else if (search.filters[key].constructor === Object) {
            //console.log(search.filters[key]);
          } else {
            response = response.filter((resp) => resp[key] === search.filters[key]);
          }
        });
      }

      const responsePaginated = paginate(response, search.rowsPerPage, search.page + 1);

      if (isMounted()) {
        setState(response);
        setPageItems(responsePaginated);
      }
    } catch (err) {
      console.error(err);
    }
  }, [items, search, isMounted]);

  useEffect(
    () => {
      getItems();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search, items]
  );

  const handleFiltersChange = useCallback(
    (filters) => {
      updateSearch((prevState) => ({
        ...prevState,
        filters,
        page: 0,
      }));
    },
    [updateSearch]
  );

  const handleSetChange = useCallback(
    (set) => {
      updateSearch((prevState) => ({
        ...prevState,
        ...set,
        page: 0,
      }));
    },
    [updateSearch]
  );

  const handleQueryChange = useCallback(
    (query) => {
      updateSearch((prevState) => ({
        ...prevState,
        query,
        page: 0,
      }));
    },
    [updateSearch]
  );

  const handleSearchChange = useCallback(
    (query) => {
      updateSearch((prevState) => ({
        ...prevState,
        search: query,
        page: 0,
      }));
    },
    [updateSearch]
  );

  const handleSortChange = useCallback(
    (sortDir) => {
      updateSearch((prevState) => ({
        ...prevState,
        sortDir,
      }));
    },
    [updateSearch]
  );

  const handleSortByChange = useCallback(
    (sortBy) => {
      updateSearch((prevState) => ({
        ...prevState,
        sortBy,
      }));
    },
    [updateSearch]
  );

  const handlePageChange = useCallback(
    (event, page) => {
      updateSearch((prevState) => ({
        ...prevState,
        page,
      }));
    },
    [updateSearch]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      updateSearch((prevState) => ({
        ...prevState,
        rowsPerPage: parseInt(event.target.value, 10),
      }));
    },
    [updateSearch]
  );

  const handleSelectedChange = useCallback(
    (event) => {
      setSelected(event.target.value);
    },
    [setSelected]
  );

  const handleTabsChange = useCallback((event, tab) => {
    (event) => {
      updateSearch((prevState) => ({
        ...prevState,
        tab: event.target.value,
      }));
    },
      [updateSearch];
  }, []);

  const resetFilters = useCallback(() => {
    () => {
      resetSearch();
    },
      [updateSearch];
  }, []);

  return {
    handlers: {
      handleFiltersChange,
      handleQueryChange,
      handlePageChange,
      handleRowsPerPageChange,
      handleSortChange,
      handleSortByChange,
      handleSelectedChange,
      handleSearchChange,
      handleSetChange,
      handleTabsChange,
      resetFilters,
    },
    search,
    selected,
    pageItems,
    items: state,
    allItems: items,
  };
};
