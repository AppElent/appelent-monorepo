import { Button, Grid, Stack } from '@mui/material';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { generateName } from 'src/custom/libs/random-name-generator';

import PowerStationCard from './power/power-station-card';
import { removeFormikArrayItem, setFormikArrayItem } from 'src/custom/utils/formik-crud-functions';

const TabPowerStations = ({
  powerStations,
  formikNamespace,
  createPowerStation,
  deletePowerStation,
  setPowerStation,
  formik,
}) => {
  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="flex-end"
        spacing={3}
      >
        <Button
          //color="inherit"
          size="small"
          onClick={() => createPowerStation({ id: nanoid(), name: generateName() })}
          variant="contained"
        >
          Create power station
        </Button>
      </Stack>
      <Grid
        container
        spacing={3}
        sx={{ pr: 3 }}
      >
        {powerStations.map((station) => (
          <Grid
            key={station.id}
            item
            xs={12}
            md={4}
          >
            <PowerStationCard
              station={station}
              setPowerStation={setFormikArrayItem(formik, `power.stations`)}
              deletePowerStation={removeFormikArrayItem(formik, 'power.stations')}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

TabPowerStations.propTypes = {
  createPowerStation: PropTypes.func,
  deletePowerStation: PropTypes.func,
  formikNamespace: PropTypes.string,
  powerStations: PropTypes.array.isRequired,
  setPowerStation: PropTypes.func,
};

export default TabPowerStations;
