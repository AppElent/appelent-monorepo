import {
  Box,
  Divider,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslate } from '@refinedev/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ItemDrawer } from 'src/components/app/list/item-drawer';
import { ItemDetailsContainer } from 'src/components/app/list/item-drawer/item-details';
import { ItemListContainer } from 'src/components/app/list/item-list-container';
import { ItemListSearch } from 'src/components/app/list/item-list-search';
import { ItemListTableContainer } from 'src/components/app/list/item-list-table';
import { Seo } from 'src/components/seo';
import { SeverityPill } from 'src/components/severity-pill';
import { useItems } from 'src/custom/hooks/use-items';
//import { useSearch, useItems } from "components/app/list/utils";
import {
  getSatisfactoryData,
  getSatisfactoryDataArray,
  SatisfactoryCurrentVersion,
} from 'src/custom/libs/satisfactory';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/app';
import { tokens } from 'src/locales/tokens';
import { SatisfactoryRecipeDetail } from 'src/sections/app/satisfactory/recipes/recipe-detail';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

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
  const [version] = useQueryParam('version', withDefault(StringParam, SatisfactoryCurrentVersion));
  const translate = useTranslate();

  const recipeArray = useMemo(() => getSatisfactoryDataArray('recipes', version), [version]);
  const buildables = useMemo(() => getSatisfactoryData('buildables', version), [version]);

  const { items, search, handlers, pageItems } = useItems(recipeArray, {
    sortBy: 'name',
    rowsPerPage: 10,
  });

  useEffect(() => {
    handlers.handlePageChange(undefined, 0);
  }, [recipeArray, handlers]);

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
      <Seo title="Recipes" />
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
                        //display: 'flex',
                        width: 'fit-content',
                        maxWidth: '50px',
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
                    </TableCell>
                    <TableCell
                      sx={{
                        alignItems: 'center',
                        //display: 'flex',
                      }}
                    >
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
              {currentItem && <SatisfactoryRecipeDetail recipe={currentItem} />}
            </ItemDetailsContainer>
          </ItemDrawer>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
