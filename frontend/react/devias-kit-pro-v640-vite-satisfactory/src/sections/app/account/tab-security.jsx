import { Stack } from '@mui/material';
import PropTypes from 'prop-types';

import ChangePasswordCard from './change-password-card';

const TabSecurity = (props) => {
  const { updatePassword } = props;
  // const [isEditing, setIsEditing] = useState(false);

  return (
    <Stack spacing={4}>
      <ChangePasswordCard />
    </Stack>
  );
};

TabSecurity.propTypes = {
  updatePassword: PropTypes.func,
};

export default TabSecurity;
