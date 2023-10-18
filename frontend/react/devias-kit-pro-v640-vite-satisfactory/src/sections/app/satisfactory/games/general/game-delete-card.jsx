import {
  Button,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useTranslate } from '@refinedev/core';
import PropTypes from 'prop-types';
import { CardDefault } from 'src/components/app/card-default';
import { tokens } from 'src/locales/tokens';

const GameDeleteCard = ({ owner, currentUser, deleteGame }) => {
  const translate = useTranslate();
  return (
    <CardDefault title={translate(tokens.satisfactory.pages.games.general.deleteGame)}>
      <Grid
        xs={12}
        md={8}
      >
        <Stack
          alignItems="flex-start"
          spacing={3}
        >
          <Typography variant="subtitle1">
            {translate(tokens.satisfactory.pages.games.general.deleteGameWarning)}
          </Typography>
          <Button
            color="error"
            disabled={!(owner === currentUser)}
            onClick={deleteGame}
            variant="outlined"
          >
            {translate(tokens.satisfactory.pages.games.general.deleteGame)}
          </Button>
        </Stack>
      </Grid>
    </CardDefault>
  );
};

GameDeleteCard.propTypes = {
  currentUser: PropTypes.any,
  deleteGame: PropTypes.func,
  owner: PropTypes.string,
};

export default GameDeleteCard;
