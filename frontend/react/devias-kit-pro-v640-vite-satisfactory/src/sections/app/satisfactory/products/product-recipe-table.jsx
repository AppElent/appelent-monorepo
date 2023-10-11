import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CardContent,
  Tooltip,
  TableContainer,
} from '@mui/material';
import React from 'react';

import { SeverityPill } from 'src/components/severity-pill';
import { tokens } from 'src/locales/tokens';
import { recipeChart } from 'src/custom/libs/satisfactory';
import Mermaid from 'src/custom/libs/mermaid';
import { Link } from 'react-router-dom';
import { paths } from 'src/paths';

export const SatisfactoryProductRecipeTable = ({
  recipes,
  title,
  products,
  machineTypes,
  conditionFunction,
  translate,
}) => {
  const columns = [
    { label: translate(tokens.common.fields.name) },
    { label: translate(tokens.satisfactory.pages.products.input) },
    { label: translate(tokens.satisfactory.pages.products.machine) },
    { label: translate(tokens.satisfactory.pages.products.output) },
    { label: translate(tokens.satisfactory.pages.products.requirements) },
    { label: '' },
  ];

  //   return <Stack></Stack>;

  const schematicTypes = {
    EST_MAM: 'MAM',
    EST_Custom: 'Custom',
    EST_Alternate: 'Alternate recipe',
    EST_Tutorial: 'Tutorial',
    EST_HardDrive: 'HardDrive',
    EST_Milestone: 'Milestone',
    EST_ResourceSink: 'ResourceSink',
  };

  return (
    // <Stack>
    //   <Stack spacing={3}>
    <Card>
      <CardHeader title={title} />
      {/* <Scrollbar> */}
      <CardContent>
        <TableContainer>
          <Table sx={{ minWidth: 400 }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.label}>{column.label}</TableCell>
                ))}
                {/* <TableCell>Description</TableCell>
              <TableCell>Billing Cycle</TableCell>
              <TableCell>Amount</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {recipes.map((recipe) => {
                const perMinute = 60 / recipe.craftTime;

                if (conditionFunction && !conditionFunction(recipe, products)) {
                  return <React.Fragment key={recipe.className}></React.Fragment>;
                }

                const tierColor = ['A', 'S'].includes(recipe.tier?.rating)
                  ? 'success'
                  : ['B', 'C'].includes(recipe.tier?.rating)
                  ? 'warning'
                  : 'error';
                const TierToolTip = () => {
                  return (
                    <Tooltip title={recipe.tier?.notes}>
                      <div>
                        <SeverityPill color={tierColor}>Tier: {recipe.tier.rating}</SeverityPill>
                      </div>
                    </Tooltip>
                  );
                };
                const chartCode = recipeChart(recipe, products, machineTypes, { hideTitle: true });

                return (
                  <TableRow key={recipe.className}>
                    <TableCell>
                      <Link to={paths.app.satisfactory.recipes.index + '?recipe=' + recipe.slug}>
                        {recipe.name}{' '}
                        {recipe.tier && (
                          <>
                            <br />
                            <TierToolTip />
                            {/* <SeverityPill color={tierColor}>
                          Tier: {recipe.tier.rating}
                        </SeverityPill> */}
                          </>
                        )}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {recipe.ingredients.map((ingredient) => {
                        return (
                          <React.Fragment key={ingredient.itemClass}>
                            {ingredient.quantity} * {products[ingredient.itemClass].name} (
                            {perMinute * ingredient.quantity} p.m.)
                            <br />
                          </React.Fragment>
                        );
                      })}
                    </TableCell>
                    <TableCell>
                      {recipe.machineCraftable ? machineTypes[recipe.producedIn]?.name : 'Workshop'}
                      {recipe.machineCraftable && (
                        <>
                          <br />({recipe.craftTime} seconds)
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {' '}
                      {recipe.products.map((ingredient) => {
                        return (
                          <React.Fragment key={ingredient.itemClass}>
                            {ingredient.quantity} * {products[ingredient.itemClass].name} (
                            {perMinute * ingredient.quantity} p.m.)
                            <br />
                          </React.Fragment>
                        );
                      })}
                    </TableCell>
                    <TableCell>
                      {recipe.schematic.name} (
                      {schematicTypes[recipe.schematic.type] || recipe.schematic.type})
                    </TableCell>
                    <TableCell>
                      <Mermaid chart={chartCode} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* {items.map((item) => {
                const unitAmount = numeral(item.unitAmount).format(
                  `${item.currency}0,0.00`
                );

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.name} x {item.quantity}
                    </TableCell>
                    <TableCell>{item.billingCycle}</TableCell>
                    <TableCell>{unitAmount}</TableCell>
                  </TableRow>
                );
              })} */}
            </TableBody>
          </Table>
        </TableContainer>
        {/* </Scrollbar> */}
      </CardContent>
    </Card>
    //   </Stack>
    // </Stack>
  );
};

SatisfactoryProductRecipeTable.propTypes = {
  conditionFunction: PropTypes.func,
  machineTypes: PropTypes.any,
  products: PropTypes.any,
  recipes: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  translate: PropTypes.func,
};
