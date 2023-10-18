import {
  Avatar,
  Button,
  CardContent,
  MenuItem,
  Stack,
  TableContainer,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { GridDeleteIcon } from '@mui/x-data-grid';
import { useConfirm } from 'material-ui-confirm';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { getSatisfactoryData } from 'src/custom/libs/satisfactory';
import { STATION_IMAGES } from 'src/custom/libs/satisfactory/static';

const PLATFORM_TEMPLATE = {
  type: 'station',
  direction: undefined,
};

const PLATFORM_TYPES = {
  station: 'Station',
  empty: 'Empty platform',
  freight: 'Freight platform',
  fluid: 'Fluid platform',
};

// const IMAGES = {
//   station: '/assets/satisfactory/Train_Station.webp',
//   platform: '/assets/satisfactory/Fluid_Freight_Platform.webp',
//   drone: '/assets/satisfactory/Drone_Port.webp',
//   truck: '/assets/satisfactory/Truck_Station.webp',
// };

const IMAGES = STATION_IMAGES;

const TrainPlatformsCard = (props) => {
  const {
    addPlatform,
    deletePlatform,
    setPlatform,
    platforms,
    showProductSelector,
    station,
    version,
  } = props;
  const products = useMemo(() => getSatisfactoryData('items', version), [version]);
  const confirm = useConfirm();

  return (
    <Card>
      {station?.type === 'train' ? (
        <CardHeader
          title="Train platforms"
          //subheader="Condition and temperature"
          action={
            <Button
              variant="contained"
              onClick={() => {
                const type = station?.platforms?.length === 0 ? 'station' : 'freight';
                const template = {
                  ...PLATFORM_TEMPLATE,
                  id: nanoid(),
                  type,
                  direction: 'in',
                };
                addPlatform(template);
              }}
            >
              Add
            </Button>
          }
        />
      ) : (
        <CardHeader
          title="Platforms"
          //subheader="Condition and temperature"
        />
      )}
      <CardContent>
        {station.platforms?.length > 0 && (
          <Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    {station.type === 'train' && <TableCell>Type</TableCell>}
                    <TableCell>Direction</TableCell>
                    <TableCell>Products</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {station.platforms.map((platform, index) => {
                    const image_url =
                      station.type === 'train' ? IMAGES[platform.type] : IMAGES[station.type];
                    return (
                      <TableRow
                        key={platform.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell width={20}>
                          <Box
                            sx={{
                              width: 100,
                              '& img': {
                                width: '100%',
                              },
                              maxWidth: 'fit-content',
                            }}
                          >
                            <img src={image_url} />
                          </Box>
                        </TableCell>
                        {station.type === 'train' && (
                          <TableCell>
                            <TextField
                              label="Type"
                              sx={{ flexGrow: 1, width: 200 }}
                              select
                              disabled={index === 0}
                              name={`type`}
                              onChange={(e) => {
                                setPlatform(platform.id, {
                                  ...platform,
                                  type: e.target.value,
                                  products: [],
                                });
                              }}
                              value={platform.type || ''}
                            >
                              {Object.entries(PLATFORM_TYPES).map((key) => {
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
                        )}

                        <TableCell>
                          {!['station', 'empty'].includes(platform.type) && (
                            <TextField
                              label="Direction"
                              sx={{ flexGrow: 1, minWidth: 100 }}
                              select
                              disabled={index === 0}
                              name={`direction`}
                              onChange={(e) => {
                                const setFn = () => {
                                  setPlatform(platform.id, {
                                    ...platform,
                                    direction: e.target.value,
                                    products: [],
                                  });
                                };
                                if (platform.products && platform.products.length > 0) {
                                  confirm({
                                    description:
                                      'If you change the direction of the station or platform, all configured products will be deleted. Also, if there are vehicles stopping at this station, the configured products will be reset.',
                                  }).then(() => {
                                    //console.log(e);
                                    setFn();
                                  });
                                } else {
                                  setFn();
                                }
                              }}
                              value={
                                station.type === 'train'
                                  ? platform.direction || ''
                                  : station.direction || ''
                              }
                            >
                              {[
                                ['in', 'In'],
                                ['out', 'Out'],
                              ].map((key) => {
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
                          )}
                        </TableCell>
                        <TableCell>
                          {platform.products?.map((p) => {
                            return (
                              <Stack
                                key={p}
                                direction="row"
                                spacing={1}
                                alignItems={'center'}
                                sx={{ mt: 1 }}
                              >
                                <Avatar
                                  src={`/assets/satisfactory/products/${p}.jpg`}
                                  sx={{
                                    height: 45,
                                    width: 45,
                                  }}
                                />
                                <Box>{products[p]?.name}</Box>
                              </Stack>
                            );
                          })}
                        </TableCell>
                        <TableCell>
                          {index !== 0 && (
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => {
                                deletePlatform(platform.id);
                              }}
                            >
                              <GridDeleteIcon>Delete</GridDeleteIcon>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack
              justifyContent="flex-end"
              direction="row"
            >
              <div>
                <Button
                  disabled={!station?.factories || station.factories.length === 0}
                  onClick={showProductSelector}
                >
                  Configure products
                </Button>
              </div>
            </Stack>
          </Box>
        )}
        {(!station.platforms || station.platforms?.length === 0) && <>No items to show</>}
      </CardContent>
    </Card>
  );
};

TrainPlatformsCard.propTypes = {
  addPlatform: PropTypes.func,
  deletePlatform: PropTypes.func,
  platforms: PropTypes.array,
  setPlatform: PropTypes.func,
  showProductSelector: PropTypes.any,
  station: PropTypes.shape({
    direction: PropTypes.string,
    factories: PropTypes.array,
    platforms: PropTypes.array,
    type: PropTypes.string,
  }),
  version: PropTypes.string,
};

export default TrainPlatformsCard;
