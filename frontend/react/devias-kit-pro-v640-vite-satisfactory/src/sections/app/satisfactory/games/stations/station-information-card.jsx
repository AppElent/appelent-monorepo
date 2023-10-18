import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { useTranslate } from '@refinedev/core';
import _ from 'lodash';
import { useConfirm } from 'material-ui-confirm';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { CardDefault } from 'src/components/app/card-default';
import { STATION_TYPES } from 'src/custom/libs/satisfactory/static';
import { tokens } from 'src/locales/tokens';

const StationInformationCard = ({
  factories,
  selectedStation,
  isSaved,
  handleChange,
  errors,
  formikNamespace,
  deleteStation,
  setStation,
}) => {
  const translate = useTranslate();
  const confirm = useConfirm();

  return (
    <CardDefault title={translate(tokens.satisfactory.pages.games.stations.information)}>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <TextField
          label={translate(tokens.common.fields.name)}
          sx={{ flexGrow: 1 }}
          name={`${formikNamespace}.name`}
          onChange={handleChange}
          value={selectedStation.name || ''}
          required
          error={errors?.name}
          helperText={errors?.name}
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
          name={`${formikNamespace}.description`}
          onChange={handleChange}
          value={selectedStation.description || ''}
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
            name={`${formikNamespace}.direction`}
            //onChange={formik.handleChange}
            onChange={(e) => {
              const setFn = () => {
                const newStation = { ...selectedStation, direction: e.target.value };
                _.set(newStation, 'platforms.0.products', []);
                setStation(selectedStation.id, newStation);
              };
              if (selectedStation.platforms && selectedStation.platforms[0]?.products?.length > 0) {
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
            value={selectedStation.direction || ''}
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
          disabled={isSaved}
          sx={{ flexGrow: 1 }}
          select
          name={`${formikNamespace}.type`}
          //onChange={handleChange}
          onChange={(e) => {
            let platform = { id: nanoid(), products: [] };

            if (e.target.value === 'train') {
              setStation(selectedStation.id, {
                ...selectedStation,
                type: e.target.value,
                platforms: [],
              });
              // formik.setFieldValue(`transport.stations.${selectedVehicleIndex}`, {
              //   ...selectedVehicle,
              //   type: e.target.value,
              //   cars: [],
              // });
            } else {
              setStation(selectedStation.id, {
                ...selectedStation,
                type: e.target.value,
                platforms: [platform],
              });
            }
          }}
          value={selectedStation.type || ''}
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
            {factories?.map((factory) => {
              return (
                <FormControlLabel
                  key={factory.id}
                  control={
                    <Checkbox
                      checked={selectedStation?.factories?.includes(factory.id) || false}
                      onChange={(e) => {
                        let currentFactories = [...selectedStation.factories] || [];
                        if (e.target.checked) {
                          currentFactories.push(factory.id);
                        } else {
                          currentFactories = currentFactories.filter((f) => f !== factory.id);
                        }
                        setStation(selectedStation.id, {
                          ...selectedStation,
                          factories: currentFactories,
                        });
                        // formik.setFieldValue(
                        //   `transport.stations.${selectedStationIndex}.factories`,
                        //   currentFactories
                        // );
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
                  //   const currentStations = formik.values?.transport?.stations
                  //     ? [...formik.values.transport.stations]
                  //     : [];
                  //   formik.setFieldValue(
                  //     'transport.stations',
                  //     currentStations.filter((item) => item.id !== selectedStation.id)
                  //   );
                  deleteStation(selectedStation.id);
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
  );
};

StationInformationCard.propTypes = {
  deleteStation: PropTypes.func,
  errors: PropTypes.object,
  factories: PropTypes.array,
  formikNamespace: PropTypes.any,
  handleChange: PropTypes.any,
  isSaved: PropTypes.bool,
  selectedStation: PropTypes.object,
  setStation: PropTypes.any,
};

export default StationInformationCard;
