import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import {
  Autocomplete,
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslate } from '@refinedev/core';
import { FieldArray } from 'formik';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { CardDefault } from 'src/components/app/card-default';
import { tokens } from 'src/locales/tokens';

const GamePlayersCard = ({ players, playerList, owner }) => {
  const translate = useTranslate();

  console.log(playerList);
  const sortedPlayers = useMemo(() => {
    const filtered = players.filter((p) => p !== owner);
    return [owner, ...filtered];
  }, [players]);
  console.log(players);

  return (
    <CardDefault title={translate(tokens.satisfactory.pages.games.general.players)}>
      <Typography variant="subtitle1">
        {translate(tokens.satisfactory.pages.games.general.addPlayerHelperText)}
      </Typography>

      <FieldArray
        name="playerIds"
        render={(arrayHelpers) => (
          <div>
            <List dense={true}>
              {sortedPlayers?.map((player, index) => {
                const playerIsOwner = player === owner;
                const foundPlayer = playerList.find((p) => p.uid === player);
                console.log(foundPlayer);
                return (
                  <ListItem
                    key={player}
                    secondaryAction={
                      !playerIsOwner && (
                        <IconButton
                          onClick={() => {
                            const playerIndex = players.findIndex((p) => p === player);
                            console.log(playerIndex);
                            if (playerIndex > -1) arrayHelpers.remove(playerIndex);
                          }}
                          disabled={playerIsOwner}
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
                    {playerIsOwner ? (
                      <ListItemText
                        primary={`${foundPlayer?.name || player}`}
                        secondary={translate(
                          tokens.satisfactory.pages.games.general.cantDeleteOwner
                        )}
                      />
                    ) : (
                      <>
                        <ListItemText primary={`${foundPlayer?.name || player}`} />
                        {/* <Autocomplete
                          getOptionLabel={(option) => option.name}
                          options={playerList || []}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              label="User displayname"
                            />
                          )}
                          isOptionEqualToValue={(option, value) => {
                            console.log(option, value);
                          }}
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
                          onChange={(e, value) => {
                            console.log(e, value);
                          }}
                          fullWidth
                          //sx={{ width: 300 }}
                          value={player}
                        /> */}
                      </>
                    )}
                  </ListItem>
                );
              })}
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <Autocomplete
                  getOptionLabel={(option) => option.name}
                  options={playerList || []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="User displayname"
                    />
                  )}
                  isOptionEqualToValue={(option, value) => {
                    console.log(option, value);
                    return option.uid === value.uid;
                  }}
                  renderOption={(props, option) => {
                    return (
                      <li
                        {...props}
                        key={option.uid}
                      >
                        {option.name}
                      </li>
                    );
                  }}
                  onChange={(e, value) => {
                    console.log(e, value);
                    arrayHelpers.push(value.uid);
                  }}
                  fullWidth
                  //sx={{ width: 300 }}
                  value={undefined}
                />
              </ListItem>
            </List>
            {/* <Button
              //color="inherit"
              disabled={!isOwner}
              size="small"
              onClick={() => arrayHelpers.push(undefined)}
              variant="contained"
            >
              {translate(tokens.satisfactory.pages.games.general.addPlayer)}
            </Button> */}
          </div>
        )}
      />
    </CardDefault>
  );
};

GamePlayersCard.propTypes = {
  handleChange: PropTypes.func,
  isOwner: PropTypes.bool,
  owner: PropTypes.string,
  players: PropTypes.array,
};

export default GamePlayersCard;
