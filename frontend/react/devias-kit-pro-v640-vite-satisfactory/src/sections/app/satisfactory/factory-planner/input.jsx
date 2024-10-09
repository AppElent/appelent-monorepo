import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import useTabs from 'src/custom/hooks/use-tabs';

import TabProduction from './tab-production';
import TabRecipes from './tab-recipes';
import TabResources from './tab-resources';
import TabInputs from './tab-inputs';

const tabsData = [
  { label: 'Production', value: 'production' },
  { label: 'Resources', value: 'resources' },
  { label: 'Inputs', value: 'inputs' },
  { label: 'Recipes', value: 'recipes' },
];

const Input = ({ handleClose, open, config, setConfig, resetConfig }) => {
  const tabs = useTabs({ initial: tabsData[0].value });
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      fullScreen={!matches}
      maxWidth="xl"
    >
      <DialogTitle>Factory planner input</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Switch
              checked={config.autoUpdate}
              onChange={(e) => {
                setConfig('autoUpdate', e.target.checked);
              }}
            />
          }
          label="Auto calculate (disable if things get laggy)"
        />
        {/* <Grid
          container
          spacing={1}
        >
          <Grid
            item
            xs={12}
            md={5}
            alignItems="center"
          >
            <Button variant="contained">Save and share</Button>
          </Grid>
          <Grid
            item
            md={7}
          >
            <TextField
              value="test"
              label="Link"
              disabled={true}
            />
          </Grid>
        </Grid> */}
        <Tabs
          indicatorColor="primary"
          onChange={tabs.handleTabChange}
          scrollButtons="auto"
          textColor="primary"
          value={tabs.tab}
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
        {tabs.tab === 'production' && (
          <TabProduction
            products={config.products}
            setProducts={(products) => setConfig('products', products)}
            version={config.version}
          />
        )}
        {tabs.tab === 'resources' && (
          <TabResources
            resources={config.resources || []}
            setResources={(newResources) => {
              setConfig('resources', newResources);
            }}
          />
        )}
        {tabs.tab === 'recipes' && (
          <TabRecipes
            recipes={config.recipes}
            setRecipes={(newRecipes) => {
              setConfig('recipes', newRecipes);
            }}
          />
        )}
        {tabs.tab === 'inputs' && (
          <TabInputs
            inputs={config.inputs}
            setInputs={(newInputs) => {
              setConfig('inputs', newInputs);
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={() => {
            resetConfig();
          }}
        >
          Reset all
        </Button>
        <Button
          autoFocus
          onClick={handleClose}
          variant="outlined"
        >
          Close
        </Button>
        {!config.autoUpdate && (
          <Button
            onClick={() => {}}
            variant="contained"
          >
            Calculate
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

Input.propTypes = {
  config: PropTypes.any,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  setConfig: PropTypes.func,
};

export default Input;
