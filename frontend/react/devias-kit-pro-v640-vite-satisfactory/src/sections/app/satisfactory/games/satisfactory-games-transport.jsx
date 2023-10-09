import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Modal,
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
import { SatisfactoryGamesTransportTrainPlatforms } from './satisfactory-games-transport-trainplatforms';
import { nanoid } from 'nanoid';
import useModal from 'src/custom/hooks/use-modal';
import PlatformProductSelectorDialog from 'src/components/app/satisfactory/transport/platform-product-selector-dialog';
import { useConfirm } from 'material-ui-confirm';

const TRANSPORT_TEMPLATE = {
  description: '',
  type: 'truck',
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

export const SatisfactoryGamesTransport = (props) => {
  const { formik, game, translate } = props;
  const confirm = useConfirm();
  //const [factoryId, setFactoryId] = useQueryParam('factory');
  const [stationId, setStationId] = useQueryParam('station');
  const modal = useModal();
  //   const [addStation, setStation, removeStation] = useFormikCrud(formik, 'transport.stations');

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
          console.log(platformId, products, selectedStation.platforms);
          const platformIndex = selectedStation?.platforms?.findIndex((p) => p.id === platformId);
          console.log(platformIndex);
          formik.setFieldValue(
            `transport.stations.${selectedStationIndex}.platforms.${platformIndex}.products`,
            [...products]
          );
        }}
      />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={3}
      >
        <Autocomplete
          getOptionLabel={(option) => option.name}
          options={formik.values.transport?.stations || []}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={translate(tokens.satisfactory.pages.games.stations.name)}
              name="transport.stations"
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
            if (value) setStationId(value.id);
          }}
          sx={{ width: 300 }}
          value={selectedStation}
        />
        <Button
          //color="inherit"
          size="small"
          onClick={() => {
            createStation();
          }}
          variant="contained"
        >
          {translate(tokens.satisfactory.pages.games.stations.add)}
        </Button>
      </Stack>
      <CardDefault title={translate(tokens.satisfactory.pages.games.stations.information)}>
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
      </CardDefault>
      <SatisfactoryGamesTransportTrainPlatforms
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

SatisfactoryGamesTransport.propTypes = {
  formik: PropTypes.object,
  game: PropTypes.object.isRequired,
  translate: PropTypes.func,
};
