import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Divider,
  MenuItem,
  Select,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/app';
import { ItemDrawer } from 'src/components/app/list/item-drawer';
import { ItemListContainer } from 'src/components/app/list/item-list-container';
import { ItemListSearch } from 'src/components/app/list/item-list-search';
import { ItemListTableContainer } from 'src/components/app/list/item-list-table';
import { ItemDetailsContainer } from 'src/components/app/list/item-drawer/item-details';
import { SeverityPill } from 'src/components/severity-pill';
//import { useSearch, useItems } from "components/app/list/utils";

import prodv700 from 'src/custom/libs/satisfactory/data/v700/productionRecipes.json';
import prodv800 from 'src/custom/libs/satisfactory/data/v800/productionRecipes.json';
import { paginate } from 'src/custom/libs/paginate';
import { useRouter } from 'src/hooks/use-router';
import {
  getSatisfactoryData,
  SatisfactoryCurrentVersion,
  satisfactoryVersions,
} from 'src/custom/libs/satisfactory';
import { SatisfactoryRecipeDetail } from 'src/sections/app/satisfactory/recipes/recipe-detail';
import { useTranslate } from '@refinedev/core';
import { tokens } from 'src/locales/tokens';
import { Seo } from 'src/components/seo';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

const recipes = {
  v600: [],
  v700: prodv700,
  v800: prodv800,
};

// let satisfactoryProducts = products[SatisfactoryCurrentVersion]
// let satisfactoryProductsArray = Object.keys(satisfactoryProducts).map((k) => ({
//   ...satisfactoryProducts[k],
//   className: k,
// }));
// satisfactoryProductsArray = satisfactoryProductsArray.sort(function (a, b) {
//   return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
// });

const statusMap = {
  complete: 'success',
  pending: 'info',
  canceled: 'warning',
  rejected: 'error',
};

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      query: undefined,
      status: undefined,
    },
    page: 0,
    rowsPerPage: 5,
    sortBy: 'createdAt',
    sortDir: 'desc',
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useItems = (search, version) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    items: [],
    itemsCount: 0,
  });

  const getItems = useCallback(async () => {
    try {
      const satisfactoryProducts = recipes[version];
      let satisfactoryProductsArray = Object.keys(satisfactoryProducts).map((k) => ({
        ...satisfactoryProducts[k],
        className: k,
      }));
      satisfactoryProductsArray = satisfactoryProductsArray.sort(function (a, b) {
        return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
      });
      //const response = satisfactoryProducts; // filter items here
      let response = satisfactoryProductsArray;

      // search result
      if (search.filters?.query) {
        response = response.filter((obj) => {
          return JSON.stringify(obj).toLowerCase().includes(search.filters.query.toLowerCase());
        });
      }

      const responsePaginated = paginate(response, search.rowsPerPage, search.page + 1);

      if (isMounted()) {
        setState({
          items: response,
          itemsCount: response.length,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [search, version, isMounted]);

  useEffect(
    () => {
      getItems();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search, version]
  );

  return state;
};

const tabOptions = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'S-Tier',
    value: 's',
  },
  {
    label: 'A-Tier',
    value: 'a',
  },
  {
    label: 'B-Tier',
    value: 'b',
  },
  {
    label: 'C-Tier',
    value: 'c',
  },
  {
    label: 'D-Tier',
    value: 'd',
  },
  {
    label: 'F-Tier',
    value: 'f',
  },
];

const sortOptions = [
  // {
  //   label: "Newest",
  //   value: "desc",
  // },
  // {
  //   label: "Oldest",
  //   value: "asc",
  // },
];

const Page = () => {
  const rootRef = useRef(null);
  const router = useRouter();
  const [productQuery, setProductQuery] = useQueryParam('recipe');
  const { search, updateSearch } = useSearch();
  const [version, setVersion] = useQueryParam(
    'version',
    withDefault(StringParam, SatisfactoryCurrentVersion)
  );
  const translate = useTranslate();
  const { items, itemsCount } = useItems(search, version);
  const buildables = getSatisfactoryData('buildables');

  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined,
  });
  const currentItem = useMemo(() => {
    if (!drawer.data) {
      return undefined;
    }
    const item = items.find((item) => item.slug === drawer.data);
    return getSatisfactoryData('recipes', version)[item.className];
  }, [drawer, version]);

  const itemsPaginated = paginate(items, search.rowsPerPage, search.page + 1);

  useEffect(() => {
    // If product query param is present, set currentItem
    if (productQuery) {
      handleItemOpen(productQuery);
    }
  }, []);

  usePageView();

  const [isEditing, setIsEditing] = useState(false);

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

  const handleSortChange = useCallback(
    (sortDir) => {
      updateSearch((prevState) => ({
        ...prevState,
        sortDir,
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

  const handleItemOpen = useCallback(
    (orderId) => {
      // Close drawer if is the same order

      if (drawer.isOpen && drawer.data === orderId) {
        setDrawer({
          isOpen: false,
          data: undefined,
        });
        return;
      }

      setProductQuery(orderId);

      setDrawer({
        isOpen: true,
        data: orderId,
      });
    },
    [drawer]
  );

  const handleItemClose = useCallback(() => {
    setProductQuery(undefined);
    setDrawer({
      isOpen: false,
      data: undefined,
    });
  }, []);

  return (
    <>
      <Seo title="Products" />
      <Divider />
      <Box
        component="main"
        ref={rootRef}
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            bottom: 0,
            display: 'flex',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        >
          <ItemListContainer open={drawer.isOpen}>
            <Box sx={{ p: 3 }}>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography variant="h4">
                    {translate(tokens.satisfactory.pages.recipes.title)}
                  </Typography>
                </div>
                <div>
                  {/* <Button
                    startIcon={
                      <SvgIcon>
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    Add
                  </Button> */}
                  <Select
                    defaultValue={version}
                    label="Version"
                    name="version"
                    onChange={(event) => {
                      setVersion(event.target.value);
                    }}
                    value={version}
                  >
                    {satisfactoryVersions.map((satisfactoryVersion) => (
                      <MenuItem
                        key={satisfactoryVersion.key}
                        value={satisfactoryVersion.key}
                      >
                        {satisfactoryVersion.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </Stack>
            </Box>
            <Divider />
            <ItemListSearch
              onFiltersChange={handleFiltersChange}
              onSortChange={handleSortChange}
              sortBy={search.sortBy}
              sortDir={search.sortDir}
              tabOptions={tabOptions}
              sortOptions={sortOptions}
              directQuery={true}
            />
            <Divider />
            <ItemListTableContainer
              onItemSelect={handleItemOpen}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              items={items}
              itemsCount={itemsCount}
              page={search.page}
              rowsPerPage={search.rowsPerPage}
            >
              {itemsPaginated.map((item) => {
                return (
                  <TableRow
                    hover
                    key={item.slug}
                    onClick={() => handleItemOpen?.(item.slug)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.200',
                          bitemRadius: 2,
                          maxWidth: 'fit-content',
                          ml: 3,
                          p: 1,
                        }}
                      >
                        <Typography
                          align="center"
                          variant="subtitle2"
                        >
                          {60 / item.craftTime} p.m.
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle2">{item.name}</Typography>
                        <Typography
                          color="text.secondary"
                          variant="body2"
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <SeverityPill color="info">{buildables[item.producedIn]?.name}</SeverityPill>
                    </TableCell>
                  </TableRow>
                );
              })}
            </ItemListTableContainer>
          </ItemListContainer>
          <ItemDrawer
            container={rootRef.current}
            onClose={handleItemClose}
            open={drawer.isOpen}
            item={currentItem}
            title={currentItem?.number}
          >
            {!isEditing ? (
              <ItemDetailsContainer>
                {/* <Button
                  onClick={() => {
                    router.push(paths.app.satisfactory.recipes.detail + currentItem.className);
                  }}
                  size="small"
                  variant="contained"
                >
                  {translate(tokens.satisfactory.pages.recipes.fullscreen)}
                </Button> */}
                {currentItem && (
                  <SatisfactoryRecipeDetail
                    recipe={currentItem}
                    translate={translate}
                  />
                )}
              </ItemDetailsContainer>
            ) : (
              <></>
            )}
            {/* <ItemEditContainer
                onCancel={handleEditCancel}
                onSave={formik.handleSubmit}
                item={currentItem}
              >
                Content edit
              </ItemEditContainer>
            )} */}
          </ItemDrawer>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
