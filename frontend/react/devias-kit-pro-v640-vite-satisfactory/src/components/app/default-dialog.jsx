import { Dialog, DialogContent, DialogTitle } from '@mui/material';

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
