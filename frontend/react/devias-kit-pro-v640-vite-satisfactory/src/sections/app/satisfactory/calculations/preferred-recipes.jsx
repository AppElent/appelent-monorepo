import PropTypes from 'prop-types';
import {
  Autocomplete,
  Button,
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
import { useEffect, useMemo } from 'react';
import { CardDefault } from 'src/components/app/card-default';
import { getSatisfactoryData, getSatisfactoryDataArray } from 'src/custom/libs/satisfactory';
import _ from 'lodash';

import { usePageView } from 'src/hooks/use-page-view';
import useLocalStorage from 'src/custom/hooks/use-local-storage';

const PreferredRecipes = ({ preferredRecipes, setPreferredRecipes, version }) => {
  usePageView();
  const products = useMemo(() => getSatisfactoryData('items', version), [version]);
  const recipes = useMemo(() => getSatisfactoryData('recipes', version), [version]);
  const recipeArray = useMemo(() => getSatisfactoryDataArray('recipes', version), [version]);
  const productArray = useMemo(
    () => _.sortBy(getSatisfactoryDataArray('items', version), 'name'),
    [version]
  );
  const [savedRecipeList, setSavedRecipeList, deleteSavedRecipeList] = useLocalStorage(
    'satisfactory_preferred_recipe_list',
    []
  );

  //const initialPreferredRecipes = _.unionBy(savedRecipeList, preferredRecipes, 'product');

  //const [recipeState, setRecipeState] = useState(preferredRecipes);

  useEffect(() => {
    if (savedRecipeList) setPreferredRecipes(savedRecipeList?.filter((l) => l.product && l.recipe));
  }, [savedRecipeList]);

  return (
    <CardDefault
      title="Preferred Product recipes"
      subtitle="You can set your preferred recipes per product here. 

Usage:
1. Add products that you want an alternative recipe for
2. Click Save when you are ready. (Note: this data is only available until you leave the page.)
3. Click calculate on Recipe List generator

Note: if you click Save to browser, it will save your preference to the browser for the next time."
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Recipe</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {savedRecipeList?.map((prod) => {
              const filteredRecipes = recipeArray.filter((r) =>
                r.products.find((p) => p.itemClass === prod.product)
              );
              const currentProduct = productArray.find((p) => p.className === prod.product);
              return (
                <TableRow key={prod.product}>
                  <TableCell>
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
                          let items = [...savedRecipeList];
                          const productIndex = items.findIndex((r) => r.product === prod.product);
                          if (productIndex > -1) {
                            items[productIndex] = {
                              ...items[productIndex],
                              product: value.className,
                            };
                          } else {
                            items.push({ product: value.className, recipe: null });
                          }

                          setSavedRecipeList(items);
                        }
                      }}
                      sx={{ width: 300 }}
                      value={currentProduct || null}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      select
                      sx={{ minWidth: 300 }}
                      label="Recipe"
                      name="recipe"
                      value={prod?.recipe || ''}
                      onChange={(e) => {
                        setSavedRecipeList((prev) => {
                          let items = [...prev];
                          const productIndex = items.findIndex((r) => r.product === prod.product);
                          if (productIndex > -1) {
                            items[productIndex] = {
                              ...items[productIndex],
                              recipe: e.target.value,
                            };
                          }
                          return [...items];
                        });
                      }}
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
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        setSavedRecipeList((prevState) =>
                          prevState.filter((p) => p.product !== prod.product)
                        )
                      }
                      variant="contained"
                      color="error"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack
        direction={'row'}
        spacing={2}
      >
        {' '}
        <Button
          sx={{ align: 'right', maxWidth: 150 }}
          variant="contained"
          color="success"
          onClick={() => {
            const prod = productArray.find(
              (p) => !savedRecipeList.find((rs) => rs.product === p.className)
            );
            setSavedRecipeList((prev) => [...prev, { product: prod.className, recipe: undefined }]);
          }}
        >
          Add product
        </Button>
        {/* <Button
          sx={{ align: 'right', maxWidth: 150 }}
          variant="contained"
          color="success"
          disabled={recipeState == preferredRecipes}
          onClick={() => setPreferredRecipes(recipeState)}
        >
          Save
        </Button> */}
        {/* <Button
          sx={{ align: 'right', maxWidth: 200 }}
          variant="contained"
          disabled={_.isEqual(savedRecipeList.sort() === savedRecipeList.sort())}
          onClick={() => setSavedRecipeList(setSavedRecipeList)}
        >
          Save to browser
        </Button>
        <Button
          sx={{ align: 'right', maxWidth: 200 }}
          variant="contained"
          disabled={!savedRecipeList}
          onClick={() => setSavedRecipeList(_.unionBy(savedRecipeList, preferredRecipes, 'product'))}
        >
          Load from browser
        </Button>
        <Button
          sx={{ align: 'right', maxWidth: 200 }}
          variant="contained"
          disabled={!savedRecipeList}
          onClick={() => deleteSavedRecipeList()}
        >
          Delete from browser
        </Button> */}
      </Stack>
    </CardDefault>
  );
};

PreferredRecipes.propTypes = {
  preferredRecipes: PropTypes.array,
  setPreferredRecipes: PropTypes.func,
  version: PropTypes.string,
};

export default PreferredRecipes;
