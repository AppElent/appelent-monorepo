import { useTheme } from '@emotion/react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { getSatisfactoryData } from 'src/custom/libs/satisfactory';
import { STATION_IMAGES } from 'src/custom/libs/satisfactory/static';
import { getFactoryStatistics } from 'src/custom/libs/satisfactory/statistics';

const IMAGES = STATION_IMAGES;

const PlatformProductSelectorDialog = ({ modal, station, factories, setProducts, version }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [showAll, setShowAll] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const products = useMemo(() => getSatisfactoryData('items', version), [version]);

  const stationFactories = useMemo(
    () => factories?.filter((factory) => station?.factories?.find((f) => f === factory.id)),
    [factories, station]
  );

  const factoryProducts = useMemo(() => {
    const returnObject = {
      allInputs: [],
      allOutputs: [],
      inputs: [],
      outputs: [],
    };

    stationFactories.forEach((factory) => {
      const statistics = getFactoryStatistics(factory?.recipes, version);
      console.log(statistics);
      statistics?.totalInputs?.forEach(
        (input) =>
          !returnObject.inputs.includes(input.product) && returnObject.inputs.push(input.product)
      );
      statistics?.totalOutputs?.forEach(
        (input) =>
          !returnObject.outputs.includes(input.product) && returnObject.outputs.push(input.product)
      );
      statistics?.inputs?.forEach(
        (input) =>
          !returnObject.allInputs.includes(input.product) &&
          returnObject.allInputs.push(input.product)
      );
      statistics?.outputs?.forEach(
        (input) =>
          !returnObject.allOutputs.includes(input.product) &&
          returnObject.allOutputs.push(input.product)
      );
    });

    return returnObject;
  }, [stationFactories, version]);

  return (
    <Dialog
      onClose={() => modal.setModalState(false)}
      open={modal.modalOpen}
      fullWidth
      fullScreen={!matches}
      maxWidth="md"
    >
      <DialogTitle>
        <Stack
          justifyContent={'space-between'}
          direction="row"
        >
          <div>{station.name} - Platform product selection</div>
          <Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={showAll}
                  onChange={(e) => {
                    setShowAll(e.target.checked);
                  }}
                />
              }
              label="Show all inputs/outputs"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showInputs}
                  onChange={(e) => {
                    setShowInputs(e.target.checked);
                  }}
                />
              }
              label="Show inputs as outputs"
            />
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {station?.platforms?.map((platform) => {
                  const title = station.type === 'train' ? platform.type : station.type;
                  const direction =
                    station.type === 'train' ? platform.direction : station.direction;
                  return (
                    <TableCell key={platform.id}>
                      {title} ({direction})
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {station?.platforms?.map((platform, index) => {
                  const imageUrl =
                    station.type !== 'train' ? IMAGES[station.type] : IMAGES[platform.type];
                  return (
                    <TableCell key={platform.id}>
                      <Box
                        sx={{
                          width: 100,
                          '& img': {
                            width: '100%',
                          },
                          maxWidth: 'fit-content',
                        }}
                      >
                        <img src={imageUrl} />
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                {station?.platforms?.map((platform, index) => {
                  const direction =
                    station.type === 'train' ? platform.direction : station.direction;
                  console.log(factoryProducts);
                  const productList =
                    direction === 'in'
                      ? showAll
                        ? factoryProducts.allInputs
                        : factoryProducts.inputs
                      : showAll
                      ? showInputs
                        ? [...factoryProducts.allOutputs, ...factoryProducts.allInputs]
                        : factoryProducts.allOutputs
                      : showInputs
                      ? [...factoryProducts.outputs, ...factoryProducts.inputs]
                      : factoryProducts.outputs;

                  console.log(productList, direction, showAll);
                  //TODO: only show fluids or not
                  const fluidList = productList.filter((product) => products[product]?.isFluid);
                  const solidList = productList.filter((product) => !products[product]?.isFluid);
                  const defProductList = platform?.type === 'fluid' ? fluidList : solidList;

                  // The extra list contains products that are added previously but are not part of the current factory list
                  const extraList =
                    platform.products?.filter((p) => !defProductList.includes(p)) || [];
                  if (station.type === 'train' && ['empty', 'station'].includes(platform.type))
                    return <TableCell key={platform.id}></TableCell>;
                  return (
                    <TableCell
                      key={platform.id}
                      style={{ verticalAlign: 'top' }}
                    >
                      <FormGroup>
                        {defProductList.map((p) => {
                          return (
                            <FormControlLabel
                              key={p}
                              control={
                                <Checkbox
                                  checked={platform?.products?.includes(p) || false}
                                  onChange={(e) => {
                                    let currentProducts = [...(platform.products || [])] || [];
                                    e.target.checked && !currentProducts.includes(p)
                                      ? currentProducts.push(p)
                                      : (currentProducts = currentProducts.filter(
                                          (cp) => cp !== p
                                        ));
                                    setProducts(platform.id, currentProducts);
                                  }}
                                  name={p}
                                />
                              }
                              label={products[p]?.name}
                            />
                          );
                        })}

                        {extraList.map((p) => {
                          return (
                            <React.Fragment key={p}>
                              <FormHelperText>
                                Below products are not created or needed in this factory.
                              </FormHelperText>
                              <FormControlLabel
                                key={p}
                                control={
                                  <Checkbox
                                    checked={platform?.products?.includes(p) || false}
                                    error="Not part of list"
                                    onChange={(e) => {
                                      let currentProducts = [...(platform.products || [])] || [];
                                      e.target.checked && !currentProducts.includes(p)
                                        ? currentProducts.push(p)
                                        : (currentProducts = currentProducts.filter(
                                            (cp) => cp !== p
                                          ));
                                      setProducts(platform.id, currentProducts);
                                    }}
                                    name={p}
                                  />
                                }
                                label={products[p]?.name}
                              />
                            </React.Fragment>
                          );
                        })}
                      </FormGroup>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            modal.setModalState(false);
          }}
          autoFocus
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PlatformProductSelectorDialog.propTypes = {
  factories: PropTypes.array,
  modal: PropTypes.shape({
    modalOpen: PropTypes.any,
    setModalState: PropTypes.func,
    data: PropTypes.any,
  }),
  setProducts: PropTypes.func,
  station: PropTypes.shape({
    direction: PropTypes.string,
    factories: PropTypes.array,
    platforms: PropTypes.array,
    type: PropTypes.string,
  }),
  version: PropTypes.string,
};

export default PlatformProductSelectorDialog;
