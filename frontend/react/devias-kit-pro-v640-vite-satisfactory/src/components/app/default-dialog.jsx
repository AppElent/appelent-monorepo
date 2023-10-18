import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import PropTypes from 'prop-types';

const DefaultDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      //fullScreen={!matches}
      maxWidth="md"
    >
      <DialogTitle>Factory planner input</DialogTitle>
      <DialogContent></DialogContent>
    </Dialog>
  );
};

DefaultDialog.propTypes = {
  handleClose: PropTypes.func,
  open: PropTypes.bool,
};

export default DefaultDialog;
