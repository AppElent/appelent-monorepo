import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { CardDefault } from "components/app/card-default";
import { createGuid } from "libs/create-guid";
import { SatisfactoryGamesFactoryRecipes } from "./satisfactory-games-factory-recipes";
import { useRouter } from "next/router";
import { useQueryParam } from "libs/appelent-framework/hooks/use-query-param";
import { generateName } from "libs/random-name-generator";
import { getSatisfactoryRecipeStatistics } from "libs/satisfactory";

const newObject = {
  name: "",
  age: "",
  isNew: true,
};

const FACTORY_TEMPLATE = {
  description: "",
  finished: false,
  checked: false,
  recipes: [],
};

export const SatisfactoryGamesFactories = (props) => {
  const { formik, game, recipes, products } = props;
  const router = useRouter();
  const { value: factoryId, setQueryParam: setFactoryId } =
    useQueryParam("factory");
  const [recipeState, setRecipeState] = useState({});

  const selectedFactory = useMemo(() => {
    if (formik.values.factories) {
      if (factoryId) {
        const found = formik.values.factories.find(
          (factory) => factory.id === factoryId
        );
        if (found) {
          return found;
        } else {
          return formik.values.factories[0];
        }
      } else {
        return formik.values.factories[0];
      }
    }
    return undefined;
  }, [formik.values.factories, factoryId]);

  const selectedFactoryIndex = useMemo(() => {
    const index = formik.values.factories?.findIndex(
      (factory) => factory.id === selectedFactory.id
    );
    if (!index) {
      return 0;
    }
    return index;
  }, [selectedFactory]);

  useEffect(() => {
    // let productUsage = {};
    // let recipeData = {};
    // let inputsAndOutputs = { inputs: {}, outputs: {} };
    // if (!formik.values.factories?.[selectedFactoryIndex]?.recipes)
    //   return undefined;
    // formik.values.factories[selectedFactoryIndex]?.recipes.forEach((recipe) => {
    //   console.log(recipe);
    //   const foundRecipe = recipes.find((r) => r.className === recipe.recipe);
    //   if (foundRecipe) {
    //     const itemsPerMinute = 60 / foundRecipe?.craftTime || 0;
    //     const inputs = foundRecipe.ingredients.map((ingredient) => {
    //       let currentUsage = productUsage[ingredient.itemClass] || {
    //         needed: 0,
    //         produced: 0,
    //       };
    //       currentUsage = {
    //         needed:
    //           currentUsage.needed +
    //           itemsPerMinute * ingredient.quantity * parseFloat(recipe.amount),
    //         produced: currentUsage.produced,
    //       };
    //       productUsage[ingredient.itemClass] = currentUsage;

    //       return {
    //         name: products[ingredient.itemClass],
    //         quantity: ingredient.quantity,
    //         quantityMin: itemsPerMinute * ingredient.quantity,
    //         quantityMinTotal:
    //           itemsPerMinute * ingredient.quantity * parseFloat(recipe.amount),
    //       };
    //     });
    //     const outputs = foundRecipe.products.map((ingredient) => {
    //       let currentUsage = productUsage[ingredient.itemClass] || {
    //         needed: 0,
    //         produced: 0,
    //       };
    //       currentUsage = {
    //         needed: currentUsage.needed,
    //         produced:
    //           currentUsage.produced +
    //           itemsPerMinute * ingredient.quantity * parseFloat(recipe.amount),
    //       };
    //       productUsage[ingredient.itemClass] = currentUsage;

    //       return {
    //         name: products[ingredient.itemClass],
    //         quantity: ingredient.quantity,
    //         quantityMin: itemsPerMinute * ingredient.quantity,
    //         quantityMinTotal:
    //           itemsPerMinute * ingredient.quantity * parseFloat(recipe.amount),
    //       };
    //       // return {
    //       //   name: products[ingredient.itemClass],
    //       //   quantity: ingredient.quantity,
    //       //   quantityMin: itemsPerMinute * ingredient.quantity,
    //       //   quantityMinTotal:
    //       //     itemsPerMinute * ingredient.quantity * parseFloat(recipe.amount),
    //       // };
    //     });
    //     recipeData[recipe.recipe] = { inputs, outputs };
    //   }

    //   for (const [key, value] of Object.entries(productUsage)) {
    //     const net = parseFloat((value.produced - value.needed).toPrecision(12));
    //     if (net < 0) {
    //       _.set(inputsAndOutputs, `inputs.${key}`, net * -1);
    //     } else if (net > 0) {
    //       inputsAndOutputs.outputs[key] = net;
    //     }
    //     productUsage[key].net = net;
    //   }
    //   console.log(recipeData, productUsage, inputsAndOutputs);
    //   setRecipeState({ recipeData, productUsage, inputsAndOutputs });
    // });
    const satisfactoryStatistics = getSatisfactoryRecipeStatistics(
      formik.values.factories?.[selectedFactoryIndex]?.recipes,
      recipes,
      products
    );
    setRecipeState(satisfactoryStatistics);

    //return returnObject;
  }, [formik.values.factories?.[selectedFactoryIndex]?.recipes]);

  const createFactory = () => {
    const currentFactories = formik.values.factories
      ? [...formik.values?.factories]
      : [];
    const id = createGuid(false);
    const name = generateName();
    const newFactory = { id, name, ...FACTORY_TEMPLATE };
    // if (currentFactories) {
    currentFactories.push(newFactory);
    formik.setFieldValue("factories", currentFactories);
    setFactoryId(id);
  };

  if (!selectedFactory) {
    return (
      <React.Fragment>
        <Box textAlign="center" sx={{ mt: 20 }}>
          <Button
            onClick={() => {
              createFactory();
            }}
            variant="contained"
          >
            Add first factory
          </Button>
        </Box>
      </React.Fragment>
    );
  }

  return (
    <Stack spacing={4}>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
      >
        <Autocomplete
          getOptionLabel={(option) => option.name}
          options={formik.values.factories || []}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Factories"
              name="factories"
            />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} key={option.id}>
                {option.name}
              </li>
            );
          }}
          // isOptionEqualToValue={(option, value) =>
          //   option.name === value.name
          // }
          onChange={(e, value) => {
            setFactoryId(value.id);
          }}
          // onInputChange={(event, newInputValue) => {
          //   setInputValue(newInputValue);
          // }}
          sx={{ width: 300 }}
          value={selectedFactory}
        />
        <Button
          //color="inherit"
          size="small"
          onClick={createFactory}
          variant="contained"
        >
          Create new factory
        </Button>
      </Stack>
      <CardDefault title="Factory information">
        <Stack alignItems="center" direction="row" spacing={2}>
          <TextField
            label="Factory name"
            sx={{ flexGrow: 1 }}
            name={`factories.${selectedFactoryIndex}.name`}
            onChange={formik.handleChange}
            value={formik.values.factories[selectedFactoryIndex].name || ""}
          />
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2}>
          <TextField
            label="Factory description"
            sx={{ flexGrow: 1 }}
            name={`factories.${selectedFactoryIndex}.description`}
            onChange={formik.handleChange}
            value={
              formik.values.factories[selectedFactoryIndex].description || ""
            }
          />
        </Stack>

        <Stack alignItems="center" direction="row" spacing={2}>
          <Checkbox
            value={
              formik.values.factories[selectedFactoryIndex].finished || false
            }
            onChange={formik.handleChange}
            name={`factories.${selectedFactoryIndex}.finished`}
            sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
          />{" "}
          Finished
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2}>
          <Checkbox
            value={
              formik.values.factories[selectedFactoryIndex].checked || false
            }
            onChange={formik.handleChange}
            name={`factories.${selectedFactoryIndex}.checked`}
            sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
          />{" "}
          Checked
        </Stack>
        {/* <Button
          //color="inherit"
          disabled={!formik.dirty}
          size="small"
          onClick={formik.handleSubmit}
          variant="contained"
        >
          Save
          
        </Button> */}
      </CardDefault>
      <CardDefault title="Inputs and outputs">
        <Stack alignItems="center" direction="row" spacing={2}>
          <Stack>
            Inputs
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recipeState?.inputsAndOutputs &&
                  Object.entries(recipeState.inputsAndOutputs.inputs).map(
                    ([key, value]) => {
                      return (
                        <TableRow key={key}>
                          <TableCell>{products[key].name}</TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      );
                    }
                  )}
              </TableBody>
            </Table>
          </Stack>
          <Stack>
            {" "}
            Outputs
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recipeState?.inputsAndOutputs &&
                  Object.entries(recipeState.inputsAndOutputs.outputs).map(
                    ([key, value]) => {
                      return (
                        <TableRow key={key}>
                          <TableCell>{products[key].name}</TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      );
                    }
                  )}
              </TableBody>
            </Table>
          </Stack>
        </Stack>
      </CardDefault>
      <SatisfactoryGamesFactoryRecipes
        game={game}
        factoryIndex={selectedFactoryIndex}
        formik={formik}
        recipes={recipes}
        products={products}
      />
    </Stack>
  );
};

SatisfactoryGamesFactories.propTypes = {
  formik: PropTypes.object,
  game: PropTypes.object.isRequired,
};
