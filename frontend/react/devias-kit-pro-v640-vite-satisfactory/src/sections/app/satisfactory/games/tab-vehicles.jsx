import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Stack } from '@mui/material';
import { useQueryParam } from 'use-query-params';
import { generateName } from 'src/custom/libs/random-name-generator';
import { useSelected } from 'src/custom/hooks/use-selected';
import { VehicleStops } from './vehicles/vehicle-stops';
import { getSatisfactoryData, getSatisfactoryDataArray } from 'src/custom/libs/satisfactory';
import { nanoid } from 'nanoid';
import useModal from 'src/custom/hooks/use-modal';
import { useConfirm } from 'material-ui-confirm';
import { useTranslate } from '@refinedev/core';
import VehicleConfigurationDialog from './vehicles/vehicle-configuration-dialog';
import {
  addFormikArrayItem,
  removeFormikArrayItem,
  setFormikArrayItem,
} from 'src/custom/utils/formik-crud-functions';
import VehicleSelect from './vehicles/vehicle-select';
import VehicleInformationCard from './vehicles/vehicle-information-card';

/**
 * Vehicle type
 * @typedef VehicleType
 * @property {string} id id of vehicle
 * @property {string} name name of vehicle
 * @property {string} description description of vehicle
 * @property {string} type vehicle type
 * @property {Array} cars cars
 * @property {Array} stops all stops
 */
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

export const TabVehicles = (props) => {
  const { formik, game } = props;
  const translate = useTranslate();
  //const [factoryId, setFactoryId] = useQueryParam('factory');
  const [vehicleId, setVehicleId] = useQueryParam('vehicle');
  const modal = useModal();
  const confirm = useConfirm();

  const products = getSatisfactoryData('items');
  const recipes = getSatisfactoryDataArray('recipes');

  const [selectedVehicle, selectedVehicleIndex] = useSelected(
    formik.values.transport?.vehicles,
    vehicleId
  );

  useEffect(() => {
    if (selectedVehicle?.type && selectedVehicle.type !== 'train') {
      //dsfds
    }
  }, [selectedVehicle?.type]);

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
    const id = nanoid();
    const name = generateName();
    /** @type {VehicleType} */
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
      {/* <Dialog
        onClose={() => {
          modal.setModalState(false);
        }}
        open={modal.modalOpen}
        fullWidth
        //fullScreen={!matches}
        maxWidth="md"
      >
        {/* <DialogTitle>Train configuration</DialogTitle> */}
      {/* <DialogContent>
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
        </DialogActions> */}
      {/* </Dialog> */}
      <VehicleConfigurationDialog
        vehicle={selectedVehicle}
        modalOpen={modal.modalOpen}
        setModalOpen={modal.setModalState}
        addCar={addFormikArrayItem(formik, `transport.vehicles.${selectedVehicleIndex}.cars`)}
        deleteCar={removeFormikArrayItem(formik, `transport.vehicles.${selectedVehicleIndex}.cars`)}
        setCar={setFormikArrayItem(formik, `transport.vehicles.${selectedVehicleIndex}.cars`)}
      />
      <VehicleSelect
        vehicles={formik.values.transport?.vehicles || []}
        setVehicleId={setVehicleId}
        vehicle={selectedVehicle}
        createVehicle={createVehicle}
      />
      {/* <Stack
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
      </Stack> */}
      {/* <CardDefault title="Information">
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
            // onChange={formik.handleChange}
            onChange={(e) => {
              let car = { id: nanoid(), type: e.target.value };

              if (e.target.value === 'train') {
                formik.setFieldValue(`transport.vehicles.${selectedVehicleIndex}`, {
                  ...selectedVehicle,
                  type: e.target.value,
                  cars: [],
                });
              } else {
                formik.setFieldValue(`transport.vehicles.${selectedVehicleIndex}`, {
                  ...selectedVehicle,
                  type: e.target.value,
                  cars: [car],
                });
              }
            }}
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
            <Stack
              direction="row"
              spacing={1}
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                />
              }
            >
              {selectedVehicle?.cars?.map((car) => {
                if (car.type !== 'locomotive') freightCarNumber++;
                return (
                  <Box
                    sx={{
                      width: 100,
                      '& img': {
                        width: '100%',
                      },
                    }}
                    key={car.id}
                  >
                    <Box textAlign={'center'}>
                      <img src={IMAGES[car.type]} />
                      {car.type !== 'locomotive' && <Box>Freight car {freightCarNumber}</Box>}
                    </Box>
                  </Box>
                );
              })}
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
      </CardDefault> */}
      <VehicleInformationCard
        vehicle={selectedVehicle}
        setVehicle={setFormikArrayItem(formik, `transport.vehicles`)}
        handleChange={formik.handleChange}
        errors={formik.errors?.transport?.vehicles?.[selectedVehicleIndex] || {}}
        formikNamespace={`transport.vehicles.${selectedVehicleIndex}`}
        setModalOpen={modal.setModalState}
        deleteVehicle={removeFormikArrayItem(formik, `transport.vehicles`)}
        isSaved={!!game.transport?.vehicles.find((vehicle) => vehicle.id === selectedVehicle.id)}
      />
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
        addStop={addFormikArrayItem(formik, `transport.vehicles.${selectedVehicleIndex}.stops`)}
        deleteStop={removeFormikArrayItem(
          formik,
          `transport.vehicles.${selectedVehicleIndex}.stops`
        )}
        setStop={setFormikArrayItem(formik, `transport.vehicles.${selectedVehicleIndex}.stops`)}
        setStops={(stops) =>
          formik.setFieldValue(`transport.vehicles.${selectedVehicleIndex}.stops`, stops)
        }
      />
    </Stack>
  );
};

TabVehicles.propTypes = {
  formik: PropTypes.object,
  game: PropTypes.object.isRequired,
};

export default TabVehicles;
