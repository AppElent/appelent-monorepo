import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { CardDefault } from 'src/components/app/card-default';
import { createGuid } from 'src/custom/libs/create-guid';
import { SatisfactoryGamesFactoryRecipes } from './satisfactory-games-factory-recipes';
import { useQueryParam } from 'use-query-params';
import { generateName } from 'src/custom/libs/random-name-generator';
import { tokens } from 'src/locales/tokens';
import { useSelected } from 'src/custom/hooks/use-selected';
import { getFactoryStatistics } from 'src/custom/libs/satisfactory/statistics';
import { useConfirm } from 'material-ui-confirm';
import FactorySelect from './factories/factory-select';
import FactoryInputsOutputs from './factories/factory-inputs-outputs';

const FACTORY_TEMPLATE = {
  description: '',
  finished: false,
  checked: false,
  recipes: [],
};

export const SatisfactoryGamesFactories = (props) => {
  const { formik, game, recipes, products, version, translate } = props;
  const confirm = useConfirm();
  const [factoryId, setFactoryId] = useQueryParam('factory');
  //const [recipeState, setRecipeState] = useState({});

  const [selectedFactory, selectedFactoryIndex] = useSelected(formik.values.factories, factoryId);

  const statistics = useMemo(
    () => getFactoryStatistics(formik.values.factories?.[selectedFactoryIndex]?.recipes),
    [formik.values.factories?.[selectedFactoryIndex]?.recipes]
  );

  const createFactory = () => {
    const currentFactories = formik.values.factories ? [...formik.values.factories] : [];
    const id = createGuid(false);
    const name = generateName();
    const newFactory = { id, name, ...FACTORY_TEMPLATE };
    // if (currentFactories) {
    currentFactories.push(newFactory);
    formik.setFieldValue('factories', currentFactories);
    setFactoryId(id);
  };

  const deleteFactory = (id) => {
    confirm({
      description:
        'Deleting a factory can cause parts of the game to get reset. Only delete factories if you are sure what you are doing.',
    }).then(() => {
      const currentFactories = formik.values?.factories ? [...formik.values.factories] : [];
      formik.setFieldValue(
        'factories',
        currentFactories.filter((item) => item.id !== id)
      );
    });
  };

  if (!selectedFactory) {
    return (
      <React.Fragment>
        <Box
          textAlign="center"
          sx={{ mt: 20 }}
        >
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
        {/* <Autocomplete
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
              <li
                {...props}
                key={option.id}
              >
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
        /> */}
        <FactorySelect
          factories={formik.values.factories || []}
          setFactoryId={setFactoryId}
          selectedFactory={selectedFactory}
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
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <TextField
            label={translate(tokens.common.fields.name)}
            sx={{ flexGrow: 1 }}
            name={`factories.${selectedFactoryIndex}.name`}
            onChange={formik.handleChange}
            required
            error={formik.errors?.factories?.[selectedFactoryIndex]?.name}
            helperText={formik.errors?.factories?.[selectedFactoryIndex]?.name}
            value={formik.values.factories?.[selectedFactoryIndex].name || ''}
          />
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <TextField
            label={translate(tokens.common.fields.description)}
            sx={{ flexGrow: 1 }}
            multiline
            minRows={3}
            name={`factories.${selectedFactoryIndex}.description`}
            onChange={formik.handleChange}
            value={formik.values.factories[selectedFactoryIndex].description || ''}
          />
        </Stack>

        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <Checkbox
            value={formik.values.factories[selectedFactoryIndex].finished || false}
            onChange={formik.handleChange}
            name={`factories.${selectedFactoryIndex}.finished`}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
          />{' '}
          {translate(tokens.satisfactory.pages.games.factories.finished)}
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <Checkbox
            value={formik.values.factories[selectedFactoryIndex].checked || false}
            onChange={formik.handleChange}
            name={`factories.${selectedFactoryIndex}.checked`}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
          />{' '}
          {translate(tokens.satisfactory.pages.games.factories.checked)}
        </Stack>
        <Stack
          justifyContent="flex-end"
          direction="row"
        >
          <div>
            <Button
              color="error"
              size="small"
              onClick={() => {
                deleteFactory(selectedFactory.id);
              }}
              variant="contained"
            >
              Delete
            </Button>
          </div>
        </Stack>
      </CardDefault>

      {/* <CardDefault
        title={
          translate(tokens.satisfactory.pages.games.factories.inputs) +
          ' / ' +
          translate(tokens.satisfactory.pages.games.factories.outputs)
        }
      >
        {statistics?.totalInputs.length === 0 && statistics?.totalOutputs.length === 0 ? (
          formik.values.factories[selectedFactoryIndex]?.recipes?.length > 0 ? (
            <>{translate(tokens.satisfactory.pages.games.factories.noInputsOutputs)}</>
          ) : (
            <>{translate(tokens.satisfactory.pages.games.factories.noInputsOutputsStarter)}</>
          )
        ) : (
          <Grid
            container
            spacing={3}
          >
            <Grid item>
              {translate(tokens.satisfactory.pages.games.factories.inputs)}
              <TableContainer>
                <Table sx={{ minWidth: 400 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {translate(tokens.satisfactory.pages.games.factories.product)}
                      </TableCell>
                      <TableCell>
                        {translate(tokens.satisfactory.pages.games.factories.amount)}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {statistics.totalInputs.length > 0 &&
                      statistics.totalInputs.map((input) => {
                        return (
                          <TableRow key={input.product}>
                            <TableCell>{products[input.product]?.name}</TableCell>
                            <TableCell>{input.quantityMin} p.m.</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item>
              {' '}
              {translate(tokens.satisfactory.pages.games.factories.outputs)}
              <TableContainer>
                <Table sx={{ minWidth: 400 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        {translate(tokens.satisfactory.pages.games.factories.product)}
                      </TableCell>
                      <TableCell>
                        {translate(tokens.satisfactory.pages.games.factories.amount)}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {statistics.totalOutputs.length &&
                      statistics.totalOutputs.map((output) => {
                        return (
                          <TableRow key={output.product}>
                            <TableCell>{products[output.product]?.name}</TableCell>
                            <TableCell>{output.quantityMin} p.m.</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </CardDefault> */}
      <FactoryInputsOutputs
        factories={formik.values.factories}
        selectedFactoryIndex={selectedFactoryIndex}
        version={version}
      />
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
  products: PropTypes.any,
  recipes: PropTypes.any,
  translate: PropTypes.func,
};
