import { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid";

const newObject = {
  name: "",
  age: "",
  isNew: true,
};

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    setRows((oldRows) => [...oldRows, newObject]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [name]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

const initialRows = [
  {
    // id: "123",
    name: "name1",
    age: 25,
  },
  {
    // id: "456",
    name: "name2",
    age: 36,
  },
];

export const SatisfactoryGamesFactories = (props) => {
  const { formik, game } = props;
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState({});

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
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const columns = [
    { field: "name", headerName: "Name", width: 180, editable: true },
    { field: "age", headerName: "Age", type: "number", editable: true },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              key={id}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              key={id}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            key={id}
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            key={id}
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Stack spacing={4}>
      <Card>
        <CardHeader title="Factory recipes" />
        <CardContent>
          <Box
            sx={{
              height: 500,
              width: "100%",
              "& .actions": {
                color: "text.secondary",
              },
              "& .textPrimary": {
                color: "text.primary",
              },
            }}
          >
            <DataGrid
              getRowId={(row) => row.name}
              rows={rows}
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
      <Button
        //color="inherit"
        disabled={!formik.dirty}
        size="small"
        onClick={formik.handleSubmit}
        variant="contained"
      >
        Save
      </Button>
    </Stack>
  );
};

SatisfactoryGamesFactories.propTypes = {
  formik: PropTypes.object,
  game: PropTypes.object.isRequired,
};
