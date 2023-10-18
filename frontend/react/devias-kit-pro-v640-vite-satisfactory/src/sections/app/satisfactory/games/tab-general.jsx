import PropTypes from 'prop-types';
import { Stack } from '@mui/material';
import { FormikProvider } from 'formik';

import { satisfactoryVersions } from 'src/custom/libs/satisfactory';
import { getAuth } from 'firebase/auth';
import useModal from 'src/custom/hooks/use-modal';
import { GameEditJsonDialog } from './general/game-edit-json-dialog';
import GameInformationCard from './general/game-information-card';
import GameDeleteCard from './general/game-delete-card';
import GameDownloadCard from './general/game-download-card';
import GamePlayersCard from './general/game-players.card';

const TabGeneral = (props) => {
  const { game, formik, handleDeleteGame } = props;
  // const [secondary, setSecondary] = useState(false);
  const { modalOpen, setData, setModalState } = useModal(false, formik.values);

  const handleDownloadGame = () => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { meta, ...rest } = formik.values;
    setData(rest);
    setModalState(true);
  };

  return (
    <FormikProvider value={formik}>
      <GameEditJsonDialog
        formik={formik}
        modalOpen={modalOpen}
        setModalState={setModalState}
      />
      <Stack spacing={4}>
        <GameInformationCard
          errors={formik.errors}
          game={formik.values}
          handleChange={formik.handleChange}
        />
        <GamePlayersCard
          players={formik.values.players || []}
          owner={game.owner}
          handleChange={formik.handleChange}
          isOwner={game.owner === getAuth().currentUser.uid}
        />
        <GameDownloadCard downloadGame={handleDownloadGame} />
        <GameDeleteCard
          owner={game.owner}
          currentUser={getAuth().currentUser.uid}
          deleteGame={handleDeleteGame}
        />
      </Stack>
    </FormikProvider>
  );
};

TabGeneral.propTypes = {
  formik: PropTypes.shape({
    errors: PropTypes.any,
    handleChange: PropTypes.any,
    values: PropTypes.shape({
      description: PropTypes.string,
      factories: PropTypes.array,
      meta: PropTypes.any,
      name: PropTypes.string,
      players: PropTypes.array,
      transport: PropTypes.shape({
        stations: PropTypes.array,
      }),
      version: PropTypes.string,
    }),
  }),
  game: PropTypes.object.isRequired,
  handleDeleteGame: PropTypes.any,
};

export default TabGeneral;
