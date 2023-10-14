import PropTypes from 'prop-types';
import { MenuItem, Stack, TextField } from '@mui/material';
import { useTranslate } from '@refinedev/core';
import { CardDefault } from 'src/components/app/card-default';
import { tokens } from 'src/locales/tokens';
import { satisfactoryVersions } from 'src/custom/libs/satisfactory';

const GameInformationCard = ({ errors, handleChange, game }) => {
  const translate = useTranslate();

  return (
    <CardDefault title={translate(tokens.satisfactory.pages.games.general.generalinfo)}>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <TextField
          label={translate(tokens.common.fields.name)}
          sx={{ flexGrow: 1 }}
          name="name"
          required
          error={errors.name}
          helperText={errors.name}
          onChange={handleChange}
          value={game.name || ''}
        />
      </Stack>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <TextField
          label={translate(tokens.common.fields.description)}
          sx={{ flexGrow: 1 }}
          name="description"
          multiline
          minRows={3}
          onChange={handleChange}
          value={game.description || ''}
        />
      </Stack>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <TextField
          value={game?.version || ''}
          name="version"
          label={translate(tokens.satisfactory.pages.games.version)}
          select
          error
          helperText="Changing the version might break your save!"
          onChange={handleChange}
        >
          {satisfactoryVersions.map((version) => {
            return (
              <MenuItem
                key={version.key}
                value={version.key}
              >
                {version.label}
              </MenuItem>
            );
          })}
        </TextField>
      </Stack>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        Number of factories: {game?.factories?.length || 0}
      </Stack>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        Number of Transport stations: {game?.transport?.stations?.length || 0}
      </Stack>
    </CardDefault>
  );
};

GameInformationCard.propTypes = {
  errors: PropTypes.object,
  game: PropTypes.shape({
    description: PropTypes.string,
    factories: PropTypes.array,
    name: PropTypes.string,
    transport: PropTypes.shape({
      stations: PropTypes.array,
    }),
    version: PropTypes.string,
  }),
  handleChange: PropTypes.func,
  satisfactoryVersions: PropTypes.array,
};

export default GameInformationCard;
