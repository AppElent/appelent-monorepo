import React from 'react';
import PropTypes from 'prop-types';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { CardDefault } from 'src/components/app/card-default';
import { createGuid } from 'src/custom/libs/create-guid';
import { useQueryParam } from 'use-query-params';
import { generateName } from 'src/custom/libs/random-name-generator';
import { tokens } from 'src/locales/tokens';
import { useSelected } from 'src/custom/hooks/use-selected';
import { TrainConfig } from './train_config';
import { VehicleStops } from './stops';
import { getSatisfactoryData, getSatisfactoryDataArray } from 'src/custom/libs/satisfactory';
import { nanoid } from 'nanoid';
import useModal from 'src/custom/hooks/use-modal';
import { useConfirm } from 'material-ui-confirm';

const VEHICLE_TEMPLATE = {
  name: '',
  description: '',
  type: 'tractor',
};

const VEHICLE_TYPES = [
  { label: 'Train', key: 'train' },
  { label: 'Truck', key: 'truck' },
  { label: 'Tractor', key: 'tractor' },
  { label: 'Drone', key: 'drone' },
];

export const SatisfactoryGamesVehicles = (props) => {
  const { formik, game, translate } = props;
  //const [factoryId, setFactoryId] = useQueryParam('factory');
  const [vehicleId, setVehicleId] = useQueryParam('vehicle');
  const modal = useModal();
  const confirm = useConfirm();

  const products = getSatisfactoryData('items');
  const recipes = getSatisfactoryDataArray('recipes');
  //   const [addStation, setStation, removeStation] = useFormikCrud(formik, 'transport.stations');

  const [selectedVehicle, selectedVehicleIndex] = useSelected(
    formik.values.transport?.vehicles,
    vehicleId
  );

  console.log(999, selectedVehicle);

  const IMAGES = {
    locomotive: '/assets/satisfactory/Electric_Locomotive.webp',
    freight: '/assets/satisfactory/Freight_Car.webp',
  };

  //TODO: implement feature to add cars when changed
  // useEffect(() => {
  //   if (
  //     selectedVehicle &&
  //     selectedVehicleIndex &&
  //     selectedVehicleIndex > -1 &&
  //     selectedVehicle?.type !== 'train'
  //   ) {
  //     formik.setFieldValue(`transport.vehicles.${selectedVehicleIndex}.cars`, [{ id: nanoid() }]);
  //   }
  // }, [selectedVehicle?.type]);

  const createVehicle = () => {
    const currentVehicles = formik.values.transport?.vehicles
      ? [...formik.values.transport.vehicles]
      : [];
    const id = createGuid(false);
    const name = generateName();
    const newVehicle = { ...VEHICLE_TEMPLATE, id, name, cars: [{ id: nanoid() }] };
    // if (currentFactories) {
    currentVehicles.push(newVehicle);
    formik.setFieldValue('transport.vehicles', currentVehicles);
    setVehicleId(id);
  };

  if (!selectedVehicle) {
    return (
      <React.Fragment>
        <Box
          textAlign="center"
          sx={{ mt: 20 }}
        >
          <Button
            disabled={!game}
            onClick={() => {
              createVehicle();
            }}
            variant="contained"
          >
            Create first vehicle
          </Button>
        </Box>
      </React.Fragment>
    );
  }

  return (
    <Stack spacing={4}>
      <Dialog
        onClose={() => {
          modal.setModalState(false);
        }}
        open={modal.modalOpen}
        fullWidth
        //fullScreen={!matches}
        maxWidth="md"
      >
        {/* <DialogTitle>Train configuration</DialogTitle> */}
        <DialogContent>
          <TrainConfig
            cars={selectedVehicle?.cars || []}
            addCar={(value) => {
              const currentItems = selectedVehicle?.cars || [];
              formik.setFieldValue(`transport.vehicles.${selectedVehicleIndex}.cars`, [
                ...currentItems,
                value,
              ]);
            }}
            deleteCar={(id) => {
              const currentItems = selectedVehicle?.cars || [];
              formik.setFieldValue(
                `transport.vehicles.${selectedVehicleIndex}.cars`,
                currentItems.filter((item) => item.id !== id)
              );
            }}
            setCar={(id, value) => {
              const currentItemIndex = (selectedVehicle?.cars || []).findIndex(
                (platform) => platform.id === id
              );
              if (currentItemIndex > -1) {
                formik.setFieldValue(
                  `transport.vehicles.${selectedVehicleIndex}.cars.${currentItemIndex}`,
                  value
                );
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => modal.setModalState(false)}
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
      >
        <Autocomplete
          getOptionLabel={(option) => option.name}
          options={formik.values.transport?.vehicles || []}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Vehicle name"
              name="transport.vehicles"
            />
          )}
          renderOption={(props, option) => {
            return (
              <li
                {...props}
                key={option.id}
              >
                {option.name}
              </li>
            );
          }}
          onChange={(e, value) => {
            setVehicleId(value.id);
          }}
          sx={{ width: 300 }}
          value={selectedVehicle}
        />
        <Button
          //color="inherit"
          size="small"
          onClick={() => {
            createVehicle();
          }}
          variant="contained"
        >
          Create vehicle
        </Button>
      </Stack>
      <CardDefault title="Information">
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <TextField
            label={translate(tokens.common.fields.name)}
            sx={{ flexGrow: 1 }}
            name={`transport.vehicles.${selectedVehicleIndex}.name`}
            onChange={formik.handleChange}
            required
            error={formik.errors?.transport?.vehicles?.[selectedVehicleIndex]?.name}
            helperText={formik.errors?.transport?.vehicles?.[selectedVehicleIndex]?.name}
            value={formik.values.transport?.vehicles[selectedVehicleIndex].name || ''}
          />
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <TextField
            label={translate(tokens.common.fields.description)}
            sx={{ flexGrow: 1 }}
            multiline
            minRows={3}
            name={`transport.vehicles.${selectedVehicleIndex}.description`}
            onChange={formik.handleChange}
            value={formik.values.transport?.vehicles[selectedVehicleIndex].description || ''}
          />
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <TextField
            label="Type"
            sx={{ flexGrow: 1 }}
            select
            disabled={
              !!game.transport?.vehicles.find((vehicle) => vehicle.id === selectedVehicle.id)
            }
            name={`transport.vehicles.${selectedVehicleIndex}.type`}
            onChange={formik.handleChange}
            // onChange={(e) => {
            //   let car = { id: nanoid(), type: e.target.valaue };
            //   console.log(selectedVehicle);

            //   if (e.target.value === 'train') {
            //     console.log('train');
            //   } else {
            //     console.log('not train');
            //   }
            // }}
            value={formik.values.transport?.vehicles[selectedVehicleIndex].type || ''}
          >
            {VEHICLE_TYPES.map((option) => (
              <MenuItem
                key={option.key}
                value={option.key}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        {selectedVehicle.type === 'train' && (
          <>
            <Stack
              alignItems="center"
              direction="row"
              spacing={1}
              justifyContent={'space-between'}
            >
              <Typography>Vehicle configuration:</Typography>
              <Button onClick={() => modal.setModalState(true)}>Change configuration</Button>
            </Stack>
            <Stack direction="row">
              {selectedVehicle?.cars?.map((car) => (
                <Box
                  sx={{
                    width: 100,
                    '& img': {
                      width: '100%',
                    },
                  }}
                  key={car.id}
                >
                  <img src={IMAGES[car.type]} />
                </Box>
              ))}
            </Stack>
          </>
        )}
        <Stack
          justifyContent="flex-end"
          direction="row"
        >
          <div>
            <Button
              color="error"
              size="small"
              onClick={() => {
                confirm().then(() => {
                  const currentStations = formik.values?.transport?.vehicles
                    ? [...formik.values.transport.vehicles]
                    : [];
                  formik.setFieldValue(
                    'transport.vehicles',
                    currentStations.filter((item) => item.id !== selectedVehicle.id)
                  );
                });
              }}
              variant="contained"
            >
              Delete
            </Button>
          </div>
        </Stack>
      </CardDefault>
      {/* {selectedVehicle.type === 'train' && (
        <TrainConfig
          cars={selectedVehicle?.cars || []}
          addCar={(value) => {
            const currentItems = selectedVehicle?.cars || [];
            currentItems.push(value);
            formik.setFieldValue(`transport.vehicles.${selectedVehicleIndex}.cars`, currentItems);
          }}
          deleteCar={(id) => {
            const currentItems = selectedVehicle?.cars || [];
            formik.setFieldValue(
              `transport.vehicles.${selectedVehicleIndex}.cars`,
              currentItems.filter((item) => item.id !== id)
            );
          }}
          setCar={(id, value) => {
            const currentItemIndex = (selectedVehicle?.cars || []).findIndex(
              (platform) => platform.id === id
            );
            if (currentItemIndex > -1) {
              formik.setFieldValue(
                `transport.vehicles.${selectedVehicleIndex}.cars.${currentItemIndex}`,
                value
              );
            }
          }}
        />
      )} */}
      <VehicleStops
        stops={selectedVehicle?.stops || []}
        vehicle={selectedVehicle}
        products={products}
        recipes={recipes}
        factories={formik.values.factories || []}
        stations={formik.values.transport?.stations || []}
        addStop={(value) => {
          const currentItems = selectedVehicle?.stops || [];
          currentItems.push(value);
          formik.setFieldValue(`transport.vehicles.${selectedVehicleIndex}.stops`, currentItems);
        }}
        deleteStop={(id) => {
          const currentItems = selectedVehicle?.stops || [];
          formik.setFieldValue(
            `transport.vehicles.${selectedVehicleIndex}.stops`,
            currentItems.filter((item) => item.id !== id)
          );
        }}
        setStop={(id, value) => {
          const currentItemIndex = (selectedVehicle?.stops || []).findIndex(
            (platform) => platform.id === id
          );
          if (currentItemIndex > -1) {
            formik.setFieldValue(
              `transport.vehicles.${selectedVehicleIndex}.stops.${currentItemIndex}`,
              value
            );
          }
        }}
      />
    </Stack>
  );
};

SatisfactoryGamesVehicles.propTypes = {
  formik: PropTypes.object,
  game: PropTypes.object.isRequired,
  translate: PropTypes.func,
};
