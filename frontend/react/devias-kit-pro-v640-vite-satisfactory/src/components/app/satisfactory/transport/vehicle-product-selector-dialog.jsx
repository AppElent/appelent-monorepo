import { useTheme } from '@emotion/react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
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
import { nanoid } from 'nanoid';
import { useMemo, useState } from 'react';
import { getFactoryStatistics, getSatisfactoryData } from 'src/custom/libs/satisfactory';

const VehicleProductSelectorDialog = ({
  modal,
  vehicle,
  stations,
  setCarStopProducts,
  version,
}) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [showAll, setShowAll] = useState(true);
  const products = useMemo(() => getSatisfactoryData('items', version), [version]);

  const cars = (vehicle?.cars?.length > 0 ? vehicle.cars : [{ id: nanoid() }]).filter(
    (car) => car.type !== 'locomotive'
  );

  const currentStation = useMemo(
    () => stations.find((s) => s.id === modal.data?.stop?.station),
    [modal.data]
  );

  const currentStop = useMemo(() => {
    console.log(vehicle, modal.data);
    return vehicle.stops.find((st) => st.id === modal.data?.stop?.id);
  }, [modal.data, vehicle]);

  console.log(cars, stations, modal.data, currentStation, currentStop, vehicle);

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
          <div>Vehicle {vehicle.name} product selection</div>
          <FormControlLabel
            control={
              <Switch
                checked={showAll}
                onChange={(e) => {
                  setShowAll(e.target.checked);
                }}
              />
            }
            label="Show only factory inputs/outputs"
          />
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
                      ? currentStation?.platforms[index + 1]?.direction
                      : currentStation?.direction;

                  const label = car.type
                    ? `${car.type} - Products - ${direction}`
                    : `${vehicle.type} - Products - ${direction}`;
                  return <TableCell key={car.id}>{label}</TableCell>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {cars.map((car, index) => {
                  const platformId =
                    vehicle.type === 'train'
                      ? currentStation?.platforms?.[index + 1]?.id
                      : currentStation?.platforms?.[index]?.id;
                  const productsPossible =
                    vehicle.type === 'train'
                      ? currentStation?.platforms?.[index + 1]?.products
                      : currentStation?.platforms?.[index]?.products;
                  return (
                    <TableCell key={car.id}>
                      <FormGroup>
                        {/* {car.id} - {car.type} */}
                        {productsPossible?.map((p) => {
                          console.log(currentStop.products, car.id);
                          const carFound = currentStop.products?.find(
                            (prod) => prod.car === car.id
                          );
                          const checked =
                            carFound && carFound?.products?.includes(p) ? true : false;
                          console.log(carFound, checked);
                          return (
                            <FormControlLabel
                              key={p}
                              control={
                                <Checkbox
                                  checked={checked}
                                  onChange={(e) => {
                                    let currentProducts = [...(car.products || [])] || [];
                                    e.target.checked && !currentProducts.includes(p)
                                      ? currentProducts.push(p)
                                      : (currentProducts = currentProducts.filter(
                                          (cp) => cp !== p
                                        ));
                                    console.log(currentProducts);
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

export default VehicleProductSelectorDialog;
