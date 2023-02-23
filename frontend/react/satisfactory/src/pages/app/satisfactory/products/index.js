import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import numeral from "numeral";
import { useFormik } from "formik";
import { useMounted } from "hooks/use-mounted";
import { usePageView } from "hooks/use-page-view";
import { Layout as DashboardLayout } from "layouts/dashboard";
import { ItemDrawer } from "components/app/list/item-drawer";
import { ItemListContainer } from "components/app/list/item-list-container";
import { ItemListSearch } from "components/app/list/item-list-search";
import { ItemListTableContainer } from "components/app/list/item-list-table";
import { ItemDetailsContainer } from "components/app/list/item-drawer/item-details";
import { ItemEditContainer } from "components/app/list/item-drawer/item-edit";
import { SeverityPill } from "components/severity-pill";
//import { useSearch, useItems } from "components/app/list/utils";
import { siteSettings } from "config";

import satisfactoryProducts from "data/satisfactory/v700/items.json";
import { paginate } from "utils/paginate";
import { useRouter } from "next/router";
import {
  getSatisfactoryItem,
  SatisfactoryCurrentVersion,
  satisfactoryVersions,
} from "libs/satisfactory";
import { paths } from "paths";
import { SatisfactoryProductDetail } from "sections/app/satisfactory/product/satisfactory-product-detail";
import { useTranslate } from "@pankod/refine-core";
import { tokens } from "locales/tokens";

let satisfactoryProductsArray = Object.keys(satisfactoryProducts).map((k) => ({
  ...satisfactoryProducts[k],
  className: k,
}));
satisfactoryProductsArray = satisfactoryProductsArray.sort(function (a, b) {
  return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
});

const statusMap = {
  complete: "success",
  pending: "info",
  canceled: "warning",
  rejected: "error",
};

const useSearch = () => {
  const [search, setSearch] = useState({
    filters: {
      query: undefined,
      status: undefined,
    },
    page: 0,
    rowsPerPage: 5,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  return {
    search,
    updateSearch: setSearch,
  };
};

const useItems = (search) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    items: [],
    itemsCount: 0,
  });

  const getItems = useCallback(async () => {
    try {
      //const response = satisfactoryProducts; // filter items here
      let response = satisfactoryProductsArray;

      // search result
      if (search.filters?.query) {
        response = response.filter((obj) =>
          JSON.stringify(obj).toLowerCase().includes(search.filters.query)
        );
      }

      const responsePaginated = paginate(
        response,
        search.rowsPerPage,
        search.page + 1
      );

      if (isMounted()) {
        setState({
          items: response,
          itemsCount: response.length,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [search, isMounted]);

  useEffect(
    () => {
      getItems();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search]
  );

  return state;
};

const tabOptions = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Tier 0",
    value: "0",
  },
  {
    label: "Tier 1",
    value: "1",
  },
  {
    label: "Tier 2",
    value: "2",
  },
  {
    label: "Tier 3",
    value: "3",
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
  const { search, updateSearch } = useSearch();
  const [version, setVersion] = useState(SatisfactoryCurrentVersion);
  const translate = useTranslate();

  const { items, itemsCount } = useItems(search);
  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined,
  });
  const currentItem = useMemo(() => {
    if (!drawer.data) {
      return undefined;
    }
    const item = items.find((item) => item.slug === drawer.data);
    return getSatisfactoryItem(item.className);
  }, [drawer]);

  const itemsPaginated = paginate(items, search.rowsPerPage, search.page + 1);

  const formik = useFormik({
    initialValues: currentItem,
    enableReinitialize: true,
    onSubmit: async (values, helpers) => {
      console.log(values);
    },
  });

  useEffect(() => {
    // If product query param is present, set currentItem
    if (router.query.product) {
      handleItemOpen(router.query.product);
    }
  }, []);

  usePageView();

  const [isEditing, setIsEditing] = useState(false);

  const handleEditOpen = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleEditCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

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

      router.replace(
        {
          query: { ...router.query, product: orderId },
        },
        undefined,
        { shallow: true }
      );

      setDrawer({
        isOpen: true,
        data: orderId,
      });
    },
    [drawer]
  );

  const handleItemClose = useCallback(() => {
    let { product, ...rest } = router.query;
    router.replace(
      {
        query: { ...rest },
      },
      undefined,
      { shallow: true }
    );
    setDrawer({
      isOpen: false,
      data: undefined,
    });
  }, []);

  return (
    <>
      <Head>
        <title>Products | {siteSettings.title}</title>
      </Head>
      <Divider />
      <Box
        component="main"
        ref={rootRef}
        sx={{
          display: "flex",
          flex: "1 1 auto",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            bottom: 0,
            display: "flex",
            left: 0,
            position: "absolute",
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
                // const createdAtMonth = format(
                //   item.createdAt,
                //   "LLL"
                // ).toUpperCase();
                // const createdAtDay = format(item.createdAt, "d");
                const totalAmount = numeral(item.totalAmount).format(
                  `${item.currency}0,0.00`
                );
                const statusColor = item.isFluid ? "info" : "success";

                return (
                  <TableRow
                    hover
                    key={item.slug}
                    onClick={() => handleItemOpen?.(item.slug)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      sx={{
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: (theme) =>
                            theme.palette.mode === "dark"
                              ? "neutral.800"
                              : "neutral.200",
                          bitemRadius: 2,
                          maxWidth: "fit-content",
                          ml: 3,
                          p: 1,
                        }}
                      >
                        <Typography align="center" variant="subtitle2">
                          {item.stackSize}
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle2">{item.name}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {item.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <SeverityPill color={statusColor}>
                        {item.status}
                        {item.isFluid ? "Fluid" : "Non-fluid"}
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
            {!isEditing ? (
              <ItemDetailsContainer>
                {/* Content details
                <br />
                <Button
                  onClick={() =>
                    router.push(
                      paths.app.satisfactory.products.detail +
                        currentItem.className
                    )
                  }
                  variant="contained"
                >
                  Open product
                </Button>
                {JSON.stringify(currentItem)} */}
                <Button
                  onClick={() => {
                    router.push(
                      paths.app.satisfactory.products.detail +
                        currentItem.className
                    );
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
            ) : (
              <ItemEditContainer
                onCancel={handleEditCancel}
                onSave={formik.handleSubmit}
                item={currentItem}
              >
                Content edit
              </ItemEditContainer>
            )}
          </ItemDrawer>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
