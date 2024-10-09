import PropTypes from 'prop-types';
import { Autocomplete, Avatar, Stack, TextField } from '@mui/material';
import React, { useMemo } from 'react';
import { getSatisfactoryDataArray } from 'src/custom/libs/satisfactory';
import _ from 'lodash';

import { MaterialReactTable } from 'material-react-table';
import useCustomMaterialReactTable from 'src/custom/hooks/use-custom-material-react-table';

// eslint-disable-next-line react/display-name

const PlannerProductList = ({ products, setProducts, version }) => {
  const allProducts = useMemo(
    () => _.sortBy(getSatisfactoryDataArray('items', version), 'name'),
    [version]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'product',
        header: 'Product',
        minSize: 275,
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
                src={productClass ? `/assets/satisfactory/products/${productClass}.jpg` : undefined}
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
                    console.log(value, row);

                    if (row.index === -1) {
                      row._valuesCache[column.id] = value.className;
                      console.log(row, row._valuesCache);
                      table.setCreatingRow(row);
                    } else {
                      const currentProductList = [...products];
                      currentProductList[row.index].product = value.className;
                      setProducts(currentProductList);
                    }
                  }
                }}
                sx={{ width: '100%' }}
                size="small"
                value={currentProduct || null}
              />
            </Stack>
          );
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        Cell: ({ cell }) => <React.Fragment />,
        enableEditing: (row) => {
          if (row.original.mode !== 'max') return true;
          return false;
        },
        muiEditTextFieldProps: ({ cell, row, column }) => ({
          type: 'number',
          // onBlur: (event) => {
          //   setProducts({ ...products, [row.id]: row.original });
          // },
          label: column.columnDef.header,
          onBlur: (e) => {
            if (row.index > -1) {
              const currentProductList = [...products];
              const newAmount = parseFloat(e.target.value?.replace(',', '.'));
              currentProductList[row.index].amount = newAmount;
              setProducts(currentProductList);
            }
          },
        }),
        size: 100,
      },
      {
        accessorKey: 'mode',
        header: 'Mode',
        editVariant: 'select',
        editSelectOptions: [
          { label: 'Items per minute', value: 'itemsMin' },
          { label: '# of machines', value: 'machines' },
          { label: 'Maximize', value: 'max' },
        ],
        muiEditTextFieldProps: ({ cell, row, column }) => ({
          label: column.columnDef.header,
          //variant: 'outlined',
          onChange: (e) => {
            if (row.index > -1) {
              const currentProductList = [...products];
              currentProductList[row.index].mode = e.target.value;
              setProducts(currentProductList);
            }
          },
        }),
      },
      {
        accessorKey: 'production_mode',
        header: 'Production mode',
        editVariant: 'select',
        editSelectOptions: [
          { label: 'Output', value: 'output' },
          { label: 'Produce', value: 'produce' },
        ],
        muiEditTextFieldProps: ({ cell, row, column }) => ({
          label: column.columnDef.header,
          //variant: 'outlined',
          onChange: (e) => {
            if (row.index > -1) {
              const currentProductList = [...products];
              currentProductList[row.index].production_mode = e.target.value;
              setProducts(currentProductList);
            }
          },
        }),
      },
      {
        accessorKey: 'build_mode',
        header: 'Build mode',
        editVariant: 'select',
        editSelectOptions: [
          { label: 'Only this item', value: 'single' },
          { label: 'Whole chain', value: 'all' },
        ],
        muiEditTextFieldProps: ({ cell, row, column }) => ({
          label: column.columnDef.header,
          //variant: 'outlined',
          onChange: (e) => {
            if (row.index > -1) {
              const currentProductList = [...products];
              currentProductList[row.index].build_mode = e.target.value;
              setProducts(currentProductList);
            }
          },
        }),
      },
      {
        accessorKey: 'input_mode',
        header: 'Use inputs',
        editVariant: 'select',
        editSelectOptions: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
        muiEditTextFieldProps: ({ cell, row, column }) => ({
          label: column.columnDef.header,
          //variant: 'outlined',
          onChange: (e) => {
            if (row.index > -1) {
              const currentProductList = [...products];
              currentProductList[row.index].input_mode = e.target.value;
              setProducts(currentProductList);
            }
          },
        }),
      },
      {
        accessorKey: 'round',
        header: 'Round',
        editVariant: 'select',
        editSelectOptions: [
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ],
        muiEditTextFieldProps: ({ cell, row, column }) => ({
          label: column.columnDef.header,
          //variant: 'outlined',
          onChange: (e) => {
            if (row.index > -1) {
              const currentProductList = [...products];
              currentProductList[row.index].round = e.target.value;
              setProducts(currentProductList);
            }
          },
        }),
      },
      // extras: allow produced items to use inputs, use inputs
    ],
    [allProducts, products, setProducts]
  );

  const table = useCustomMaterialReactTable({
    data: products,
    columns,
    order: true,
    add: true,
    addTemplate: {
      mode: 'itemsMin',
      production_mode: 'output',
      build_mode: 'all',
      amount: 1,
    },
    edit: true,
    setData: setProducts,
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

PlannerProductList.propTypes = {
  products: PropTypes.array,
  setProducts: PropTypes.func,
};

export default PlannerProductList;
