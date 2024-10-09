import {
  Autocomplete,
  Button,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useMemo } from 'react';
import { getSatisfactoryData } from 'src/custom/libs/satisfactory';

const TempResult = ({ version, results }) => {
  const products = useMemo(() => getSatisfactoryData('items', version), []);
  const recipes = useMemo(() => getSatisfactoryData('recipes'), []);

  console.log(results);

  const productArray = useMemo(() => {
    if (!results?.data?.items) return [];
    const result = [];
    Object.keys(results.data.items).forEach((productClass) => {
      // Do something with RECIPE and RESOURCES
      Object.keys(results.data.items[productClass]).forEach((childProductClass) => {
        if (!['recipe', 'resources'].includes(childProductClass)) {
          const object = results.data.items[productClass][childProductClass];
          result.push({ amount: object.amount, product: childProductClass });
        }
      });
    });
    return result;
  }, [results]);

  return (
    <>
      {productArray.map((item) => {
        return (
          <React.Fragment key={JSON.stringify(item)}>
            {item.amount} x {item.product}
            <br />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default TempResult;
