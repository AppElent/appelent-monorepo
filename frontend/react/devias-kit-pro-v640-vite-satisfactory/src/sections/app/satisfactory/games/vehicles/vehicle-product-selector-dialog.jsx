import PropTypes from 'prop-types';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from '@mui/material';
import { nanoid } from 'nanoid';
import React, { useMemo, useEffect } from 'react';
import { getSatisfactoryData } from 'src/custom/libs/satisfactory';
import {
  PLATFORM_TYPES,
  STATION_IMAGES,
  VEHICLE_IMAGES,
} from 'src/custom/libs/satisfactory/static';

const IMAGES = VEHICLE_IMAGES;

const VehicleProductSelectorDialog = ({
  modal,
  vehicle,
  stations,
  setCarStopProducts,
  version,
}) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  //const [showAll, setShowAll] = useState(true);
  const products = useMemo(() => getSatisfactoryData('items', version), [version]);

  // .filter(
  //   (car) => car.type !== 'locomotive'
  // );

  const currentStation = useMemo(
    () => stations.find((s) => s.id === modal.data?.stop?.station),
    [modal.data]
  );

  useEffect(() => {
    if (!vehicle?.cars?.length > 0) {
      //casd
    }
  }, [vehicle.cars]);

  const cars =
    vehicle?.cars?.length > 0
      ? vehicle.cars?.filter((car, index) => index < currentStation?.platforms?.length)
      : [{ id: nanoid() }];

  const currentStop = useMemo(() => {
    return vehicle.stops?.find((st) => st.id === modal.data?.stop?.id);
  }, [modal.data, vehicle]);

  console.log(currentStop);

  return (
    <Dialog
      onClose={() => modal.setModalState(false)}
      open={modal.modalOpen}
      fullWidth
      fullScreen={!matches}
      maxWidth="lg"
    >
      <DialogTitle>
        <Stack
          justifyContent={'space-between'}
          direction="row"
        >
          <div>Vehicle {vehicle.name} - Product selection</div>
          {/* <FormControlLabel
            control={
              <Switch
                checked={showAll}
                onChange={(e) => {
                  setShowAll(e.target.checked);
                }}
              />
            }
            label="Show only factory inputs/outputs"
          /> */}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {cars.map((car, index) => {
                  const direction =
                    vehicle.type === 'train'
                      ? currentStation?.platforms[index]?.direction || 'N/A'
                      : currentStation?.direction;

                  const label = car.type
                    ? `${car.type} - Products - ${direction}`
                    : `${vehicle.type} - Products - ${direction || 'N/A'}`;

                  if (vehicle.type === 'train' && car.type === 'locomotive')
                    return (
                      <TableCell
                        width={30}
                        key={car.id}
                      >
                        Locomotive
                      </TableCell>
                    );

                  return <TableCell key={car.id}>{label}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {currentStation?.platforms?.map((platform, index) => {
                  const imageUrl =
                    currentStation.type !== 'train'
                      ? STATION_IMAGES[currentStation.type]
                      : STATION_IMAGES[platform.type];
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
                        <Box textAlign={'center'}>{PLATFORM_TYPES[platform.type]}</Box>
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                {cars.map((car) => {
                  const type = currentStation.type === 'train' ? car.type : vehicle.type;
                  return (
                    <TableCell key={car.id}>
                      <Box
                        sx={{
                          width: 100,
                          '& img': {
                            width: '100%',
                          },
                          maxWidth: 'fit-content',
                        }}
                      >
                        <img src={IMAGES[type]} />
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                {cars.map((car, index) => {
                  const platformId = currentStation?.platforms?.[index]?.id;
                  const productsPossible = currentStation?.platforms?.[index]?.products;
                  const carFound = currentStop.products?.find((prod) => prod.car === car.id);
                  const restProducts = carFound?.products.filter(
                    (pr) => !productsPossible.includes(pr)
                  );
                  console.log(restProducts);

                  if (car.type === 'locomotive') {
                    return <TableCell key={car.id}></TableCell>;
                  }
                  return (
                    <TableCell
                      key={car.id}
                      style={{ verticalAlign: 'top' }}
                    >
                      <FormGroup>
                        {/* {car.id} - {car.type} */}
                        {productsPossible?.map((p) => {
                          // const carFound = currentStop.products?.find(
                          //   (prod) => prod.car === car.id
                          // );
                          const checked =
                            carFound && carFound?.products?.includes(p) ? true : false;

                          return (
                            <FormControlLabel
                              key={p}
                              control={
                                <Checkbox
                                  checked={checked}
                                  onChange={(e) => {
                                    let currentProducts = [...(carFound?.products || [])] || [];
                                    e.target.checked && !currentProducts.includes(p)
                                      ? currentProducts.push(p)
                                      : (currentProducts = currentProducts.filter(
                                          (cp) => cp !== p
                                        ));
                                    setCarStopProducts(modal.data.stop?.id, {
                                      car: car.id,
                                      products: currentProducts,
                                      platform: platformId,
                                    });
                                  }}
                                  name={p}
                                />
                              }
                              label={products[p]?.name}
                            />
                          );
                        })}
                        {restProducts?.map((p) => {
                          // const carFound = currentStop.products?.find(
                          //   (prod) => prod.car === car.id
                          // );
                          const checked =
                            carFound && carFound?.products?.includes(p) ? true : false;

                          return (
                            <React.Fragment key={p}>
                              <FormHelperText>
                                Below products are configured to be loaded in or out this vehicle
                                but are not attached to the factory
                              </FormHelperText>
                              <FormControlLabel
                                key={p}
                                control={
                                  <Checkbox
                                    checked={checked}
                                    onChange={(e) => {
                                      let currentProducts = [...(carFound?.products || [])] || [];
                                      e.target.checked && !currentProducts.includes(p)
                                        ? currentProducts.push(p)
                                        : (currentProducts = currentProducts.filter(
                                            (cp) => cp !== p
                                          ));
                                      setCarStopProducts(modal.data.stop?.id, {
                                        car: car.id,
                                        products: currentProducts,
                                        platform: platformId,
                                      });
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
        {/* Station:
        <pre>{JSON.stringify(modal.data, undefined, 2)}</pre>
        Vehicle:
        <pre>{JSON.stringify(vehicle, undefined, 2)}</pre> */}
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

VehicleProductSelectorDialog.propTypes = {
  modal: PropTypes.shape({
    data: PropTypes.any,
    modalOpen: PropTypes.bool,
    setModalState: PropTypes.func,
  }),
  setCarStopProducts: PropTypes.func,
  stations: PropTypes.array,
  vehicle: PropTypes.shape({
    cars: PropTypes.array,
    name: PropTypes.string,
    stops: PropTypes.array,
    type: PropTypes.string,
  }),
  version: PropTypes.string,
};

export default VehicleProductSelectorDialog;
