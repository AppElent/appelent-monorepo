import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  OutlinedInput,
  Stack,
  SvgIcon,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useItems } from 'src/custom/hooks/use-items';
import { getSatisfactoryData, getSatisfactoryDataArray } from 'src/custom/libs/satisfactory';
import { useQueryParam } from 'use-query-params';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import { useMemo } from 'react';
import { Scrollbar } from 'src/components/scrollbar';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import useModal from 'src/custom/hooks/use-modal';
import { useKey } from 'src/custom/hooks/use-key';

const ProductListDialog = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [version] = useQueryParam('version');
  const modal = useModal();
  useKey({ key: 'p', event: 'ctrlKey' }, () => modal.setModalState(true));

  const recipeArray = useMemo(() => getSatisfactoryDataArray('recipes', version), [version]);
  //const schematics = useMemo(() => getSatisfactoryDataArray('schematics', version), [version]);
  const productArray = useMemo(() => getSatisfactoryDataArray('items', version), [version]);
  const products = useMemo(() => getSatisfactoryData('items', version), [version]);
  const machines = useMemo(() => getSatisfactoryData('buildables', version), [version]);

  const { items, pageItems, search, handlers } = useItems(productArray, {
    sortBy: 'name',
    filters: { isFuel: { min: true } },
    rowsPerPage: 5,
  });

  const sortOptions = [
    {
      label: 'Name (asc)',
      value: 'asc',
    },
    {
      label: 'Name (desc)',
      value: 'desc',
    },
  ];

  const tabsData = [
    {
      label: 'All',
      value: 'all',
    },
  ];

  return (
    <Dialog
      onClose={() => modal.setModalState(false)}
      open={modal.modalOpen}
      fullWidth
      fullScreen={!matches}
      maxWidth="lg"
    >
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100',
          p: 3,
        }}
      >
        <Card>
          <Tabs
            indicatorColor="primary"
            scrollButtons="auto"
            textColor="primary"
            value="all"
            sx={{ px: 3 }}
            variant="scrollable"
          >
            {tabsData.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Tabs>
          <Divider />
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            gap={2}
            sx={{ p: 3 }}
          >
            <OutlinedInput
              placeholder="Search products"
              startAdornment={
                <InputAdornment position="start">
                  <SvgIcon>
                    <SearchMdIcon />
                  </SvgIcon>
                </InputAdornment>
              }
              value={search.search || ''}
              sx={{ flexGrow: 1 }}
              autoFocus
              onChange={(e) => handlers.handleSearchChange(e.target.value)}
            />
            <TextField
              label="Sort By"
              name="sort"
              select
              value="asc"
              //SelectProps={{ native: true }}
            >
              {sortOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Scrollbar>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  {/* <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell> */}
                  <TableCell>Name</TableCell>
                  <TableCell>Inputs</TableCell>
                  <TableCell>Machine</TableCell>
                  <TableCell>Outputs</TableCell>
                  <TableCell align="right">Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pageItems.map((item) => {
                  const defaultRecipe = recipeArray.find(
                    (r) =>
                      !r.isAlternate && r.products?.find((rp) => rp.itemClass === item.className)
                  );
                  const productUrl = `/assets/satisfactory/products/${item.className}.jpg`;
                  const cyclesMin = 60 / parseFloat(defaultRecipe?.craftTime);
                  return (
                    <TableRow
                      hover
                      sx={{ pl: 5, height: '101px' }}
                      key={item.className}
                    >
                      {/* <TableCell padding="checkbox">
                          <Checkbox />
                        </TableCell> */}
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={1}
                        >
                          <Avatar
                            src={productUrl}
                            sx={{
                              height: 42,
                              width: 42,
                            }}
                          />
                          <div>
                            <Link
                              color="inherit"
                              variant="subtitle2"
                            >
                              {item.name}
                            </Link>
                            <Typography
                              color="text.secondary"
                              variant="body2"
                            >
                              {item.email}
                            </Typography>
                          </div>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {defaultRecipe?.ingredients.map((p) => (
                          <div key={p.itemClass}>
                            {p.quantity} x {products[p.itemClass]?.name} (
                            {+parseFloat(cyclesMin * p.quantity).toPrecision(3)}/min)
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {defaultRecipe && (
                          <>
                            {machines[defaultRecipe?.producedIn]?.name} - {defaultRecipe?.craftTime}
                            s
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {defaultRecipe?.products.map((p) => (
                          <div key={p.itemClass}>
                            {p.quantity} x {products[p.itemClass]?.name} (
                            {+parseFloat(cyclesMin * p.quantity).toPrecision(3)}/min)
                          </div>
                        ))}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton>
                          <SvgIcon>
                            <ArrowRightIcon />
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
          <TablePagination
            component="div"
            count={items.length || 0}
            onPageChange={handlers.handlePageChange}
            onRowsPerPageChange={handlers.handleRowsPerPageChange}
            page={search.page}
            rowsPerPage={search.rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      </Box>
      <DialogActions>
        <Button onClick={() => modal.setModalState(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductListDialog;
