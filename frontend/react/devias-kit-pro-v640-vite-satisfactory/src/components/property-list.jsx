import List from '@mui/material/List';
import PropTypes from 'prop-types';

export const PropertyList = (props) => {
  const { children } = props;

  return <List disablePadding>{children}</List>;
};

PropertyList.propTypes = {
  children: PropTypes.node,
};
