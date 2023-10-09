import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Divider,
  MenuItem,
  Select,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
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
import {
  getSatisfactoryData,
  getSatisfactoryDataArray,
  SatisfactoryCurrentVersion,
  satisfactoryVersions,
} from 'src/custom/libs/satisfactory';
import { SatisfactoryRecipeDetail } from 'src/sections/app/satisfactory/recipes/recipe-detail';
import { useTranslate } from '@refinedev/core';
import { tokens } from 'src/locales/tokens';
import { Seo } from 'src/components/seo';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useItems } from 'src/custom/hooks/use-items';

const recipes = {
  v600: [],
  v700: prodv700,
  v800: prodv800,
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
  const [productQuery, setProductQuery] = useQueryParam('recipe');
  const [version, setVersion] = useQueryParam(
    'version',
    withDefault(StringParam, SatisfactoryCurrentVersion)
  );
  const translate = useTranslate();

  const [recipeArray, setRecipeArray] = useState([]);
  const { items, search, handlers, pageItems } = useItems(recipeArray, {
    sortBy: 'name',
    rowsPerPage: 10,
  });

  useEffect(() => {
    const satisfactoryProducts = recipes[version];
    let satisfactoryProductsArray = Object.keys(satisfactoryProducts).map((k) => ({
      ...satisfactoryProducts[k],
      className: k,
    }));
    setRecipeArray(satisfactoryProductsArray);
    handlers.handlePageChange(undefined, 0);
  }, [version]);

  const buildables = getSatisfactoryData('buildables');

  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined,
  });
  const currentItem = useMemo(() => {
    if (items.length > 0) {
      if (!drawer.data) {
        return undefined;
      }

      const item = items.find((item) => item.slug === drawer.data);
      console.log(items, item, drawer.data);
      return getSatisfactoryDataArray('recipes', version).find(
        (r) => r.className === item.className
      );
    }
    return undefined;
  }, [items, drawer, version]);

  useEffect(() => {
    // If product query param is present, set currentItem
    if (productQuery) {
      handleItemOpen(productQuery);
    }
  }, []);

  usePageView();

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
              </Stack>
            </Box>
            <Divider />
            <ItemListSearch
              onFiltersChange={handlers.handleSetChange}
              onSortChange={handlers.handleSortChange}
              sortBy={search.sortBy}
              sortDir={search.sortDir}
              tabOptions={tabOptions}
              sortOptions={sortOptions}
              directQuery={true}
            />
            <Divider />
            <ItemListTableContainer
              onItemSelect={handleItemOpen}
              onPageChange={handlers.handlePageChange}
              onRowsPerPageChange={handlers.handleRowsPerPageChange}
              items={items}
              itemsCount={items.length || 0}
              page={search.page || 0}
              rowsPerPage={search.rowsPerPage}
            >
              {pageItems.map((item) => {
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
                          sx={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 1,
                          }}
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
          </ItemDrawer>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
