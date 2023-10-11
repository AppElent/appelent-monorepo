import { useEffect } from 'react';
import PropTypes from 'prop-types';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from '@mui/material';
import { FormikProvider, FieldArray } from 'formik';

import { CardDefault } from 'src/components/app/card-default';
import { satisfactoryVersions } from 'src/custom/libs/satisfactory';
import { getAuth } from 'firebase/auth';
import { tokens } from 'src/locales/tokens';
import { createGuid } from 'src/custom/libs/create-guid';
import useModal from 'src/custom/hooks/use-modal';
import { GameEditJsonDialog } from './general/game-edit-json-dialog';

export const SatisfactoryGamesGeneral = (props) => {
  const { game, formik, handleDeleteGame, translate } = props;
  // const [secondary, setSecondary] = useState(false);
  const { modalOpen, setData, setModalState } = useModal(false, formik.values);

  const handleDownloadGame = () => {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { meta, ...rest } = formik.values;
    setData(rest);
    setModalState(true);
  };

  // const handleUploadGame = () => {};

  // const products = getSatisfactoryData('items');
  // const recipes = getSatisfactoryDataArray('recipes');
  // const test = () => {
  //   Object.keys(products).forEach((product) => {
  //     const attachedRecipes = recipes.filter((recipe) =>
  //       recipe.products.find((p) => p.itemClass === product)
  //     );
  //     const defaultRecipes = attachedRecipes?.filter((recipe) => !recipe.isAlternate);
  //     if (defaultRecipes.length > 1) console.log(product, defaultRecipes);
  //     //console.log(product, attachedRecipes, defaultRecipes, alternateRecipes);
  //   });
  // };
  useEffect(() => {
    //test();
    //console.log(getRecipesByProduct('Desc_Computer_C', 10));
  }, []);

  return (
    <FormikProvider value={formik}>
      <GameEditJsonDialog
        formik={formik}
        modalOpen={modalOpen}
        setModalState={setModalState}
      />
      <Stack spacing={4}>
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
              error={formik.errors.name}
              helperText={formik.errors.name}
              onChange={formik.handleChange}
              value={formik.values?.name || ''}
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
              onChange={formik.handleChange}
              value={formik.values?.description || ''}
            />
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <TextField
              value={formik.values?.version || ''}
              name="version"
              label={translate(tokens.satisfactory.pages.games.version)}
              select
              error
              helperText="Changing the version might break your save!"
              onChange={formik.handleChange}
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
            Number of factories: {formik.values?.factories?.length || 0}
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            Number of Transport stations: {formik.values?.transport?.stations?.length || 0}
          </Stack>
          {/* <Button
          //color="inherit"
          disabled={!formik.dirty}
          size="small"
          onClick={formik.handleSubmit}
          variant="contained"
        >
          Save
        </Button> */}
        </CardDefault>
        <CardDefault title={translate(tokens.satisfactory.pages.games.general.players)}>
          <Typography variant="subtitle1">
            {translate(tokens.satisfactory.pages.games.general.addPlayerHelperText)}
          </Typography>

          <FieldArray
            name="players"
            render={(arrayHelpers) => (
              <div>
                <List dense={true}>
                  {formik.values?.players?.map((player, index) => {
                    const isOwner = player.uid === game.owner;
                    if (isOwner) {
                      player.id = createGuid(false);
                    }
                    return (
                      <ListItem
                        key={player.uid}
                        secondaryAction={
                          !isOwner && (
                            <IconButton
                              onClick={() => arrayHelpers.remove(index)}
                              disabled={!(game.owner === getAuth().currentUser.uid)}
                              edge="end"
                              aria-label="delete"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        {isOwner ? (
                          <ListItemText
                            primary={`${game.owner}`}
                            secondary={translate(
                              tokens.satisfactory.pages.games.general.cantDeleteOwner
                            )}
                          />
                        ) : (
                          <TextField
                            disabled={!(game.owner === getAuth().currentUser.uid) || isOwner}
                            label={translate(tokens.satisfactory.pages.games.general.userId)}
                            sx={{ flexGrow: 1 }}
                            name={`players.${index}.uid`}
                            onChange={formik.handleChange}
                            value={formik.values.players[index].uid}
                          />
                        )}
                      </ListItem>
                    );
                  })}
                </List>
                <Button
                  //color="inherit"
                  disabled={!(game.owner === getAuth().currentUser.uid)}
                  size="small"
                  onClick={() =>
                    arrayHelpers.push({
                      id: createGuid(false),
                      name: '',
                      uid: '',
                    })
                  }
                  variant="contained"
                >
                  {translate(tokens.satisfactory.pages.games.general.addPlayer)}
                </Button>
              </div>
            )}
          />
        </CardDefault>
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
                  disabled={!(game.owner === getAuth().currentUser.uid)}
                  onClick={handleDownloadGame}
                  variant="contained"
                >
                  {translate(tokens.satisfactory.pages.games.general.downloadGame)}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </CardDefault>
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
                disabled={!(game.owner === getAuth().currentUser.uid)}
                onClick={handleDeleteGame}
                variant="outlined"
              >
                {translate(tokens.satisfactory.pages.games.general.deleteGame)}
              </Button>
            </Stack>
          </Grid>
        </CardDefault>
      </Stack>
    </FormikProvider>
  );
};

SatisfactoryGamesGeneral.propTypes = {
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
  translate: PropTypes.func,
};
