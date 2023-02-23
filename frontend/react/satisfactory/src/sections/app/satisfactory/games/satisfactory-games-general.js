import { useState } from "react";
import PropTypes from "prop-types";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
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
} from "@mui/material";
import { FormikProvider, FieldArray } from "formik";

import { CardDefault } from "components/app/card-default";
import { satisfactoryVersions } from "libs/satisfactory";
import { getAuth } from "firebase/auth";
import { tokens } from "locales/tokens";
import { createGuid } from "libs/create-guid";

const addPlayer = () => {};

export const SatisfactoryGamesGeneral = (props) => {
  const { game, formik, handleDeleteGame, translate } = props;
  const [secondary, setSecondary] = useState(false);

  return (
    <FormikProvider value={formik}>
      <Stack spacing={4}>
        <CardDefault
          title={translate(tokens.satisfactory.pages.games.general.generalinfo)}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            <TextField
              label={translate(tokens.common.fields.name)}
              sx={{ flexGrow: 1 }}
              name="name"
              onChange={formik.handleChange}
              value={formik.values?.name || ""}
            />
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
            <TextField
              label={translate(tokens.common.fields.description)}
              sx={{ flexGrow: 1 }}
              name="description"
              onChange={formik.handleChange}
              value={formik.values?.description || ""}
            />
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
            <TextField
              value={formik.values?.version || ""}
              name="version"
              label={translate(tokens.satisfactory.pages.games.version)}
              select
              onChange={formik.handleChange}
            >
              {satisfactoryVersions.map((version) => {
                return (
                  <MenuItem key={version.key} value={version.key}>
                    {version.label}
                  </MenuItem>
                );
              })}
            </TextField>
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
        <CardDefault
          title={translate(tokens.satisfactory.pages.games.general.players)}
        >
          <Typography variant="subtitle1">
            {translate(
              tokens.satisfactory.pages.games.general.addPlayerHelperText
            )}
          </Typography>

          <FieldArray
            name="players"
            render={(arrayHelpers) => (
              <div>
                <List dense={true}>
                  {/* <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${game.owner} (${
                        game.players.find((player) => player.uid === game.owner)
                          .name
                      })`}
                      secondary="This is the owner of the game. The owner cannot be deleted."
                    />
                  </ListItem> */}
                  {formik.values?.players?.map((player, index) => {
                    const isOwner = player.uid === game.owner;
                    if (isOwner) {
                      player.id = createGuid(false);
                    }
                    return (
                      <ListItem
                        key={player.id}
                        secondaryAction={
                          !isOwner && (
                            <IconButton
                              onClick={() => arrayHelpers.remove(index)}
                              disabled={
                                !(game.owner === getAuth().currentUser.uid)
                              }
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
                              tokens.satisfactory.pages.games.general
                                .cantDeleteOwner
                            )}
                          />
                        ) : (
                          <TextField
                            disabled={
                              !(game.owner === getAuth().currentUser.uid) ||
                              isOwner
                            }
                            label={translate(
                              tokens.satisfactory.pages.games.general.userId
                            )}
                            sx={{ flexGrow: 1 }}
                            name={`players.${index}.uid`}
                            onChange={formik.handleChange}
                            value={formik.values.players[index].uid}
                          />
                        )}

                        {/* <ListItemText
                          primary={player.name}
                          secondary={secondary ? "Secondary text" : null}
                        /> */}
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
                      name: "",
                      uid: "",
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
        <CardDefault
          title={translate(tokens.satisfactory.pages.games.general.deleteGame)}
        >
          <Grid xs={12} md={8}>
            <Stack alignItems="flex-start" spacing={3}>
              <Typography variant="subtitle1">
                {translate(
                  tokens.satisfactory.pages.games.general.deleteGameWarning
                )}
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
  game: PropTypes.object.isRequired,
};
