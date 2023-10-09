import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import {
  Button,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import { createGuid } from 'src/custom/libs/create-guid';
import { GridDeleteIcon } from '@mui/x-data-grid';
import { Stack } from 'immutable';
import {
  getFactoryStatistics,
  getSatisfactoryRecipeStatistics,
} from 'src/custom/libs/satisfactory';
import VehicleProductSelectorDialog from 'src/components/app/satisfactory/transport/vehicle-product-selector-dialog';
import useModal from 'src/custom/hooks/use-modal';

const STOP_TEMPLATE = {
  products: [],
  direction: 'in',
};

export const VehicleStops = (props) => {
  const { addStop, deleteStop, setStop, stops, stations, vehicle, factories, products, recipes } =
    props;
  const modal = useModal();

  const filteredStations = stations.filter((station) => {
    if (station.type === 'train' && vehicle.type === 'train') return true;
    else if (station.type === 'truck' && ['tractor', 'truck'].includes(vehicle.type)) return true;
    else if (station.type === 'drone' && vehicle.type === 'drone') return true;
    else return false;
  });

  console.log(vehicle);

  return (
    <Card>
      <VehicleProductSelectorDialog
        modal={modal}
        vehicle={vehicle}
        stations={stations}
        setCarStopProducts={(stopId, products) => {
          const stop = stops.find((s) => s.id === stopId);
          //TODO: ik snap het niet

          console.log(999, vehicle, stop, { ...stop, cars: products });
          let newProducts = [...(stop?.products || [])];
          const foundIndex = newProducts?.findIndex((st) => st.car === products.car);
          console.log(newProducts, foundIndex);
          if (foundIndex > -1) {
            newProducts[foundIndex] = products;
          } else {
            if (products.products && products.products.length > 0) newProducts.push(products);
          }
          console.log(newProducts, foundIndex);
          if (stop) setStop(stopId, { ...stop, products: newProducts });
        }}
      />
      <CardHeader
        title="Vehicle stops"
        //subheader="Condition and temperature"
        action={
          <Button
            variant="contained"
            onClick={() => {
              const template = { ...STOP_TEMPLATE, id: createGuid(false) };
              addStop(template);
            }}
          >
            Add
          </Button>
        }
      />
      <CardContent>
        {stops.length > 0 && (
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Station</TableCell>
                  <TableCell>Factory name</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stops.map((stop) => {
                  console.log(stop);
                  const station = stations.find((station) => station.id === stop.station) || null;
                  const factoriesFiltered = factories?.filter((factory) =>
                    station?.factories?.includes(factory.id)
                  );
                  const productList = station?.platforms
                    ?.filter((platform) => platform.products !== undefined)
                    .map((platform) => platform?.products?.map((product) => product));
                  const recipeList = factoriesFiltered.map((factory) => {
                    return factory.recipes;
                  });
                  const satisfactoryStatistics = getFactoryStatistics(recipeList);

                  return (
                    <TableRow
                      key={stop.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <TextField
                          label="Station/stop"
                          sx={{ flexGrow: 1, minWidth: 200 }}
                          select
                          name={`station`}
                          onChange={(e) => {
                            setStop(stop.id, { ...stop, station: e.target.value });
                          }}
                          value={stop.station || ''}
                        >
                          {filteredStations?.map((station) => {
                            return (
                              <MenuItem
                                key={station.id}
                                value={station.id}
                              >
                                {station.name}
                              </MenuItem>
                            );
                          })}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        {factoriesFiltered?.map((factory) => (
                          <div key={factory.id}>{factory.name}</div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {/* {(station?.direction === 'in' || station?.type === 'train') &&
                          productList?.map((product) => {
                            return <div key={product}>{products[product]?.name}</div>;
                          })}
                        {console.log(stop)} */}
                        {stop.products?.map((pr, index) => {
                          return (
                            <div key={pr.car}>
                              <div>Car {index}:</div>
                              <div>
                                {pr.products?.map((cp) => (
                                  <div key={`${pr.car}-${cp}`}>{products[cp]?.name}</div>
                                ))}
                              </div>
                            </div>
                          );
                          // return pr.products?.map((cp) => (
                          //   <div key={`${pr.car}-${cp}`}>
                          //     Car {index} = {cp}
                          //   </div>
                          // ));
                          //return <div key={pr.car}>{JSON.stringify(pr)}</div>;
                        })}
                      </TableCell>
                      <TableCell>
                        {/* {(station?.direction === 'out' || station?.type === 'train') &&
                          productList?.map((product) => {
                            return <div key={product}>{products[product]?.name}</div>;
                          })} */}
                        <Button
                          onClick={() => {
                            modal.setData({
                              stop,
                            });
                            modal.setModalState(true);
                          }}
                        >
                          Configure products
                        </Button>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            deleteStop(stop.id);
                          }}
                        >
                          <GridDeleteIcon>Delete</GridDeleteIcon>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
        {stops.length === 0 && <>No items to show</>}
      </CardContent>
    </Card>
  );
};

VehicleStops.propTypes = {};
