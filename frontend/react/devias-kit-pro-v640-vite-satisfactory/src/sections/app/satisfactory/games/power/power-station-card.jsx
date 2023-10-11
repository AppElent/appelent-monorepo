import PropTypes from 'prop-types';
import { CardDefault } from 'src/components/app/card-default';

const PowerStationCard = ({ station }) => {
  return <CardDefault title={station.name}>{JSON.stringify(station)}</CardDefault>;
};

PowerStationCard.propTypes = {
  station: PropTypes.object,
};

export default PowerStationCard;
