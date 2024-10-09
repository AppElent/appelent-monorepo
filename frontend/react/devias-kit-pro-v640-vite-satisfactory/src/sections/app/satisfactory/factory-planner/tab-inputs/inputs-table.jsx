import { Autocomplete, Avatar, Button, IconButton, Stack, TextField } from '@mui/material';
import { MaterialReactTable, createRow, useMaterialReactTable } from 'material-react-table';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useMemo } from 'react';
import { getSatisfactoryDataArray } from 'src/custom/libs/satisfactory';
import _ from 'lodash';
import useCustomMaterialReactTable from 'src/custom/hooks/use-custom-material-react-table';

const InputsTable = ({ inputs, setInputs, version }) => {
  const allProducts = useMemo(
    () => _.sortBy(getSatisfactoryDataArray('items', version), 'name'),
    [version]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'product',
        header: 'Product',
        minSize: 300,
        Edit: ({ row, table, column }) => {
          const productClass = row._valuesCache[column.id] || row.original?.product;
          const currentProduct = allProducts.find((p) => p.className === productClass);
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
                options={allProducts}
                //multiple
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
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
                    if (row.index === -1) {
                      row._valuesCache[column.id] = value.className;
                      table.setCreatingRow(row);
                    } else {
                      const currentProductList = [...inputs];
                      currentProductList[row.index].product = value.className;
                      setInputs(currentProductList);
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
        accessorKey: 'amount',
        header: 'Items per minute',
        enableEditing: (row) => {
          if (row.original.mode !== 'max') return true;
          return false;
        },
        muiEditTextFieldProps: ({ cell, row, column }) => ({
          type: 'number',
          label: column.columnDef.header,
          size: 'small',
          onBlur: (e) => {
            if (row.index > -1) {
              console.log(e.target.value, row.index, inputs);
              const currentProductList = [...inputs];
              const newAmount = parseFloat(e.target.value?.replace(',', '.'));
              currentProductList[row.index].amount = newAmount;
              setInputs(currentProductList);
            }
          },
        }),
      },
      {
        accessorKey: 'all',
        header: 'Mode',
        editVariant: 'select',
        editSelectOptions: [
          { label: 'Set indefinite', value: 'true' },
          { label: 'Limit to number', value: 'false' },
        ],
        muiEditTextFieldProps: ({ cell, row, column }) => ({
          label: column.columnDef.header,
          size: 'small',
          onChange: (e) => {
            if (row.index > -1) {
              const currentProductList = [...inputs];
              currentProductList[row.index].all = e.target.value;
              setInputs(currentProductList);
            }
          },
        }),
        Header: ({ column }) => <>{column.columnDef.header}</>,
      },
    ],
    [allProducts, inputs, setInputs]
  );

  const table = useCustomMaterialReactTable({
    data: inputs,
    setData: setInputs,
    columns,
    add: true,
    addTemplate: { amount: 1, all: 'false' },
    edit: true,
  });

  // const table = useMaterialReactTable({
  //   columns,
  //   data: inputs,
  //   enableRowActions: true,
  //   positionActionsColumn: 'last',
  //   enableSorting: false,
  //   editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
  //   enableEditing: true,
  //   muiTablePaperProps: {
  //     sx: {
  //       //stripe the rows, make odd rows a darker color
  //       table: {
  //         backgroundColor: 'background.paper',
  //       },
  //       backgroundColor: 'background.paper',
  //     },
  //   },
  //   renderRowActions: ({ row }) => (
  //     <IconButton
  //       onClick={() => {
  //         const currentProductList = [...inputs].filter((p) => p.product !== row.original?.product);
  //         setInputs(currentProductList);
  //       }}
  //     >
  //       <DeleteOutlineIcon color="error" />
  //     </IconButton>
  //   ),
  //   renderTopToolbarCustomActions: ({ table }) => (
  //     <Button
  //       variant="outlined"
  //       onClick={() => {
  //         table.setCreatingRow(true); //simplest way to open the create row modal with no default values
  //         //or you can pass in a row object to set default values with the `createRow` helper function
  //         //   table.setCreatingRow(
  //         //     createRow(table, {
  //         //       //optionally pass in default values for the new row, useful for nested data or other complex scenarios
  //         //       product: 'itemsMin',
  //         //       production_mode: 'produce',
  //         //       amount: 1,
  //         //     })
  //         //   );
  //       }}
  //     >
  //       Add
  //     </Button>
  //   ),
  //   createDisplayMode: 'row',
  //   onCreatingRowSave: ({ table, values }) => {
  //     //validate data
  //     //save data to api
  //     if (values) {
  //       console.log(values);
  //       const currentProductList = [...inputs];
  //       currentProductList.unshift(values);

  //       setInputs(currentProductList);
  //     }

  //     table.setCreatingRow(null); //exit editing mode
  //   },
  // });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default InputsTable;
