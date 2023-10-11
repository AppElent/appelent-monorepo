import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { Button, CardContent, MenuItem, Stack, TableContainer, TextField } from '@mui/material';
import { createGuid } from 'src/custom/libs/create-guid';
import { GridDeleteIcon } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { getSatisfactoryData } from 'src/custom/libs/satisfactory';
import { useConfirm } from 'material-ui-confirm';

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

const IMAGES = {
  station: '/assets/satisfactory/Train_Station.webp',
  platform: '/assets/satisfactory/Fluid_Freight_Platform.webp',
  drone: '/assets/satisfactory/Drone_Port.webp',
  truck: '/assets/satisfactory/Truck_Station.webp',
};

export const SatisfactoryGamesTransportTrainPlatforms = (props) => {
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
  //   const [getPlatforms, addPlatform, setPlatforms, removePlatform] = useFormikCrud(
  //     formik,
  //     platformsFn
  //   );

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
                  id: createGuid(false),
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
                      station.type === 'train'
                        ? platform.type === 'station'
                          ? IMAGES['station']
                          : IMAGES['platform']
                        : station.type === 'drone'
                        ? IMAGES['drone']
                        : IMAGES['truck'];
                    return (
                      <TableRow
                        key={platform.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
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
                              sx={{ flexGrow: 1 }}
                              select
                              disabled={index === 0}
                              name={`type`}
                              onChange={(e) => {
                                console.log(e.target.value);
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
                          {platform.type !== 'station' && (
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
                          {platform.products?.map((p) => (
                            <div key={p}>{products[p]?.name}</div>
                          ))}
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

SatisfactoryGamesTransportTrainPlatforms.propTypes = {
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
