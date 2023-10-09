import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

export const GameEditJsonDialog = ({ formik, modalOpen, setModalState }) => {
  const [jsonData, setJsonData] = useState();

  useEffect(() => {
    const { id, meta, owner, playerIds, players, ...data } = formik.values;
    setJsonData(data);
  }, [formik.values]);

  const saveData = () => {
    const saveData = { ...formik.values, jsonData };
    console.log(saveData);
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
            console.log(objData);
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
