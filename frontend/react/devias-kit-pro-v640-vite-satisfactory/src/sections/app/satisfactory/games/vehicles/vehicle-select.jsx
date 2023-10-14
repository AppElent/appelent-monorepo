import PropTypes from 'prop-types';
import {
  Autocomplete,
  Button,
  Stack,
  TextField,
} from '@mui/material';

const VehicleSelect = ({ vehicles, setVehicleId, vehicle, createVehicle }) => {
  return (
    <Stack
      alignItems="center"
      direction="row"
      justifyContent="space-between"
      spacing={3}
    >
      <Autocomplete
        getOptionLabel={(option) => option.name}
        options={vehicles || []}
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
        value={vehicle}
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
  );
};

VehicleSelect.propTypes = {
  createVehicle: PropTypes.func,
  setVehicleId: PropTypes.func,
  vehicle: PropTypes.object,
  vehicles: PropTypes.array,
};

export default VehicleSelect;
