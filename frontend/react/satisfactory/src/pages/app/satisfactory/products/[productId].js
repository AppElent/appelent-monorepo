import Head from "next/head";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { usePageView } from "hooks/use-page-view";
import { useSettings } from "hooks/use-settings";
import { Layout as DashboardLayout } from "layouts/dashboard";
import { siteSettings } from "config";
import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import {
  getSatisfactoryDataArray,
  getSatisfactoryItem,
  satisfactoryVersions,
  SatisfactoryCurrentVersion,
  getSatisfactoryData,
} from "libs/satisfactory";
import { Stack } from "@mui/system";
import { SatisfactoryProductDetail } from "sections/app/satisfactory/product/satisfactory-product-detail";
import { paths } from "paths";
import _ from "lodash";
import { SatisfactoryProductRecipeTable } from "sections/app/satisfactory/product/satisfactory-product-recipe-table";

const Page = () => {
  const settings = useSettings();
  usePageView();
  const router = useRouter();
  let { productId, version } = router.query;

  const version_correct =
    satisfactoryVersions.find((vers) => vers.key === version) || !version
      ? true
      : false;

  useEffect(() => {
    if (!version_correct) {
      router.replace(
        {
          query: { ...router.query, version: SatisfactoryCurrentVersion },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [version_correct]);

  const product =
    useMemo(() => {
      if (version_correct) {
        return getSatisfactoryItem(productId, version);
      }
    }, [productId, version_correct]) || {};

  const products =
    useMemo(() => {
      if (version_correct) {
        let productsArray = getSatisfactoryDataArray("items", version);
        return _.sortBy(productsArray, "name");
      }
    }, [version_correct]) || [];

  if (!version_correct) return <></>;

  const isEquipment = (reverse) => (recipe, products) => {
    let _isEquipment = false;
    recipe.products.every((product) => {
      const item = products[product.itemClass];
      if (item.isEquipment) {
        _isEquipment = true;
        return false;
      }
      return true;
    });
    if (reverse) return !_isEquipment;
    return _isEquipment;
  };

  return (
    <>
      <Head>
        <title>Product details | {siteSettings.title}</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : "xl"}>
          <Stack spacing={3} sx={{ mb: 3 }}>
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Typography variant="h4">{product.name}</Typography>
              <Autocomplete
                getOptionLabel={(option) => option.name}
                options={products}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Products"
                    name="product"
                  />
                )}
                onChange={(e, value) => {
                  if (value) {
                    router.push(
                      paths.app.satisfactory.products.detail + value?.className
                    );
                  }
                }}
                // onInputChange={(event, newInputValue) => {
                //   setInputValue(newInputValue);
                // }}
                sx={{ width: 300 }}
                value={products.find(
                  (oneProduct) => oneProduct.className === product.className
                )}
              />
            </Stack>
            <Stack spacing={3}>
              <SatisfactoryProductDetail product={product} />
              <SatisfactoryProductRecipeTable
                title="Recipes"
                recipes={product.recipes_by}
                products={getSatisfactoryData("items", version)}
              />
              <SatisfactoryProductRecipeTable
                title="Used for"
                recipes={product.recipes_for}
                products={getSatisfactoryData("items", version)}
                conditionFunction={isEquipment(true)}
              />
              <SatisfactoryProductRecipeTable
                title="Equipment"
                recipes={product.recipes_for}
                products={getSatisfactoryData("items", version)}
                conditionFunction={isEquipment(false)}
              />
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
