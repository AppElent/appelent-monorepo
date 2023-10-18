import { Button, CardContent, MenuItem, TableContainer, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { GridDeleteIcon } from '@mui/x-data-grid';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';

const VEHICLE_TEMPLATE = {
  type: 'station',
};

const VEHICLE_TYPES = {
  locomotive: 'Train locomotive',
  freight: 'Freight car',
};

const IMAGES = {
  locomotive: '/assets/satisfactory/Electric_Locomotive.webp',
  freight: '/assets/satisfactory/Freight_Car.webp',
};

export const TrainConfig = (props) => {
  const { addCar, deleteCar, setCar, cars } = props;

  return (
    <Card>
      <CardHeader
        title="Train configuration"
        //subheader="Condition and temperature"
        action={
          <Button
            variant="contained"
            onClick={() => {
              const type = cars?.length === 0 ? 'locomotive' : 'freight';
              const template = { ...VEHICLE_TEMPLATE, id: nanoid(), type };
              addCar(template);
            }}
          >
            Add
          </Button>
        }
      />
      <CardContent>
        {cars.length > 0 && (
          <Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cars.map((car, index) => {
                    if (index === 0 && !car.type) car.type = 'locomotive';
                    return (
                      <TableRow
                        key={car.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              width: 100,
                              '& img': {
                                width: '100%',
                              },
                            }}
                          >
                            <img src={IMAGES[car.type]} />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <TextField
                            label="Type"
                            sx={{ flexGrow: 1, minWidth: 200 }}
                            select
                            name={`type`}
                            onChange={(e) => {
                              setCar(car.id, { ...car, type: e.target.value });
                            }}
                            value={car.type || ''}
                          >
                            {Object.entries(VEHICLE_TYPES).map((key) => {
                              return (
                                <MenuItem
                                  key={key[0]}
                                  value={key[0]}
                                >
                                  {key[1]}
                                </MenuItem>
                              );
                            })}
                          </TextField>
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                              deleteCar(car.id);
                            }}
                          >
                            <GridDeleteIcon>Delete</GridDeleteIcon>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        {cars.length === 0 && <>No items to show</>}
      </CardContent>
    </Card>
  );
};

TrainConfig.propTypes = {
  addCar: PropTypes.func,
  cars: PropTypes.array,
  deleteCar: PropTypes.func,
  setCar: PropTypes.func,
};
