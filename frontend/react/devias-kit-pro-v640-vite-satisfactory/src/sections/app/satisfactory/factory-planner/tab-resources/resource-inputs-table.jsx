import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { getSatisfactoryData, getSatisfactoryDataArray } from 'src/custom/libs/satisfactory';
import _ from 'lodash';
import { useMemo } from 'react';

const ResourceInputsTable = ({ resources, setResources, version }) => {
  const allResources = useMemo(
    () => _.sortBy(getSatisfactoryDataArray('resources', version), 'className'),
    [version]
  );
  const allProducts = useMemo(() => getSatisfactoryData('items', version), [version]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          {/* <TableRow>
            <TableCell>Test</TableCell>
          </TableRow> */}
        </TableHead>
        <TableBody>
          {allResources.map((resource) => {
            const resourceObject = allProducts[resource.itemClass];
            const inputIndex = resources.findIndex((e) => e.resource === resource.className);
            const foundInput = resources.find((e) => e.resource === resource.className);
            return (
              <TableRow key={resource.itemClass}>
                <TableCell>
                  <Stack
                    direction="row"
                    alignItems={'center'}
                    spacing={1}
                  >
                    <Avatar
                      src={`/assets/satisfactory/products/${resource.className}.jpg`}
                      sx={{
                        height: 42,
                        width: 42,
                      }}
                    />
                    {/* <Box>{resourceObject?.name}</Box> */}
                    <FormControlLabel
                      key={resource.className}
                      control={
                        <Checkbox
                          checked={(foundInput && foundInput.checked) || false}
                          onChange={(e) => {
                            let newResources = [...resources];
                            if (inputIndex === -1) {
                              setResources([
                                ...newResources,
                                {
                                  amount: 0,
                                  checked: e.target.checked,
                                  resource: resource.className,
                                },
                              ]);
                            } else {
                              newResources[inputIndex].checked = e.target.checked;
                              setResources([...newResources]);
                            }
                          }}
                          name={resource.className}
                          size="small"
                        />
                      }
                      label={resourceObject.name}
                    />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack
                    direction="row"
                    alignItems={'center'}
                    spacing={1}
                  >
                    <TextField
                      label="Items per minute"
                      onChange={(e) => {
                        const newInputs = [...resources];
                        if (inputIndex === -1) {
                          setResources([
                            ...newInputs,
                            {
                              resource: resource.className,
                              amount: parseFloat(e.target.value),
                              checked: true,
                            },
                          ]);
                        } else {
                          newInputs[inputIndex] = {
                            ...newInputs[inputIndex],
                            amount: parseFloat(e.target.value),
                            checked: foundInput.checked,
                          };
                          setResources([...newInputs]);
                        }
                      }}
                      size="small"
                      value={foundInput?.amount || 0}
                    />
                    <Button
                      onClick={() => {
                        const newInputs = [...resources];
                        if (inputIndex === -1) {
                          setResources([
                            ...newInputs,
                            {
                              resource: resource.className,
                              amount: resource.maxExtraction,
                              checked: true,
                            },
                          ]);
                        } else {
                          newInputs[inputIndex] = {
                            ...newInputs[inputIndex],
                            amount: resource.maxExtraction,
                            checked: true,
                          };
                          setResources([...newInputs]);
                        }
                      }}
                    >
                      Set maximum
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResourceInputsTable;
