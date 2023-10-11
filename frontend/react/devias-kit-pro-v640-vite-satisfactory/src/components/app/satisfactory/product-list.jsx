import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { usePageView } from 'src/hooks/use-page-view';
import { ItemDrawer } from 'src/components/app/list/item-drawer';
import { ItemListContainer } from 'src/components/app/list/item-list-container';
import { ItemListSearch } from 'src/components/app/list/item-list-search';
import { ItemListTableContainer } from 'src/components/app/list/item-list-table';
import { ItemDetailsContainer } from 'src/components/app/list/item-drawer/item-details';
import { SeverityPill } from 'src/components/severity-pill';
//import { useSearch, useItems } from "components/app/list/utils";

import {
  getSatisfactoryData,
  getSatisfactoryDataArray,
  getSatisfactoryItem,
  recipeChart,
} from 'src/custom/libs/satisfactory';
import { useTranslate } from '@refinedev/core';
import { tokens } from 'src/locales/tokens';
import { useQueryParam } from 'use-query-params';
import { useItems } from 'src/custom/hooks/use-items';
import { PropertyListTemplate } from '../property-list-template';
import Mermaid from 'src/custom/libs/mermaid';

const tabOptions = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Tier 0',
    value: '0',
  },
  {
    label: 'Tier 1',
    value: '1',
  },
  {
    label: 'Tier 2',
    value: '2',
  },
  {
    label: 'Tier 3',
    value: '3',
  },
  {
    label: 'Shop',
    value: 'shop',
  },
  {
    label: 'MAM',
    value: 'mam',
  },
  {
    label: 'Alternates',
    value: 'alternate',
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

const ProductList = () => {
  const rootRef = useRef(null);
  const [productQuery, setProductQuery] = useQueryParam('product');
  //const { search, updateSearch } = useSearch();
  const [version] = useQueryParam('version');
  const translate = useTranslate();

  const productArray = useMemo(() => getSatisfactoryDataArray('items', version), [version]);
  const recipeArray = useMemo(() => getSatisfactoryDataArray('recipes', version), [version]);
  const schematics = useMemo(() => getSatisfactoryDataArray('schematics', version), [version]);

  const productArrayWithTiers = useMemo(() => {
    if (recipeArray.length === 0 || productArray.length === 0 || schematics.length === 0) return [];
    console.log(recipeArray, productArray, schematics);
    let returnArray = [];

    productArray.forEach((prod) => {
      const productRecipes = recipeArray.filter((r) =>
        r.products?.find((rp) => rp.itemClass === prod.className)
      );
      const productSchematics = schematics.filter((schematic) =>
        schematic.unlocks?.recipes?.find((schematicRecipe) =>
          productRecipes?.find((productRecipe) => productRecipe.className === schematicRecipe)
        )
      );
      returnArray.push({ ...prod, schematics: productSchematics });
    });
    return returnArray;
  }, [productArray, recipeArray, schematics]);

  const unique = [...new Set(schematics.map((item) => item.type))];
  console.log(schematics, unique, productArrayWithTiers);

  productArrayWithTiers.forEach((pr) => {
    console.log(
      'Product ' + pr.className + ', techtiers',
      pr.schematics?.map((s) => ({ tier: s.techTier, type: s.type, name: s.name }))
    );
  });

  console.log(productArray);

  const { allItems, items, pageItems, search, handlers } = useItems(productArray, {
    sortBy: 'name',
    filters: { isFuel: { min: true } },
    rowsPerPage: 10,
  });

  console.log(items);

  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined,
  });

  const currentItem = useMemo(() => {
    if (allItems.length > 0) {
      if (!drawer.data) {
        return undefined;
      }
      const item = allItems.find((item) => item.slug === drawer.data);
      return getSatisfactoryItem(item.className, version);
    }
  }, [drawer, version, allItems]);

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
    [drawer, setProductQuery]
  );

  const handleItemClose = useCallback(() => {
    setProductQuery(undefined);
    setDrawer({
      isOpen: false,
      data: undefined,
    });
  }, [setProductQuery]);

  const propertyItems = useMemo(
    () =>
      currentItem && [
        {
          label: translate(tokens.common.fields.name),
          value: currentItem.name,
        },
        {
          label: translate(tokens.common.fields.description),
          value: currentItem.description,
        },
        {
          label: translate(tokens.satisfactory.pages.products.stackSize),
          value: currentItem.stackSize?.toString(),
        },
        {
          label: 'Sink points',
          value: currentItem.sinkPoints?.toString(),
        },
      ],
    [currentItem, translate]
  );

  console.log(currentItem);

  const recipes = useMemo(
    () =>
      getSatisfactoryDataArray('recipes', version).filter(
        (recipe) =>
          recipe.products.find((p) => p.itemClass === currentItem?.className) && !recipe.isAlternate
      ),
    [currentItem, version]
  );

  console.log(recipes);
  const machines = getSatisfactoryData('buildables', version);
  const charts = useMemo(
    () =>
      recipes?.length > 0 &&
      recipes.map((recipe) => recipeChart(recipe, getSatisfactoryData('items', version), machines)),
    [recipes, version, machines]
  );

  console.log(charts, recipes);

  return (
    <>
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
        {/* <Box
          ref={rootRef}
          sx={{
            bottom: 0,
            display: 'flex',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0,
          }}
        > */}
        <ItemListContainer open={drawer.isOpen}>
          {/* <Box sx={{ p: 3 }}>
          <Stack
            alignItems="flex-start"
            direction="row"
            justifyContent="space-between"
            spacing={4}
          >
            <div>
              <Typography variant="h4">
                {translate(tokens.satisfactory.pages.products.title)}
              </Typography>
            </div>
          </Stack>
        </Box> */}
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
            page={search.page}
            rowsPerPage={search.rowsPerPage}
          >
            {pageItems.map((item) => {
              const statusColor = item.isFluid ? 'info' : 'success';

              return (
                <TableRow
                  hover
                  key={item.slug}
                  onClick={() => handleItemOpen?.(item.slug)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        backgroundColor: (theme) =>
                          theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.200',
                        bitemRadius: 2,
                        maxWidth: 'fit-content',
                        ml: 1,
                        p: 1,
                      }}
                    >
                      <Typography
                        align="center"
                        variant="subtitle2"
                      >
                        {item.stackSize}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <Box sx={{ ml: 1 }}>
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
                    <SeverityPill color={statusColor}>
                      {item.status}
                      {item.isFluid ? 'Fluid' : 'Non-fluid'}
                    </SeverityPill>
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
            {currentItem && (
              <Stack>
                <Card>
                  <CardHeader title={translate(tokens.satisfactory.pages.products.info)} />
                  <CardContent>
                    <PropertyListTemplate items={propertyItems} />
                    {charts && (
                      <>
                        <Typography variant="subtitle2">Default recipe(s):</Typography>
                        {charts.map((chart) => (
                          <div key={chart}>
                            <Typography variant="subtitle2">Recipe</Typography>
                            <Mermaid chart={chart} />
                          </div>
                        ))}
                      </>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            )}
          </ItemDetailsContainer>
        </ItemDrawer>
      </Box>
      {/* </Box> */}
    </>
  );
};

export default ProductList;
