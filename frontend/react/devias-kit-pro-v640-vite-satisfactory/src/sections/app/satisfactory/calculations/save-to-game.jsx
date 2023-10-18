import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useData } from 'src/custom/libs/data-framework';
import { logger } from 'src/custom/libs/logging';

export const SaveToGame = ({ saveToGame, modalOpen, setModalState }) => {
  const gamesData = useData('satisfactory_games');

  return (
    <Dialog
      open={modalOpen}
      maxWidth="md"
      fullWidth
      onClose={() => setModalState(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogTitle>Save preferred product list</DialogTitle>
      <DialogContentText sx={{ p: 3 }}>Save preferred product list to game</DialogContentText>
      <Autocomplete
        getOptionLabel={(option) => option.name}
        options={gamesData}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            label="Games"
            name="game"
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
        // isOptionEqualToValue={(option, value) =>
        //   option.name === value.name
        // }
        onChange={(e, value) => {
          if (value) {
            logger.log(value);
          }
        }}
        // onInputChange={(event, newInputValue) => {
        //   setInputValue(newInputValue);
        // }}
        sx={{ width: 300 }}
        value={null}
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
          onClick={() => {}}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

SaveToGame.propTypes = {
  modalOpen: PropTypes.bool,
  saveToGame: PropTypes.func,
  setModalState: PropTypes.func,
};
