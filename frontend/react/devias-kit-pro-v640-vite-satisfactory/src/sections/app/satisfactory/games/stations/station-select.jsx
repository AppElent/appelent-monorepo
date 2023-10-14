import PropTypes from 'prop-types';
import {
  Autocomplete,
  Button,
  Stack,
  TextField,
} from '@mui/material';
import { useTranslate } from '@refinedev/core';
import { tokens } from 'src/locales/tokens';

const StationSelect = ({ stations, setStation, selectedStation, createStation }) => {
  const translate = useTranslate();

  return (
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="space-between"
      spacing={3}
    >
      <Autocomplete
        getOptionLabel={(option) => option.name}
        options={stations || []}
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
          if (value) setStation(value.id);
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
  );
};

StationSelect.propTypes = {
  createStation: PropTypes.func,
  selectedStation: PropTypes.any,
  setStation: PropTypes.func,
  stations: PropTypes.array,
};

export default StationSelect;
