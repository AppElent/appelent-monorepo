import { Box, Button, Stack } from '@mui/material';
import { useTranslate } from '@refinedev/core';
import { useConfirm } from 'material-ui-confirm';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import useModal from 'src/custom/hooks/use-modal';
import { useSelected } from 'src/custom/hooks/use-selected';
import { generateName } from 'src/custom/libs/random-name-generator';
import { removeFormikArrayItem, setFormikArrayItem } from 'src/custom/utils/formik-crud-functions';
import { tokens } from 'src/locales/tokens';
import PlatformProductSelectorDialog from 'src/sections/app/satisfactory/games/stations/platform-product-selector-dialog';
import { useQueryParam } from 'use-query-params';

import StationInformationCard from './stations/station-information-card';
import StationSelect from './stations/station-select';
import TrainPlatformsCard from './stations/train-platforms-card';

const TRANSPORT_TEMPLATE = {
  description: '',
  type: 'train',
  recipes: [],
  platforms: [],
  direction: 'in',
  factories: [],
};

const STATION_TYPES = [
  { label: 'Train station', key: 'train' },
  { label: 'Truck station', key: 'truck' },
  { label: 'Drone station', key: 'drone' },
];

const TabTransport = (props) => {
  const { formik, game } = props;
  const translate = useTranslate();
  const confirm = useConfirm();
  //const [factoryId, setFactoryId] = useQueryParam('factory');
  const [stationId, setStationId] = useQueryParam('station');
  const modal = useModal();

  const [selectedStation, selectedStationIndex] = useSelected(
    formik.values.transport?.stations,
    stationId
  );

  const createStation = () => {
    const currentStations = formik.values.transport?.stations
      ? [...formik.values.transport.stations]
      : [];
    const id = nanoid();
    const newFactory = { ...TRANSPORT_TEMPLATE, id, name: generateName() };
    // if (currentFactories) {
    currentStations.push(newFactory);
    formik.setFieldValue('transport.stations', currentStations);
    setStationId(id);
  };

  useEffect(() => {
    const stationExists = game.transport?.stations?.findIndex(
      (station) => station.id === selectedStation?.id
    );
    if (
      stationExists > -1 &&
      selectedStation.type !== 'train' &&
      (!selectedStation.platforms || selectedStation.platforms.length === 0)
    ) {
      formik.setFieldValue(`transport.stations.${stationExists}.platforms.0`, { id: nanoid() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStation]);

  if (!selectedStation) {
    return (
      <React.Fragment>
        <Box
          textAlign="center"
          sx={{ mt: 20 }}
        >
          <Button
            disabled={!game}
            onClick={() => {
              createStation();
            }}
            variant="contained"
          >
            {translate(tokens.satisfactory.pages.games.stations.addFirst)}
          </Button>
        </Box>
      </React.Fragment>
    );
  }

  return (
    <Stack spacing={4}>
      <PlatformProductSelectorDialog
        modal={modal}
        station={selectedStation}
        factories={formik.values.factories}
        setProducts={(platformId, products) => {
          const platformIndex = selectedStation?.platforms?.findIndex((p) => p.id === platformId);
          formik.setFieldValue(
            `transport.stations.${selectedStationIndex}.platforms.${platformIndex}.products`,
            [...products]
          );
        }}
      />
      <StationSelect
        stations={formik.values.transport?.stations || []}
        setStation={setStationId}
        selectedStation={selectedStation}
        createStation={createStation}
      />
      <StationInformationCard
        //formik={formik}
        factories={formik.values?.factories}
        selectedStation={selectedStation}
        setStation={setFormikArrayItem(formik, `transport.stations`)}
        deleteStation={removeFormikArrayItem(formik, `transport.stations`)}
        handleChange={formik.handleChange}
        isSaved={!!game.transport.stations.find((station) => station.id === selectedStation.id)}
        errors={formik.errors?.transport?.stations?.[selectedStationIndex]}
        formikNamespace={`transport.stations.${selectedStationIndex}`}
      />
      {/* <CardDefault title={translate(tokens.satisfactory.pages.games.stations.information)}>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <TextField
            label={translate(tokens.common.fields.name)}
            sx={{ flexGrow: 1 }}
            name={`transport.stations.${selectedStationIndex}.name`}
            onChange={formik.handleChange}
            value={formik.values.transport?.stations[selectedStationIndex].name || ''}
            required
            error={formik.errors?.transport?.stations?.[selectedStationIndex]?.name}
            helperText={formik.errors?.transport?.stations?.[selectedStationIndex]?.name}
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
            name={`transport.stations.${selectedStationIndex}.description`}
            onChange={formik.handleChange}
            value={formik.values.transport?.stations[selectedStationIndex].description || ''}
          />
        </Stack>
        {selectedStation.type !== 'train' && (
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <TextField
              label="Direction"
              sx={{ flexGrow: 1 }}
              select
              name={`transport.stations.${selectedStationIndex}.direction`}
              //onChange={formik.handleChange}
              onChange={(e) => {
                const setFn = () => {
                  //console.log(e);
                  formik.setFieldValue(
                    `transport.stations.${selectedStationIndex}.direction`,
                    e.target.value
                  );
                  formik.setFieldValue(
                    `transport.stations.${selectedStationIndex}.platforms.0.products`,
                    []
                  );
                };
                if (
                  selectedStation.platforms &&
                  selectedStation.platforms[0]?.products?.length > 0
                ) {
                  confirm({
                    description:
                      'If you change the direction of the station or platform, all configured products will be deleted. Also, if there are vehicles stopping at this station, the configured products will be reset.',
                  }).then(() => {
                    setFn();
                  });
                } else {
                  setFn();
                }
              }}
              required
              defaultValue={'in'}
              value={formik.values.transport?.stations[selectedStationIndex].direction || ''}
            >
              <MenuItem
                key="in"
                value="in"
              >
                In
              </MenuItem>
              <MenuItem
                key="out"
                value="out"
              >
                Out
              </MenuItem>
            </TextField>
          </Stack>
        )}
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <TextField
            label="Type"
            disabled={
              !!game.transport.stations.find((station) => station.id === selectedStation.id)
            }
            sx={{ flexGrow: 1 }}
            select
            name={`transport.stations.${selectedStationIndex}.type`}
            onChange={formik.handleChange}
            value={formik.values.transport?.stations[selectedStationIndex].type || ''}
          >
            {STATION_TYPES.map((option) => (
              <MenuItem
                key={option.key}
                value={option.key}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Stack
          alignItems="left"
          direction="row"
          spacing={2}
          alignContent={'flex-start'}
          justifyContent={'space-between'}
        >
          <div>
            <FormLabel component="legend">Connected factories</FormLabel>
            <FormGroup>
              {formik.values.factories?.map((factory) => {
                return (
                  <FormControlLabel
                    key={factory.id}
                    control={
                      <Checkbox
                        checked={
                          formik.values.transport?.stations[
                            selectedStationIndex
                          ]?.factories?.includes(factory.id) || false
                        }
                        onChange={(e) => {
                          let currentFactories =
                            [...formik.values.transport.stations[selectedStationIndex].factories] ||
                            [];
                          if (e.target.checked) {
                            currentFactories.push(factory.id);
                          } else {
                            currentFactories = currentFactories.filter((f) => f !== factory.id);
                          }
                          formik.setFieldValue(
                            `transport.stations.${selectedStationIndex}.factories`,
                            currentFactories
                          );
                        }}
                      />
                    }
                    label={factory.name}
                  />
                );
              })}
            </FormGroup>
          </div>
        </Stack>

        <Stack
          justifyContent="flex-end"
          direction="row"
        >
          <div>
            <Button
              color="error"
              size="small"
              onClick={() => {
                confirm({ description: 'Deleting a transport station cannot be reversed!' }).then(
                  () => {
                    const currentStations = formik.values?.transport?.stations
                      ? [...formik.values.transport.stations]
                      : [];
                    formik.setFieldValue(
                      'transport.stations',
                      currentStations.filter((item) => item.id !== selectedStation.id)
                    );
                  }
                );
              }}
              variant="contained"
            >
              Delete station
            </Button>
          </div>
        </Stack>
      </CardDefault> */}
      <TrainPlatformsCard //TODO: change to formik actions
        addPlatform={(value) => {
          const currentItems = selectedStation?.platforms || [];
          currentItems.push(value);
          formik.setFieldValue(
            `transport.stations.${selectedStationIndex}.platforms`,
            currentItems
          );
        }}
        deletePlatform={(id) => {
          const currentItems = selectedStation?.platforms || [];
          formik.setFieldValue(
            `transport.stations.${selectedStationIndex}.platforms`,
            currentItems.filter((item) => item.id !== id)
          );
        }}
        setPlatform={(id, value) => {
          const currentItemIndex = (selectedStation?.platforms || []).findIndex(
            (platform) => platform.id === id
          );
          if (currentItemIndex > -1) {
            formik.setFieldValue(
              `transport.stations.${selectedStationIndex}.platforms.${currentItemIndex}`,
              value
            );
          }
        }}
        station={selectedStation}
        showProductSelector={() => modal.setModalState(true)}
      />
    </Stack>
  );
};

TabTransport.propTypes = {
  formik: PropTypes.object,
  game: PropTypes.object.isRequired,
};

export default TabTransport;
