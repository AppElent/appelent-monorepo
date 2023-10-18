import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Link,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { SeverityPill } from 'src/components/severity-pill';
import Mermaid from 'src/custom/libs/mermaid';
import { getSatisfactoryData, getSatisfactoryDataArray } from 'src/custom/libs/satisfactory';
import { recipeChart } from 'src/custom/libs/satisfactory/charts';
import { useQueryParam } from 'use-query-params';

const RecipeItemDialog = ({ recipe, open, setOpen, setRecipeId, previousRecipe, ...props }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [version] = useQueryParam('version');

  const recipeArray = useMemo(() => getSatisfactoryDataArray('recipes', version), [version]);
  //const schematics = useMemo(() => getSatisfactoryDataArray('schematics', version), [version]);
  const productArray = useMemo(() => getSatisfactoryDataArray('items', version), [version]);
  const products = useMemo(() => getSatisfactoryData('items', version), [version]);
  const machines = useMemo(() => getSatisfactoryData('buildables', version), [version]);

  if (!recipe) return <></>;

  const cyclesMin = 60 / parseFloat(recipe.craftTime);
  const machineUrl = `/assets/satisfactory/buildables/${recipe.producedIn}.jpg`;
  const productUrl = `/assets/satisfactory/products/${recipe.products[0].itemClass}.jpg`;

  return (
    <Dialog
      onClose={() => setOpen(false)}
      open={open}
      fullWidth
      fullScreen={!matches}
      maxWidth="lg"
    >
      <DialogContent>
        <IconButton
          disabled={!previousRecipe}
          onClick={() => setRecipeId(previousRecipe)}
        >
          <SvgIcon>
            <ArrowBackIcon />
          </SvgIcon>
        </IconButton>
        <Stack
          alignItems="center"
          direction={{
            xs: 'column',
            md: 'row',
          }}
          spacing={4}
          sx={{
            // backgroundColor: (theme) =>
            //   theme.palette.mode === 'dark' ? 'primary.darkest' : 'primary.lightest',
            borderRadius: 2.5,
            p: 4,
          }}
          {...props}
        >
          <Box
            sx={{
              width: 200,
              '& img': {
                width: '100%',
              },
            }}
          >
            <img src={productUrl} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              color="primary.main"
              variant="overline"
            >
              {recipe.name}
            </Typography>
            {/* <Typography
              color="text.primary"
              sx={{ mt: 2 }}
              variant="h6"
            >
              New update available!
            </Typography> */}
            <Typography
              color="text.primary"
              sx={{ mt: 1 }}
              variant="body1"
            >
              {recipe.description}
            </Typography>
            <Box sx={{ mt: 2 }}></Box>
          </Box>
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Inputs</TableCell>
                <TableCell>Machine</TableCell>
                <TableCell>Outputs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={recipe.className}>
                <TableCell>
                  {recipe.name}
                  {recipe.isAlternate && (
                    <div>
                      <SeverityPill>Alternate</SeverityPill>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {recipe.ingredients.map((ingredient) => {
                    const productUrl = `/assets/satisfactory/products/${ingredient.itemClass}.jpg`;
                    return (
                      <Stack
                        key={ingredient.itemClass}
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1 }}
                        alignItems="center"
                      >
                        <Avatar
                          src={productUrl}
                          sx={{
                            height: 42,
                            width: 42,
                          }}
                        />
                        <Box>
                          <Link
                            variant="body2"
                            color="inherit"
                            onClick={() => setRecipeId(ingredient.itemClass)}
                          >
                            {ingredient.quantity} x {products[ingredient.itemClass]?.name || ''} (
                            {cyclesMin * ingredient.quantity}/min)
                          </Link>
                        </Box>
                      </Stack>
                    );
                  })}
                </TableCell>
                <TableCell>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems={'center'}
                  >
                    <Avatar
                      src={machineUrl}
                      sx={{
                        height: 42,
                        width: 42,
                      }}
                    />
                    <Box>{machines[recipe.producedIn]?.name || 'Workshop'}</Box>
                  </Stack>
                  <Box textAlign={'center'}>{recipe.craftTime} sec</Box>
                </TableCell>
                <TableCell>
                  {recipe.products.map((product) => {
                    const productUrl = `/assets/satisfactory/products/${product.itemClass}.jpg`;
                    return (
                      <Stack
                        key={product.itemClass}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mt: 1 }}
                      >
                        <Avatar
                          src={productUrl}
                          sx={{
                            height: 42,
                            width: 42,
                          }}
                        />
                        <Box>
                          <Link
                            variant="body2"
                            color="inherit"
                            onClick={() => setRecipeId(product.itemClass)}
                          >
                            {product.quantity} x {products[product.itemClass]?.name || ''} (
                            {cyclesMin * product.quantity}/min)
                          </Link>
                        </Box>
                      </Stack>
                    );
                  })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          //alignItems={'center'}
          justifyContent={'center'}
          //display="flex"
          //width={500}
        >
          <Mermaid chart={recipeChart(recipe, getSatisfactoryData('items'), machines)} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

RecipeItemDialog.propTypes = {
  open: PropTypes.bool,
  previousProduct: PropTypes.string,
  product: PropTypes.object,
  setOpen: PropTypes.func,
  setProductId: PropTypes.func,
};

export default RecipeItemDialog;
