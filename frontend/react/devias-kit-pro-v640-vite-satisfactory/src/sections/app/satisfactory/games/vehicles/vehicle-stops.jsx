/* eslint-disable react/display-name */
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import {
  Avatar,
  Button,
  CardContent,
  MenuItem,
  Stack,
  TableContainer,
  TextField,
} from '@mui/material';
import { GridDeleteIcon } from '@mui/x-data-grid';
import VehicleProductSelectorDialog from 'src/sections/app/satisfactory/games/vehicles/vehicle-product-selector-dialog';
import useModal from 'src/custom/hooks/use-modal';
import { nanoid } from 'nanoid';
import {
  PLATFORM_TYPES,
  STATION_IMAGES,
  VEHICLE_IMAGES,
  VEHICLE_TYPES,
} from 'src/custom/libs/satisfactory/static';

const STOP_TEMPLATE = {
  products: [],
  direction: 'in',
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  // ...(isDragging && {
  //   background: 'rgb(235,235,235)',
  // }),
});

const DraggableComponent = (id, index) => (props) => {
  return (
    <Draggable
      draggableId={id}
      index={index}
    >
      {(provided, snapshot) => (
        <TableRow
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
          {...props}
        >
          {props.children}
        </TableRow>
      )}
    </Draggable>
  );
};

const DroppableComponent = (onDragEnd) => (props) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId={'1'}
        direction="vertical"
      >
        {(provided) => {
          return (
            <TableBody
              ref={provided.innerRef}
              {...provided.droppableProps}
              {...props}
            >
              {props.children}
              {provided.placeholder}
            </TableBody>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};

export const VehicleStops = (props) => {
  const { addStop, deleteStop, setStop, setStops, stops, stations, vehicle, factories, products } =
    props;
  const modal = useModal();

  const filteredStations = stations.filter((station) => {
    const vehicleType = VEHICLE_TYPES.find((v) => v.key === vehicle.type);
    return station.type === vehicleType.station;
    // if (station.type === 'train' && vehicle.type === 'train') return true;
    // else if (station.type === 'truck' && ['tractor', 'truck'].includes(vehicle.type)) return true;
    // else if (station.type === 'drone' && vehicle.type === 'drone') return true;
    // else return false;
  });

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    console.log(`dragEnd ${result.source.index} to  ${result.destination.index}`);
    const items = reorder(stops, result.source.index, result.destination.index);

    setStops([...items]);
  };

  return (
    <Card>
      <VehicleProductSelectorDialog
        modal={modal}
        vehicle={vehicle}
        stations={stations}
        setCarStopProducts={(stopId, products) => {
          const stop = stops.find((s) => s.id === stopId);
          //TODO: ik snap het niet

          let newProducts = [...(stop?.products || [])];
          const foundIndex = newProducts?.findIndex((st) => st.car === products.car);
          if (foundIndex > -1) {
            newProducts[foundIndex] = products;
          } else {
            if (products.products && products.products.length > 0) newProducts.push(products);
          }
          if (stop) setStop(stopId, { ...stop, products: newProducts });
        }}
      />
      <CardHeader
        title="Vehicle stops"
        subheader="You can reorder the stops by dragging and dropping"
        action={
          <Button
            variant="contained"
            onClick={() => {
              const template = { ...STOP_TEMPLATE, id: nanoid() };
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
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Station</TableCell>
                    <TableCell>Factory name</TableCell>
                    {vehicle.cars?.map((car, index) => {
                      return <TableCell key={car.id}>products</TableCell>;
                    })}
                    {/* <TableCell>Products</TableCell> */}
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody component={DroppableComponent(onDragEnd)}>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    {vehicle.cars?.map((car, index) => {
                      const imageUrl =
                        vehicle.type !== 'train'
                          ? VEHICLE_IMAGES[vehicle.type]
                          : VEHICLE_IMAGES[car.type];
                      return (
                        <TableCell key={car.id}>
                          <Box
                            sx={{
                              width: 75,
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
                    <TableCell></TableCell>
                  </TableRow>
                  {stops.map((stop, index) => {
                    const station = stations.find((station) => station.id === stop.station) || null;
                    // const direction =
                    //   vehicle.type === 'train'
                    //     ? station?.platforms.find((pl) =>
                    //         stop?.products?.find((p) => p?.platform === pl.id)
                    //       )?.direction
                    //     : station?.direction;
                    // console.log(stop, direction);
                    const factoriesFiltered = factories?.filter((factory) =>
                      station?.factories?.includes(factory.id)
                    );
                    // const productList = station?.platforms
                    //   ?.filter((platform) => platform.products !== undefined)
                    //   .map((platform) => platform?.products?.map((product) => product));
                    // const recipeList = factoriesFiltered.map((factory) => {
                    //   return factory.recipes;
                    // });
                    // const satisfactoryStatistics = getFactoryStatistics(recipeList);

                    return (
                      <TableRow
                        key={stop.id}
                        component={DraggableComponent(stop.id, index)}
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
                            required
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
                        {vehicle.cars?.map((car, index) => {
                          const indexNr = vehicle.type === 'train' ? index + 1 : '';

                          const carFound = stop.products?.find((prod) => prod.car === car.id);

                          const direction =
                            vehicle.type === 'train'
                              ? station?.platforms[index]?.direction
                              : station?.direction;

                          return (
                            <TableCell
                              key={car.id}
                              style={{ verticalAlign: 'top' }}
                            >
                              {carFound && <>Direction: {direction}</>}
                              {carFound?.products.map((pr) => {
                                return (
                                  <Stack
                                    key={pr}
                                    direction="row"
                                    spacing={1}
                                    alignItems={'center'}
                                    sx={{ mt: 1 }}
                                  >
                                    <Avatar
                                      src={`/assets/satisfactory/products/${pr}.jpg`}
                                      sx={{
                                        height: 45,
                                        width: 45,
                                      }}
                                    />
                                    <Box>{products[pr]?.name}</Box>
                                  </Stack>
                                );
                              })}
                            </TableCell>
                          );
                        })}
                        {/* <TableCell>
                          {/* {(station?.direction === 'in' || station?.type === 'train') &&
                          productList?.map((product) => {
                            return <div key={product}>{products[product]?.name}</div>;
                          })} */}
                        {/* {stop.products?.map((pr, index) => {
                            const direction =
                              vehicle.type === 'train'
                                ? station?.platforms.find((pl) => pr.platform === pl.id)?.direction
                                : station?.direction;
                            if (pr.products?.length === 0) return <div key={pr.car}></div>;
                            const indexNr = vehicle.type === 'train' ? index + 1 : '';
                            return (
                              <div key={pr.car}>
                                <div>
                                  Freight car {indexNr} ({direction}):
                                </div>
                                <div>
                                  {pr.products?.map((cp) => (
                                    <div key={`${pr.car}-${cp}`}>- {products[cp]?.name}</div>
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
                          })} */}
                        {/* </TableCell> */}
                        <TableCell align="right">
                          {/* {/* {(station?.direction === 'out' || station?.type === 'train') &&
                          productList?.map((product) => {
                            return <div key={product}>{products[product]?.name}</div>;
                          })} */}
                          <Stack
                            direction="row"
                            spacing={1}
                          >
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
                            {/* </TableCell>

                      <TableCell> */}
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => {
                                deleteStop(stop.id);
                              }}
                            >
                              <GridDeleteIcon>Delete</GridDeleteIcon>
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {stops.length === 0 && <>No items to show</>}
      </CardContent>
    </Card>
  );
};

VehicleStops.propTypes = {
  addStop: PropTypes.func,
  deleteStop: PropTypes.func,
  factories: PropTypes.array,
  products: PropTypes.object,
  recipes: PropTypes.any,
  setStop: PropTypes.func,
  stations: PropTypes.array,
  stops: PropTypes.array,
  vehicle: PropTypes.shape({
    type: PropTypes.string,
  }),
};
