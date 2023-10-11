import PropTypes from 'prop-types';
import { Button, Grid, Stack } from '@mui/material';
import PowerStationCard from './power-station-card';

const PowerStationOverview = ({
  powerStations,
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
          onClick={createPowerStation}
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

PowerStationOverview.propTypes = {
  createPowerStation: PropTypes.func,
  deletePowerStation: PropTypes.func,
  powerStations: PropTypes.array.isRequired,
  setPowerStation: PropTypes.func,
};

export default PowerStationOverview;
