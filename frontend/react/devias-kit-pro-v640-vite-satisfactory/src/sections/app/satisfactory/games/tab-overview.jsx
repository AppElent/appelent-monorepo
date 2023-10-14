import PropTypes from 'prop-types';
import { Stack } from '@mui/material';

import { CardDefault } from 'src/components/app/card-default';

const TabOverview = (props) => {
  const { game } = props;

  return (
    <Stack spacing={4}>
      <CardDefault title="Factories">
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          {game.factories.map((factory) => (
            <div key={factory.id}>Factory: {factory.name}</div>
          ))}
        </Stack>
      </CardDefault>
      <CardDefault title="Transport stations">
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          {game.transport?.stations.map((factory) => (
            <div key={factory.id}>
              Station: {factory.name}
              <br />
            </div>
          ))}
        </Stack>
      </CardDefault>
    </Stack>
  );
};

TabOverview.propTypes = {
  game: PropTypes.object.isRequired,
};

export default TabOverview;
