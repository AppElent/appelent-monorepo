import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  TextField,
} from '@mui/material';
import { GridDeleteIcon } from '@mui/x-data-grid';
import PropTypes from 'prop-types';

const PowerStationCard = ({ station, setPowerStation, deletePowerStation }) => {
  return (
    <Card>
      <CardHeader title={station.name} />
      <CardContent>
        <TextField
          name="name"
          label="Station name"
          onChange={(e) => {
            console.log(e);
            setPowerStation(station.id, { ...station, name: e.target.value });
          }}
          value={station.name}
        />
        <Stack
          justifyContent={'flex-end'}
          direction="row"
          spacing={1}
        >
          <div>
            <Button
              variant="outlined"
              color="error"
              onClick={() => deletePowerStation(station.id)}
            >
              <GridDeleteIcon>Delete</GridDeleteIcon>
            </Button>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
};

PowerStationCard.propTypes = {
  station: PropTypes.object,
};

export default PowerStationCard;
