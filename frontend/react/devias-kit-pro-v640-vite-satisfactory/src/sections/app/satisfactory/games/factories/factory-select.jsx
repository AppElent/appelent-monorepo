import { Autocomplete, TextField } from '@mui/material';
import { useTranslate } from '@refinedev/core';
import PropTypes from 'prop-types';
import { tokens } from 'src/locales/tokens';

const FactorySelect = ({ factories, selectedFactory, setFactoryId }) => {
  const translate = useTranslate();

  return (
    <Autocomplete
      getOptionLabel={(option) => option.name}
      options={factories || []}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={translate(tokens.satisfactory.pages.games.tabs.factories)}
          name="factories"
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
        setFactoryId(value.id);
      }}
      // onInputChange={(event, newInputValue) => {
      //   setInputValue(newInputValue);
      // }}
      sx={{ width: 300 }}
      value={selectedFactory}
    />
  );
};

FactorySelect.propTypes = {
  factories: PropTypes.array,
  selectedFactory: PropTypes.object,
  setFactoryId: PropTypes.func,
};

export default FactorySelect;
