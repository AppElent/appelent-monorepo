import { useTheme } from '@emotion/react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { getFactoryStatistics, getSatisfactoryData } from 'src/custom/libs/satisfactory';

const PlatformProductSelectorDialog = ({ modal, station, factories, setProducts, version }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [showAll, setShowAll] = useState(true);
  const products = useMemo(() => getSatisfactoryData('items', version), [version]);

  const stationFactories = useMemo(
    () => factories?.filter((factory) => station?.factories?.find((f) => f === factory.id)),
    [factories, station]
  );
  const factoryProducts = useMemo(() => {
    const returnObject = {
      allInputs: [],
      allOutputs: [],
      inputs: [],
      outputs: [],
    };

    stationFactories.forEach((factory) => {
      const statistics = getFactoryStatistics(factory?.recipes, version);
      statistics?.inputs?.forEach(
        (input) =>
          !returnObject.inputs.includes(input.product) && returnObject.inputs.push(input.product)
      );
      statistics?.outputs?.forEach(
        (input) =>
          !returnObject.outputs.includes(input.product) && returnObject.outputs.push(input.product)
      );
      statistics?.totalInputs?.forEach(
        (input) =>
          !returnObject.allInputs.includes(input.product) &&
          returnObject.allInputs.push(input.product)
      );
      statistics?.totalOutputs?.forEach(
        (input) =>
          !returnObject.allOutputs.includes(input.product) &&
          returnObject.allOutputs.push(input.product)
      );
    });

    return returnObject;
  }, [stationFactories]);

  return (
    <Dialog
      onClose={() => modal.setModalState(false)}
      open={modal.modalOpen}
      fullWidth
      fullScreen={!matches}
      maxWidth="md"
    >
      <DialogTitle>
        <Stack
          justifyContent={'space-between'}
          direction="row"
        >
          <div>Platform product selection</div>
          <FormControlLabel
            control={
              <Switch
                checked={showAll}
                onChange={(e) => {
                  setShowAll(e.target.checked);
                }}
              />
            }
            label="Show only factory inputs/outputs"
          />
        </Stack>
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {station?.platforms?.map((platform) => {
                  const title = station.type === 'train' ? platform.type : station.type;
                  const direction =
                    station.type === 'train' ? platform.direction : station.direction;
                  return (
                    <TableCell key={platform.id}>
                      {title} ({direction})
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {station?.platforms?.map((platform, index) => {
                  const ignoreFirst = station.type === 'train';
                  const direction =
                    station.type === 'train' ? platform.direction : station.direction;
                  const productList =
                    direction === 'in'
                      ? showAll
                        ? factoryProducts.allInputs
                        : factoryProducts.inputs
                      : showAll
                      ? factoryProducts.allOutputs
                      : factoryProducts.outputs;
                  return (
                    <TableCell key={platform.id}>
                      <FormGroup>
                        {(!ignoreFirst || (ignoreFirst && index !== 0)) &&
                          productList.map((p) => {
                            return (
                              <FormControlLabel
                                key={p}
                                control={
                                  <Checkbox
                                    checked={platform?.products?.includes(p) || false}
                                    onChange={(e) => {
                                      let currentProducts = [...(platform.products || [])] || [];
                                      e.target.checked && !currentProducts.includes(p)
                                        ? currentProducts.push(p)
                                        : (currentProducts = currentProducts.filter(
                                            (cp) => cp !== p
                                          ));
                                      setProducts(platform.id, currentProducts);
                                    }}
                                    name={p}
                                  />
                                }
                                label={products[p]?.name}
                              />
                            );
                          })}
                      </FormGroup>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            modal.setModalState(false);
          }}
          autoFocus
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlatformProductSelectorDialog;
