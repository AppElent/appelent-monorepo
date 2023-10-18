import { Autocomplete, Box, Container, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useTranslate } from '@refinedev/core';
import _ from 'lodash';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { Seo } from 'src/components/seo';
import {
  getSatisfactoryData,
  getSatisfactoryDataArray,
  getSatisfactoryItem,
  SatisfactoryCurrentVersion,
  satisfactoryVersions,
} from 'src/custom/libs/satisfactory';
import { usePageView } from 'src/hooks/use-page-view';
import { useRouter } from 'src/hooks/use-router';
import { useSettings } from 'src/hooks/use-settings';
import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';
import { SatisfactoryProductDetail } from 'src/sections/app/satisfactory/products/product-detail';
import { SatisfactoryProductRecipeTable } from 'src/sections/app/satisfactory/products/product-recipe-table';
import { useQueryParam } from 'use-query-params';

const Page = () => {
  const settings = useSettings();
  usePageView();
  const router = useRouter();
  const params = useParams();
  const [versionQuery, setVersionQuery] = useQueryParam('version');
  const version = versionQuery ? versionQuery : SatisfactoryCurrentVersion;
  let productId = params.productId;

  const translate = useTranslate();
  //let { productId, version } = router.query;

  const version_correct =
    satisfactoryVersions.find((vers) => vers.key === version) || !version ? true : false;

  const recipeArray = useMemo(() => {
    return getSatisfactoryDataArray('recipes', version);
  }, [version]);

  const machineTypes = useMemo(() => {
    if (version_correct) {
      return getSatisfactoryData('buildables', version);
    }
  }, [version_correct, version]);

  const products =
    useMemo(() => {
      if (version_correct) {
        let productsArray = getSatisfactoryDataArray('items', version);
        return _.sortBy(productsArray, 'name');
      }
    }, [version_correct, version]) || [];

  productId = productId === 'dummy' || !productId ? products[0]?.className : productId;

  useEffect(() => {
    if (!version_correct) {
      setVersionQuery(SatisfactoryCurrentVersion);
    }
  }, [version_correct]);

  const product =
    useMemo(() => {
      if (version_correct) {
        return getSatisfactoryItem(productId, version);
      }
    }, [productId, version_correct]) || {};

  const productRecipes = useMemo(() => {
    return recipeArray.filter((rec) => rec.products.find((p) => p.itemClass === productId));
  }, [productId, recipeArray]);

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
      <Seo title={translate(tokens.satisfactory.pages.products.title)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Stack
            spacing={3}
            sx={{ mb: 3 }}
          >
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
                    label={translate(tokens.satisfactory.pages.products.title)}
                    name="product"
                  />
                )}
                onChange={(e, value) => {
                  if (value) {
                    router.push(paths.app.satisfactory.products.detail + value?.className);
                  }
                }}
                // onInputChange={(event, newInputValue) => {
                //   setInputValue(newInputValue);
                // }}
                sx={{ width: 300 }}
                value={products.find((oneProduct) => oneProduct.className === product.className)}
              />
            </Stack>
            <Stack spacing={3}>
              <SatisfactoryProductDetail product={product} />
              <SatisfactoryProductRecipeTable
                title="Recipes"
                recipes={product.recipes_by || []}
                machineTypes={machineTypes}
                products={getSatisfactoryData('items', version)}
              />
              <SatisfactoryProductRecipeTable
                title="Used for"
                recipes={product.recipes_for || []}
                products={getSatisfactoryData('items', version)}
                machineTypes={machineTypes}
                conditionFunction={isEquipment(true)}
              />
              {product.recipes_for && (
                <SatisfactoryProductRecipeTable
                  title="Equipment"
                  recipes={product.recipes_for || []}
                  products={getSatisfactoryData('items', version)}
                  machineTypes={machineTypes}
                  conditionFunction={isEquipment(false)}
                />
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
