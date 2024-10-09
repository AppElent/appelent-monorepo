import { Divider, Stack, Switch, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { CardDefault } from 'src/components/app/card-default';

const PublicProfileCard = ({ user, profilePublic, setProfilePublic, available, setAvailable }) => {
  return (
    <CardDefault title="Public profile settings">
      <Stack
        divider={<Divider />}
        spacing={3}
      >
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography variant="subtitle1">Make Displayname Public</Typography>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              Means that anyone viewing your profile will be able to see your display name.
            </Typography>
          </Stack>
          <Switch
            checked={profilePublic}
            onChange={(e) => {
              setProfilePublic(e.target.checked, user.uid, user.displayName);
            }}
          />
        </Stack>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography variant="subtitle1">Allow people to add as contact</Typography>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              Toggling this will let everyone know that they can add you as a contact.
            </Typography>
          </Stack>
          <Switch
            checked={available}
            onChange={(e) => {
              setAvailable(e.target.checked, user.uid);
            }}
          />
        </Stack>
      </Stack>
    </CardDefault>
  );
};

PublicProfileCard.propTypes = {
  available: PropTypes.bool,
  profilePublic: PropTypes.bool,
  setAvailable: PropTypes.func,
  setProfilePublic: PropTypes.func,
  user: PropTypes.object,
};

export default PublicProfileCard;
