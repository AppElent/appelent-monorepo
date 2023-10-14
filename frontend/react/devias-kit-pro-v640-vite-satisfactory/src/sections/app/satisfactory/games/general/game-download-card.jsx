import PropTypes from 'prop-types';
import {
  Button,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { useTranslate } from '@refinedev/core';
import { CardDefault } from 'src/components/app/card-default';
import { tokens } from 'src/locales/tokens';

const GameDownloadCard = ({ handleDownload }) => {
  const translate = useTranslate();

  return (
    <CardDefault title={translate(tokens.satisfactory.pages.games.general.downloadGame)}>
      <Grid
        xs={12}
        md={8}
      >
        <Stack
          alignItems="flex-start"
          spacing={1}
        >
          <Typography variant="subtitle1">
            {translate(tokens.satisfactory.pages.games.general.downloadGameHelperText)}
          </Typography>
          <Stack
            direction="row"
            spacing={3}
          >
            <Button
              //color="info"
              onClick={handleDownload}
              variant="contained"
            >
              {translate(tokens.satisfactory.pages.games.general.downloadGame)}
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </CardDefault>
  );
};

GameDownloadCard.propTypes = {
  handleDownload: PropTypes.func,
};

export default GameDownloadCard;
