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
import {
  satisfactoryVersions,
} from "libs/satisfactory";
import { getAuth } from "firebase/auth";

const addPlayer = () => {};

export const SatisfactoryGamesGeneral = (props) => {
  const { game, formik, handleDeleteGame } = props;
  const [secondary, setSecondary] = useState(false);

  return (
    <FormikProvider value={formik}>
      <Stack spacing={4}>
        <Button
          //color="inherit"
          disabled={!formik.dirty}
          size="small"
          onClick={formik.handleSubmit}
          variant="contained"
        >
          Save
        </Button>
        <CardDefault title="Settings">
          <Stack alignItems="center" direction="row" spacing={2}>
            <TextField
              label="Name"
              sx={{ flexGrow: 1 }}
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name || ""}
            />
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
            <TextField
              label="Description"
              sx={{ flexGrow: 1 }}
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description || ""}
            />
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
            <TextField
              value={formik.values.version || ""}
              name="version"
              label="Version"
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
        <CardDefault title="Players">
          <Typography variant="subtitle1">
            You can add players here. The owner of the game is able to delete
            the game and add other players, whereas players can only update game
            data.
          </Typography>

          <FieldArray
            name="players"
            render={(arrayHelpers) => (
              <div>
                <List dense={true}>
                  <ListItem
                  // secondaryAction={
                  //   <IconButton edge="end" aria-label="delete">
                  //     <DeleteIcon />
                  //   </IconButton>
                  // }
                  >
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
                  </ListItem>
                  {formik.values.players
                    ?.filter((player) => player.uid !== game.owner)
                    .map((player, index) => {
                      return (
                        <ListItem
                          key={player.uid}
                          secondaryAction={
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
                          }
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <TextField
                            disabled={
                              !(game.owner === getAuth().currentUser.uid)
                            }
                            label="User id"
                            sx={{ flexGrow: 1 }}
                            name={`players.${index}.uid`}
                            onChange={formik.handleChange}
                            value={formik.values.players[index].uid}
                          />
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
                  onClick={() => arrayHelpers.push({ name: "", uid: "" })}
                  variant="contained"
                >
                  Add player
                </Button>
              </div>
            )}
          />
        </CardDefault>
        <CardDefault title="Delete game">
          <Grid xs={12} md={8}>
            <Stack alignItems="flex-start" spacing={3}>
              <Typography variant="subtitle1">
                Delete this game and all related data. This is irreversible!
              </Typography>
              <Button
                color="error"
                disabled={!(game.owner === getAuth().currentUser.uid)}
                onClick={handleDeleteGame}
                variant="outlined"
              >
                Delete game
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
