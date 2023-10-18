import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export const GameEditJsonDialog = ({ formik, modalOpen, setModalState }) => {
  const [jsonData, setJsonData] = useState();

  useEffect(() => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { id, meta, owner, playerIds, players, ...data } = formik.values;
    setJsonData(data);
  }, [formik.values]);

  const saveData = () => {
    const saveData = { ...formik.values, jsonData };
  };

  return (
    <Dialog
      open={modalOpen}
      maxWidth="md"
      fullWidth
      onClose={() => setModalState(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle>Upload/download game</DialogTitle>
      <DialogContentText sx={{ p: 3 }}>Change values at own risk!</DialogContentText>
      <TextField
        multiline
        sx={{ minWidth: 500, pl: 3, pr: 3 }}
        onChange={(e) => {
          try {
            const objData = JSON.parse(e.target.value);
            setJsonData(objData);
          } catch {
            alert('Invalid JSON');
          }
        }}
        value={JSON.stringify(jsonData, null, 2)}
      />

      <DialogActions>
        <Button
          onClick={() => {
            setModalState(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            saveData();
            setModalState(false);
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

GameEditJsonDialog.propTypes = {
  formik: PropTypes.any,
  modalOpen: PropTypes.bool,
  setModalState: PropTypes.func,
};
