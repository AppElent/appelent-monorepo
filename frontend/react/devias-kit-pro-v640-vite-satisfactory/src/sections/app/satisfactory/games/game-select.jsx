import { Autocomplete, TextField } from '@mui/material';
import { useTranslate } from '@refinedev/core';
import PropTypes from 'prop-types';
import { tokens } from 'src/locales/tokens';

const GameSelect = ({ games, onGameChange, selectedGame }) => {
  const translate = useTranslate();

  return (
    <Autocomplete
      getOptionLabel={(option) => option.name}
      options={games}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={translate(tokens.satisfactory.pages.games.title)}
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
          onGameChange(value.id);
        }
      }}
      // onInputChange={(event, newInputValue) => {
      //   setInputValue(newInputValue);
      // }}
      sx={{ minWidth: 250 }}
      value={selectedGame}
    />
  );
};

GameSelect.propTypes = {
  games: PropTypes.array,
  onGameChange: PropTypes.func,
  selectedGame: PropTypes.object,
};

export default GameSelect;
