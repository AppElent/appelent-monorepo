import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import numeral from 'numeral';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/app';
import { ItemDrawer } from 'src/components/app/list/item-drawer';
import { ItemListContainer } from 'src/components/app/list/item-list-container';
import { ItemListSearch } from 'src/components/app/list/item-list-search';
import { ItemListTableContainer } from 'src/components/app/list/item-list-table';
import { ItemDetailsContainer } from 'src/components/app/list/item-drawer/item-details';
import { SeverityPill } from 'src/components/severity-pill';
//import { useSearch, useItems } from "components/app/list/utils";

import prodv700 from 'src/custom/libs/satisfactory/data/v700/items.json';
import prodv800 from 'src/custom/libs/satisfactory/data/v800/items.json';
import { paginate } from 'src/custom/libs/paginate';
import { useRouter } from 'src/hooks/use-router';
import {
  getSatisfactoryItem,
  SatisfactoryCurrentVersion,
  satisfactoryVersions,
} from 'src/custom/libs/satisfactory';
import { paths } from 'src/paths';
import { SatisfactoryProductDetail } from 'src/sections/app/satisfactory/products/product-detail';
import { useTranslate } from '@refinedev/core';
import { tokens } from 'src/locales/tokens';
import { Seo } from 'src/components/seo';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useItems } from 'src/custom/hooks/use-items';
import VersionSelector from 'src/components/app/satisfactory/version-selector';

const products = {
  v600: [],
  v700: prodv700,
  v800: prodv800,
};

const statusMap = {
  complete: 'success',
  pending: 'info',
  canceled: 'warning',
  rejected: 'error',
};

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
  const [productQuery, setProductQuery] = useQueryParam('product');
  //const { search, updateSearch } = useSearch();
  const [version, setVersion] = useQueryParam(
    'version',
    withDefault(StringParam, SatisfactoryCurrentVersion)
  );
  const translate = useTranslate();

  const [productArray, setProductArray] = useState([]);

  console.log(productArray);

  const { items, search, handlers } = useItems(productArray, {
    sortBy: 'name',
    filters: { isFuel: { min: true } },
    rowsPerPage: 10,
  });

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
      return getSatisfactoryItem(item.className, version);
    }
  }, [items, drawer, version]);

  useEffect(() => {
    const satisfactoryProducts = products[version];
    let satisfactoryProductsArray = Object.keys(satisfactoryProducts).map((k) => ({
      ...satisfactoryProducts[k],
      className: k,
    }));
    setProductArray(satisfactoryProductsArray);
    handlers.handlePageChange(undefined, 0);
  }, [version]);

  const itemsPaginated = paginate(items, search.rowsPerPage, search.page + 1);

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
                    {translate(tokens.satisfactory.pages.products.title)}
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
              page={search.page}
              rowsPerPage={search.rowsPerPage}
            >
              {itemsPaginated.map((item) => {
                const totalAmount = numeral(item.totalAmount).format(`${item.currency}0,0.00`);
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
                          //bitemRadius: 2,
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
              <Button
                onClick={() => {
                  router.push(paths.app.satisfactory.products.detail + currentItem.className);
                }}
                size="small"
                variant="contained"
              >
                {translate(tokens.satisfactory.pages.products.fullscreen)}
              </Button>
              {currentItem && (
                <SatisfactoryProductDetail
                  product={currentItem}
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