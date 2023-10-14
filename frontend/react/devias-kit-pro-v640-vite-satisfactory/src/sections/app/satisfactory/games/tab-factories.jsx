import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Stack,
} from '@mui/material';
import FactoryRecipeCard from './factories/factory-recipe-card';
import { useQueryParam } from 'use-query-params';
import { generateName } from 'src/custom/libs/random-name-generator';
import { tokens } from 'src/locales/tokens';
import { useSelected } from 'src/custom/hooks/use-selected';
import { useConfirm } from 'material-ui-confirm';
import FactorySelect from './factories/factory-select';
import FactoryInputsOutputs from './factories/factory-inputs-outputs';
import FactoryInformationCard from './factories/factory-information-card';
import { useTranslate } from '@refinedev/core';
import { setFormikArrayItem } from 'src/custom/utils/formik-crud-functions';
import { nanoid } from 'nanoid';

const FACTORY_TEMPLATE = {
  description: '',
  finished: false,
  checked: false,
  recipes: [],
};

const TabFactories = (props) => {
  const { formik, game, recipes, products, version } = props;
  const translate = useTranslate();
  const confirm = useConfirm();
  const [factoryId, setFactoryId] = useQueryParam('factory');
  //const [recipeState, setRecipeState] = useState({});

  const [selectedFactory, selectedFactoryIndex] = useSelected(formik.values.factories, factoryId);

  const createFactory = () => {
    const currentFactories = formik.values.factories ? [...formik.values.factories] : [];
    const id = nanoid();
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
      <FactoryInformationCard
        factory={selectedFactory}
        // selectedFactoryIndex={selectedFactoryIndex}
        // formik={formik}
        deleteFactory={deleteFactory}
        formikNamespace={`factories.${selectedFactoryIndex}`}
        errors={formik.errors?.factories?.[selectedFactoryIndex]}
        handleChange={formik.handleChange}
      />
      <FactoryInputsOutputs
        factories={formik.values.factories}
        selectedFactoryIndex={selectedFactoryIndex}
        version={version}
      />
      <FactoryRecipeCard
        //game={game}
        factory={selectedFactory}
        setFactory={setFormikArrayItem(formik, `factories`)}
        formikNamespace={`factories.${selectedFactoryIndex}`}
        //factoryIndex={selectedFactoryIndex}
        //formik={formik}
        recipes={recipes}
        products={products}
      />
    </Stack>
  );
};

export default TabFactories;

TabFactories.propTypes = {
  formik: PropTypes.object,
  game: PropTypes.object.isRequired,
  products: PropTypes.any,
  recipes: PropTypes.any,
};
