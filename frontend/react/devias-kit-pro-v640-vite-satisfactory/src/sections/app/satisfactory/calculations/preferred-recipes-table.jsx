import {
  Autocomplete,
  Avatar,
  Button,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { getSatisfactoryData, getSatisfactoryDataArray } from 'src/custom/libs/satisfactory';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import useCustomMaterialReactTable from 'src/custom/hooks/use-custom-material-react-table';

const PreferredRecipesTable = ({ preferredRecipes, setPreferredRecipes, version }) => {
  const recipes = useMemo(() => getSatisfactoryData('recipes', version), [version]);
  const recipeArray = useMemo(() => getSatisfactoryDataArray('recipes', version), [version]);
  const productArray = useMemo(
    () => _.sortBy(getSatisfactoryDataArray('items', version), 'name'),
    [version]
  );
  //const [errors, setErrors] = useState({})

  const [creatingProduct, setCreatingProduct] = useState();
  const [errors, setErrors] = useState({});

  // const errors = useMemo(() => tableErrors, [tableErrors]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'product',
        header: 'Product',
        minSize: 300,
        Edit: ({ row, table, column }) => {
          const productClass = row._valuesCache[column.id] || row.original?.product;
          const currentProduct = productArray.find((p) => p.className === productClass);
          const errorObject = row.index === -1 ? errors.new : errors[row.index];
          if (errorObject) console.log('Error found', errorObject);
          return (
            <Stack
              direction="row"
              alignItems={'center'}
              spacing={1}
            >
              <Avatar
                src={`/assets/satisfactory/products/${productClass}.jpg`}
                sx={{
                  height: 42,
                  width: 42,
                }}
              />
              <Autocomplete
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.className === value.className}
                options={productArray}
                //multiple
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Product"
                    name="product"
                    error={errorObject?.product ? true : false}
                    helperText={errorObject?.product ? errorObject.product : undefined}
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
                    console.log(value, row);

                    if (row.index === -1) {
                      row._valuesCache[column.id] = value.className;
                      console.log(row, row._valuesCache);
                      setCreatingProduct(value.className);
                      table.setCreatingRow(row);
                    } else {
                      const currentProductList = [...preferredRecipes];
                      currentProductList[row.index].product = value.className;
                      setPreferredRecipes(currentProductList);
                    }
                  }
                }}
                sx={{ width: 300 }}
                size="small"
                value={currentProduct || null}
              />
            </Stack>
          );
        },
      },
      {
        accessorKey: 'recipe',
        header: 'Recipe',
        minSize: 300,

        Edit: ({ row, table, column }) => {
          const productClass = row._valuesCache?.recipe || row.original?.recipe;
          const currentProduct = recipeArray.find((p) => p.className === productClass);
          const filteredRecipes = recipeArray.filter((r) =>
            r.products.find((p) => p.itemClass === row._valuesCache['product'])
          );
          const errorObject = row.index === -1 ? errors.new : errors[row.index];
          return (
            <TextField
              select
              sx={{ minWidth: 300 }}
              label="Recipe"
              name="recipe"
              value={productClass || ''}
              size="small"
              error={errorObject?.recipe ? true : false}
              helperText={errorObject?.recipe ? errorObject.recipe : undefined}
              onChange={(e, value) => {
                console.log(e);
                if (e.target.value) {
                  if (row.index === -1) {
                    row._valuesCache[column.id] = e.target.value;
                    console.log(row, row._valuesCache);
                    setCreatingProduct(productClass);
                    table.setCreatingRow(row);
                  } else {
                    const currentProductList = [...preferredRecipes];
                    currentProductList[row.index].recipe = e.target.value;
                    setPreferredRecipes(currentProductList);
                  }
                }
              }}
              variant="standard"
              InputProps={{ disableUnderline: true }}
            >
              {' '}
              {filteredRecipes.map((recipe) => (
                <MenuItem
                  key={recipe.className}
                  value={recipe.className}
                >
                  {recipes[recipe.className]?.name}
                </MenuItem>
              ))}
            </TextField>
          );
        },
      },
    ],
    [productArray, errors, preferredRecipes, setPreferredRecipes, recipeArray, recipes]
  );

  const table = useCustomMaterialReactTable({
    columns,
    data: preferredRecipes,
    setData: setPreferredRecipes,
    add: true,
    edit: true,
    errors,
    setErrors,
    rowValidator: (values) => {
      const errorObject = {};
      if (!values.product || values.product === '') {
        errorObject.product = 'Product is required';
      }
      if (!values.recipe || values.recipe === '') {
        errorObject.recipe = 'Recipe is required';
      }
      if (!errorObject.product && !errorObject.recipe) return undefined;
      return errorObject;
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

PreferredRecipesTable.propTypes = {
  preferredRecipes: PropTypes.array.isRequired,
  setPreferredRecipes: PropTypes.func.isRequired,
  version: PropTypes.string,
};

export default PreferredRecipesTable;
