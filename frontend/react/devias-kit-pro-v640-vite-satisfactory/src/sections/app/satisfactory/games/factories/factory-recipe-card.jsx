import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Autocomplete, Card, CardContent, CardHeader, Icon, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useTranslate } from '@refinedev/core';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import * as React from 'react';
import { toast } from 'react-hot-toast';
import { tokens } from 'src/locales/tokens';

// const initialRows = [
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 25,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 36,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 19,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 28,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
//   {
//     id: randomId(),
//     name: randomTraderName(),
//     age: 23,
//     dateCreated: randomCreatedDate(),
//     lastLogin: randomUpdatedDate(),
//   },
// ];

const FACTORY_RECIPE_TEMPLATE = {
  recipe: '',
  amount: 1,
  isNew: true,
};

/**
 *
 * @param {object} props props
 * @returns {any} toolbar
 */
function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = nanoid();
    //setRows((oldRows) => [...oldRows, { id, ...FACTORY_RECIPE_TEMPLATE }]);
    setRows({ id, ...FACTORY_RECIPE_TEMPLATE });
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'recipe' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClick}
      >
        Add
      </Button>
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  setRowModesModel: PropTypes.func.isRequired,
  setRows: PropTypes.func.isRequired,
};

/**
 *
 * @param {any} props props
 * @returns {any} object
 */
export function FactoryRecipeCard(props) {
  const { factory, setFactory, formikNamespace, recipes, products } = props;
  const rows = factory.recipes || [];
  //const [rowsNew, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const translate = useTranslate();

  const setRows = (newItem) => {
    const currentRecipes = factory.recipes || [];
    setFactory(factory.id, { ...factory, recipes: [...currentRecipes, newItem] });
    //formik.setFieldValue(`factories.${factoryIndex}.recipes`, [...currentRecipes, newItem]);
  };

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    const newRecipes = factory.recipes?.filter((row) => row.id !== id);
    //formik.setFieldValue(`factories.${factoryIndex}.recipes`, newRecipes);
    setFactory(factory.id, { ...factory, recipes: newRecipes });
    //setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      //TODO
      const oldList = factory?.recipes.filter((r) => r.id !== id);
      //formik.setFieldValue(`factories.${factoryIndex}.recipes`, oldList);
      setFactory(factory.id, { ...factory, recipes: oldList });
      //setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    const rowIndex = factory?.recipes?.find((row) => row.id === newRow.id);
    if (rowIndex) {
      setFactory(factory.id, {
        ...factory,
        recipes: factory?.recipes?.map((row) => (row.id === newRow.id ? updatedRow : row)),
      });
      // formik.setFieldValue(
      //   `factories.${factoryIndex}.recipes`,
      //   factory?.recipes.map((row) =>
      //     row.id === newRow.id ? updatedRow : row
      //   )
      // );
    }
    //TODO

    //setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const RecipeEditInputCell = (props) => {
    const { id, row, field } = props;

    const apiRef = useGridApiContext();
    let index = factory.recipes?.findIndex((r) => r.id === id);

    if (index < 0) index = 0;
    //const [index, setIndex] = React.useState(firstIndex);

    const handleChange = async (event, value) => {
      await apiRef.current.setEditCellValue({
        id,
        field,
        row,
        value: value.className,
      });

      toast(
        (t) => (
          <div>
            {value.name}
            <br />
            <b>{translate(tokens.satisfactory.pages.games.factories.inputs)}</b> <br />
            {value.ingredients.map((i) => `${i.quantity} x ${products[i.itemClass].name}\r\n`)}
            <br />
            <b>{translate(tokens.satisfactory.pages.games.factories.outputs)}</b> <br />
            {value.products.map((i) => `${i.quantity} x ${products[i.itemClass].name}\r\n`)}
            <br />
            <button onClick={() => toast.dismiss(t.id)}>
              {translate(tokens.common.buttons.dismiss)}
            </button>
          </div>
        ),
        {
          icon: <Icon />,
          position: 'top-right',
          duration: 20000,
        }
      );
      apiRef.current.stopCellEditMode({ id, field });
    };

    // const rowIndex = formik.values.factories[factoryIndex].recipes.findIndex(
    //   (r) => r.id === row.id
    // );

    const currentRecipe = recipes.find(
      (recipe) => recipe.className === factory.recipes[index]?.recipe
    );

    return (
      <Autocomplete
        getOptionLabel={(option) => option.name}
        options={recipes || []}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label={translate(tokens.satisfactory.pages.games.factories.recipe)}
            name={`${formikNamespace}.recipes.${index}`}
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
        onChange={handleChange}
        // onChange={(e, value) => {
        //   setFactoryId(value.id);
        // }}
        sx={{ width: 300 }}
        value={currentRecipe}
      />
    );
  };

  const renderSelectEditInputCell = (params) => {
    return <RecipeEditInputCell {...params} />;
  };

  const columns = [
    // {
    //   field: "recipe",
    //   headerName: "Recipe",
    //   editable: true,
    //   flex: 1,
    // },
    {
      field: 'recipe',
      headerName: translate(tokens.satisfactory.pages.games.factories.recipe),
      renderEditCell: renderSelectEditInputCell,
      editable: true,
      width: 350,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '';
        }

        const recipename = recipes.find((recipe) => recipe.className === params.value)?.name;
        return `${recipename}`;
      },
    },
    {
      field: 'amount',
      headerName: translate(tokens.satisfactory.pages.games.factories.amount),
      editable: true,
      preProcessEditCellProps: (params) => {
        try {
          //const newValue = parseFloat(params.props.value);
        } catch {
          return { ...params.props, error: true };
        }
        return { ...params.props, error: false };
      },
      width: 100,
      valueSetter: (params) => {
        return {
          ...params.row,
          amount: parseFloat(params.value.toString().replace(',', '.')).toString(),
        };
      },
    },
    {
      field: 'inputs',
      headerName: translate(tokens.satisfactory.pages.games.factories.inputs),
      editable: false,
      renderCell: (params) => {
        if (params.row.recipe === '' || !params.row.recipe) {
          return '';
        }
        return (
          <div>
            {recipes
              .find((recipe) => recipe.className === params.row.recipe)
              ?.ingredients.map((input) => {
                const recipe = recipes.find((r) => r.className === params.row.recipe);
                const itemsPerMinute = 60 / recipe.craftTime || 0;
                const total = input.quantity * itemsPerMinute * params.row.amount;
                return (
                  <React.Fragment key={input.itemClass}>
                    {total} x {products[input.itemClass].name}
                    <br />
                  </React.Fragment>
                );
              })}
          </div>
        );
      },
      flex: 2,
    },
    {
      field: 'outputs',
      headerName: translate(tokens.satisfactory.pages.games.factories.outputs),
      editable: false,
      renderCell: (params) => {
        if (params.row.recipe === '' || !params.row.recipe) {
          return '';
        }
        return (
          <div>
            {recipes
              .find((recipe) => recipe.className === params.row.recipe)
              ?.products.map((input) => {
                const recipe = recipes.find((r) => r.className === params.row.recipe);
                const itemsPerMinute = 60 / recipe.craftTime || 0;
                const total = input.quantity * itemsPerMinute * params.row.amount;
                return (
                  <React.Fragment key={input.itemClass}>
                    {total} x {products[input.itemClass].name}
                    <br />
                  </React.Fragment>
                );
              })}
          </div>
        );
      },
      flex: 2,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={id}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Card>
      <CardHeader title="Recipes" />
      <CardContent>
        {translate(tokens.satisfactory.pages.games.factories.recipeHelperText)}
        <Box
          sx={{
            height: 500,
            width: '100%',
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
          }}
        >
          <DataGrid
            rows={factory.recipes || []}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            components={{
              Toolbar: EditToolbar,
            }}
            componentsProps={{
              toolbar: { setRows, setRowModesModel },
            }}
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

FactoryRecipeCard.propTypes = {
  factory: PropTypes.shape({
    id: PropTypes.any,
    recipes: PropTypes.array,
  }),
  formikNamespace: PropTypes.any,
  products: PropTypes.any,
  recipes: PropTypes.array,
  setFactory: PropTypes.func,
};

export default FactoryRecipeCard;
