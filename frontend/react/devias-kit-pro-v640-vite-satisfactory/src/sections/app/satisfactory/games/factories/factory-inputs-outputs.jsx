import PropTypes from 'prop-types';
import { useTranslate } from '@refinedev/core';
import { CardDefault } from 'src/components/app/card-default';
import { tokens } from 'src/locales/tokens';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { getFactoryStatistics, getSatisfactoryData } from 'src/custom/libs/satisfactory';
import { useMemo } from 'react';

const FactoryInputsOutputs = ({ factories, selectedFactoryIndex, version }) => {
  const translate = useTranslate();
  const products = useMemo(() => getSatisfactoryData('items', version), [version]);

  const statistics = useMemo(
    () => getFactoryStatistics(factories?.[selectedFactoryIndex]?.recipes, version),
    [factories?.[selectedFactoryIndex]?.recipes, version]
  );

  return (
    <CardDefault
      title={
        translate(tokens.satisfactory.pages.games.factories.inputs) +
        ' / ' +
        translate(tokens.satisfactory.pages.games.factories.outputs)
      }
    >
      {statistics?.totalInputs.length === 0 && statistics?.totalOutputs.length === 0 ? (
        factories[selectedFactoryIndex]?.recipes?.length > 0 ? (
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
    </CardDefault>
  );
};

FactoryInputsOutputs.propTypes = {
  factories: PropTypes.array,
  selectedFactoryIndex: PropTypes.number,
  version: PropTypes.string,
};

export default FactoryInputsOutputs;
