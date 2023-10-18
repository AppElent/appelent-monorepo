import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@mui/material';
import PropTypes from 'prop-types';

import { TrainConfig } from './train-config';

const VehicleConfigurationDialog = ({
  modalOpen,
  setModalOpen,
  vehicle,
  addCar,
  deleteCar,
  setCar,
}) => {
  return (
    <Dialog
      onClose={() => {
        setModalOpen(false);
      }}
      open={modalOpen}
      fullWidth
      //fullScreen={!matches}
      maxWidth="md"
    >
      {/* <DialogTitle>Train configuration</DialogTitle> */}
      <DialogContent>
        <TrainConfig
          cars={vehicle?.cars || []}
          addCar={addCar}
          deleteCar={deleteCar}
          setCar={setCar}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setModalOpen(false)}
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

VehicleConfigurationDialog.propTypes = {
  addCar: PropTypes.func,
  deleteCar: PropTypes.func,
  modalOpen: PropTypes.bool,
  setCar: PropTypes.func,
  setModalOpen: PropTypes.func,
  vehicle: PropTypes.object,
};

export default VehicleConfigurationDialog;
