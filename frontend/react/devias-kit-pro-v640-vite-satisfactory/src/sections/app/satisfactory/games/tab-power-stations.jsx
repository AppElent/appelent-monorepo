import PropTypes from 'prop-types';
import { Button, Grid, Stack } from '@mui/material';
import PowerStationCard from './power/power-station-card';
import { nanoid } from 'nanoid';
import { generateName } from 'src/custom/libs/random-name-generator';

const TabPowerStations = ({
  powerStations,
  formikNamespace,
  createPowerStation,
  deletePowerStation,
  setPowerStation,
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
      >
        {powerStations.map((station) => (
          <Grid
            key={station.id}
            item
            xs={12}
            md={6}
          >
            <PowerStationCard station={station} />
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
