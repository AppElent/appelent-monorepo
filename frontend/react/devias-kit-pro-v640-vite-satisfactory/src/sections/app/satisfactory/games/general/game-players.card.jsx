import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import {
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
import { CardDefault } from 'src/components/app/card-default';
import { tokens } from 'src/locales/tokens';

const GamePlayersCard = ({ players, owner, isOwner, handleChange }) => {
  const translate = useTranslate();

  return (
    <CardDefault title={translate(tokens.satisfactory.pages.games.general.players)}>
      <Typography variant="subtitle1">
        {translate(tokens.satisfactory.pages.games.general.addPlayerHelperText)}
      </Typography>

      <FieldArray
        name="players"
        render={(arrayHelpers) => (
          <div>
            <List dense={true}>
              {players?.map((player, index) => {
                const playerIsOwner = player.uid === owner;
                if (isOwner) {
                  player.id = nanoid();
                }
                return (
                  <ListItem
                    key={player.uid}
                    secondaryAction={
                      !isOwner && (
                        <IconButton
                          onClick={() => arrayHelpers.remove(index)}
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
                        primary={`${owner}`}
                        secondary={translate(
                          tokens.satisfactory.pages.games.general.cantDeleteOwner
                        )}
                      />
                    ) : (
                      <TextField
                        disabled={!isOwner || playerIsOwner}
                        label={translate(tokens.satisfactory.pages.games.general.userId)}
                        sx={{ flexGrow: 1 }}
                        name={`players.${index}.uid`}
                        onChange={handleChange}
                        value={players[index].uid}
                      />
                    )}
                  </ListItem>
                );
              })}
            </List>
            <Button
              //color="inherit"
              disabled={!isOwner}
              size="small"
              onClick={() =>
                arrayHelpers.push({
                  id: nanoid(),
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
  );
};

GamePlayersCard.propTypes = {
  handleChange: PropTypes.func,
  isOwner: PropTypes.bool,
  owner: PropTypes.string,
  players: PropTypes.array,
};

export default GamePlayersCard;
