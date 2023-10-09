import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
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
  getRecipesByProduct,
  getSatisfactoryData,
  getSatisfactoryItem,
  SatisfactoryCurrentVersion,
  satisfactoryVersions,
} from 'src/custom/libs/satisfactory';
import { paths } from 'src/paths';
import { SatisfactoryProductDetail } from 'src/sections/app/satisfactory/products/product-detail';
import { useTranslate } from '@refinedev/core';
import { tokens } from 'src/locales/tokens';
import { Seo } from 'src/components/seo';
import { NumberParam, StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useItems } from 'src/custom/hooks/use-items';
import { CardDefault } from 'src/components/app/card-default';
import _ from 'lodash';
import useTabs from 'src/custom/hooks/use-tabs';
import toast from 'react-hot-toast';

const tabsData = [
  { label: 'Recipe list by Product', value: 'recipe_list' },
  { label: 'All end products', value: 'end_products' },
];

const RecipeList = ({ version, preferredRecipes = [], setPreferredRecipes }) => {
  const [productQuery, setProductQuery] = useQueryParam('product');
  const [itemsMin, setItemsMin] = useQueryParam('itemsMin', withDefault(NumberParam, 1));
  const [productRecipes, setProductRecipes] = useState();
  const [remembered, setRemembered] = useState([]);
  const tabs = useTabs({ initial: tabsData[0].value, tabname: 'tab' });

  usePageView();
  //const { search, updateSearch } = useSearch();

  useEffect(() => {
    if (productRecipes?.usedRecipes) {
      productRecipes.usedRecipes.forEach((p) => {
        if (!preferredRecipes.find((r) => r.product === p.product)) {
          setPreferredRecipes((prev) => [...prev, p]);
        }
      });
    }
    //setProductQuery('Desc_Computer_C');
  }, [productRecipes?.usedRecipes]);

  const products = useMemo(() => getSatisfactoryData('items', version), []);
  const recipes = useMemo(() => getSatisfactoryData('recipes'), []);
  const recipeArray = useMemo(() => {
    let array = Object.keys(recipes).map((k) => ({
      ...recipes[k],
      className: k,
    }));
    return _.sortBy(array, 'name');
  }, [recipes]);
  const productArray = useMemo(() => {
    let array = Object.keys(products).map((k) => ({
      ...products[k],
      className: k,
    }));
    return _.sortBy(array, 'name');
  }, [products]);

  // const productRecipes = useMemo(() => {
  //   if (productQuery && itemsMin) return getRecipesByProduct(productQuery, itemsMin);
  // }, [productQuery, itemsMin]);

  const currentProduct = useMemo(() => {
    return productArray.find((prod) => prod.className === productQuery) || null;
  }, [productQuery]);

  const clearTable = () => {
    setProductQuery(null);
    setItemsMin(1);
    setProductRecipes(undefined);
  };

  const addRememberedProduct = () => {
    const rememberedProductIndex = remembered.findIndex((rem) => rem.product === productQuery);
    if (rememberedProductIndex === -1) {
      setRemembered((prevState) => {
        return [...prevState, { product: productQuery, amount: itemsMin }];
      });
    } else {
      toast.error('This item already exists. Please edit.');
    }
  };

  const subtitle = `Calculate all the recipes and resources needed to create the products.

Usage 1:
1. Select product and desired quantity (default quantity is 1 machine)
2. Click calculate

Usage 2:
1. Select product and desired quantity (default quantity is 1 machine)
2. Click remember
3. Repeat for multiple products
   - You can click on an item to edit
   - You can delete items from the list
4. Click Calculate all  `;

  return (
    <CardDefault
      title="Get product data"
      subtitle={subtitle}
    >
      {' '}
      <Grid
        container
        spacing={1}
        justifyContent={'space-between'}
      >
        <Grid
          item
          xs={12}
          md={8}
        >
          <Grid container>
            {remembered.map((item) => (
              <Grid
                item
                key={item.product}
              >
                <Chip
                  key={item.product}
                  label={`${products[item.product].name} (${item.amount})`}
                  onClick={() => {
                    setProductQuery(item.product);
                    setItemsMin(item.amount);
                  }}
                  onDelete={() => {
                    setRemembered((prevState) =>
                      prevState.filter((p) => p.product !== item.product)
                    );
                  }}
                  style={{ m: 3 }}
                  color="primary"
                  id={item.product}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item>
          <Button
            onClick={() => {
              if (remembered?.length > 0) {
                setProductRecipes(getRecipesByProduct(remembered, preferredRecipes, version));
              }

              //setProductQuery(null);
            }}
            disabled={remembered.length === 0}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Calculate all
          </Button>

          <Button
            variant="outlined"
            disabled={remembered.length === 0}
            onClick={() => setRemembered([])}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
      {/* <Stack
        alignItems="flex-start"
        direction="row"
        //flexWrap="wrap"
        justifyContent="space-between"
        spacing={3}
      >
        <Stack
          direction="row"
          spacing={2}
        >
          <Grid container>
            {remembered.map((item) => (
              <Grid
                item
                key={item.product}
              >
                <Chip
                  key={item.product}
                  label={`${products[item.product].name} (${item.amount})`}
                  onClick={() => {
                    setProductQuery(item.product);
                    setItemsMin(item.amount);
                  }}
                  onDelete={() => {
                    setRemembered((prevState) =>
                      prevState.filter((p) => p.product !== item.product)
                    );
                  }}
                  style={{ m: 3 }}
                  color="primary"
                  id={item.product}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
        <Stack
          alignItems="flex-start"
          direction="row"
          flexWrap="wrap"
          //justifyContent="space-between"
          spacing={3}
        >
          <Grid
            container
            spacing={1}
          >
            <Grid item>
              <Button
                onClick={() => {
                  if (remembered?.length > 0) {
                    setProductRecipes(getRecipesByProduct(remembered, preferredRecipes, version));
                  }

                  //setProductQuery(null);
                }}
                disabled={remembered.length === 0}
                variant="outlined"
              >
                Calculate all
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                disabled={remembered.length === 0}
                onClick={() => setRemembered([])}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Stack> */}
      <Grid
        container
        direction="row"
        spacing={2}
      >
        <Grid
          item
          xs={12}
          md={4}
        >
          <Autocomplete
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.className === value.className}
            options={productArray}
            //multiple
            renderInput={(params) => (
              <TextField
                {...params}
                //fullWidth
                label="Product"
                name="product"
              />
            )}
            renderOption={(props, option) => {
              return (
                <li
                  {...props}
                  key={option.className}
                >
                  {option.name}
                </li>
              );
            }}
            onChange={(e, value) => {
              if (value) {
                //const productObject = products[value];
                const recipe = recipeArray.find(
                  (r) => !r.isAlternate && r.products.find((rp) => rp.itemClass === value.className)
                );
                if (recipe) {
                  const cyclesMin = parseFloat(60 / recipe.craftTime);
                  const prodItemsMin =
                    recipe.products.find((p) => p.itemClass === value.className)?.quantity *
                    cyclesMin;
                  setItemsMin(prodItemsMin || 1);
                }
                setProductQuery(value.className);
              }
            }}
            //sx={{ width: 300 }}
            value={currentProduct || null}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Items/min"
            sx={{ maxWidth: 100 }}
            type="number"
            onChange={(e) => {
              if (e.target.value) setItemsMin(e.target.value);
            }}
            value={itemsMin || 1}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            disabled={!productQuery || !itemsMin}
            color="success"
            onClick={() => {
              if (productQuery && itemsMin)
                setProductRecipes(
                  getRecipesByProduct(
                    [{ product: productQuery, amount: itemsMin }],
                    preferredRecipes,
                    version
                  )
                );
              //setProductQuery(null);
            }}
          >
            Calculate
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            disabled={!productRecipes}
            onClick={clearTable}
          >
            Clear
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            disabled={!productQuery || !itemsMin}
            color="secondary"
            onClick={() => {
              addRememberedProduct();
              clearTable();
            }}
          >
            Remember
          </Button>
        </Grid>
      </Grid>
      {productRecipes && (
        <>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Recipe</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Number of machines</TableCell>
                  <TableCell>Needed for</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productRecipes?.total.map((tot) => (
                  <TableRow key={tot.recipe}>
                    <TableCell>{recipes[tot.recipe]?.name}</TableCell>
                    <TableCell>{+tot.amount?.toPrecision(4)} p.m.</TableCell>
                    <TableCell>{+tot.numberOfMachines?.toPrecision(4)}</TableCell>
                    <TableCell>
                      {tot.products &&
                        tot.products[0].product &&
                        tot.products.map((n) => (
                          <div key={n.product}>
                            {products[n.product]?.name} ({+n.amount?.toPrecision(4)})
                          </div>
                        ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {productRecipes.ores.length > 0 && (
            <>
              <Typography>The following resources are needed to build these products</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ore</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Needed for</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productRecipes.ores.map((ore) => (
                      <TableRow key={ore.ore}>
                        <TableCell>{products[ore.ore].name}</TableCell>
                        <TableCell>{+ore.amount.toPrecision(4)} p.m.</TableCell>
                        <TableCell>
                          {' '}
                          {ore.products &&
                            ore.products[0].product &&
                            ore.products.map((n) => (
                              <div key={n.product}>
                                {products[n.product]?.name} ({+n.amount?.toPrecision(4)})
                              </div>
                            ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          {productRecipes.excess.length > 0 && (
            <>
              <Typography>The following products are created next to the ones selected.</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Excess product</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Excess product of</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productRecipes.excess.map((excess) => (
                      <TableRow key={excess.product}>
                        <TableCell>{products[excess.product]?.name}</TableCell>
                        <TableCell>{excess.amount}</TableCell>
                        <TableCell>
                          {excess.recipes.map((r) => recipes[r]?.name).join(', ')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          {productRecipes?.alternatives?.length > 0 && (
            <>
              <Typography>
                Some of the recipes are picked randomly, because there are multiple default recipes
                available. See below for a list of alternative default recipes that can be selected.
                If you want to use these recipes, please add them to the preferred product recipe
                list below.
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Alternative recipes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productRecipes.alternatives.map((alt) => (
                      <TableRow key={alt.product}>
                        <TableCell>{products[alt.product]?.name}</TableCell>
                        <TableCell>{alt.recipes.map((r) => recipes[r]?.name).join(', ')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}
    </CardDefault>
  );
};

RecipeList.propTypes = {
  version: PropTypes.string.isRequired,
};

export default RecipeList;
