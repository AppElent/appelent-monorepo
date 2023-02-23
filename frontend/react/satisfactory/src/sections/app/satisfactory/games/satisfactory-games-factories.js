import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
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
import { tokens } from "locales/tokens";

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
  const { formik, game, recipes, products, translate } = props;
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
            disabled={!game}
            onClick={() => {
              createFactory();
            }}
            variant="contained"
          >
            {translate(tokens.satisfactory.pages.games.factories.addFirst)}
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
              label={translate(tokens.satisfactory.pages.games.tabs.factories)}
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
          {translate(tokens.satisfactory.pages.games.factories.add)}
        </Button>
      </Stack>
      <CardDefault title="Factory information">
        <Stack alignItems="center" direction="row" spacing={2}>
          <TextField
            label={translate(tokens.common.fields.name)}
            sx={{ flexGrow: 1 }}
            name={`factories.${selectedFactoryIndex}.name`}
            onChange={formik.handleChange}
            value={formik.values.factories[selectedFactoryIndex].name || ""}
          />
        </Stack>
        <Stack alignItems="center" direction="row" spacing={2}>
          <TextField
            label={translate(tokens.common.fields.description)}
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
          {translate(tokens.satisfactory.pages.games.factories.finished)}
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
          {translate(tokens.satisfactory.pages.games.factories.checked)}
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

      <CardDefault
        title={
          translate(tokens.satisfactory.pages.games.factories.inputs) +
          " / " +
          translate(tokens.satisfactory.pages.games.factories.outputs)
        }
      >
        <Stack
          alignItems="flex-start"
          direction="row"
          spacing={2}
          divider={<Divider orientation="vertical" flexItem />}
          // sx={{ verticalAlign: "top" }}
        >
          <Stack>
            {translate(tokens.satisfactory.pages.games.factories.inputs)}
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {translate(
                      tokens.satisfactory.pages.games.factories.product
                    )}
                  </TableCell>
                  <TableCell>
                    {translate(
                      tokens.satisfactory.pages.games.factories.amount
                    )}
                  </TableCell>
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
            {translate(tokens.satisfactory.pages.games.factories.outputs)}
            <Table sx={{ minWidth: 400 }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {translate(
                      tokens.satisfactory.pages.games.factories.product
                    )}
                  </TableCell>
                  <TableCell>
                    {translate(
                      tokens.satisfactory.pages.games.factories.amount
                    )}
                  </TableCell>
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
        translate={translate}
      />
    </Stack>
  );
};

SatisfactoryGamesFactories.propTypes = {
  formik: PropTypes.object,
  game: PropTypes.object.isRequired,
};
