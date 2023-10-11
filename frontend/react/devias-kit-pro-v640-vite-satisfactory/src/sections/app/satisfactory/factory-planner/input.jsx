import PropTypes from 'prop-types';
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
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import useTabs from 'src/custom/hooks/use-tabs';
import TabProduction from './tab-production';
import TabInputs from './tab-inputs';
import TabRecipes from './tab-recipes';

const tabsData = [
  { label: 'Production', value: 'production' },
  { label: 'Inputs', value: 'inputs' },
  { label: 'Recipes', value: 'recipes' },
];

const Input = ({ handleClose, open, config, setConfig }) => {
  const tabs = useTabs({ initial: tabsData[0].value });
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth
      fullScreen={!matches}
      maxWidth="md"
    >
      <DialogTitle>Factory planner input</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Auto calculate (disable if things get laggy)"
        />
        <Grid
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
        </Grid>
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
        {tabs.tab === 'production' && <TabProduction />}
        {tabs.tab === 'inputs' && <TabInputs />}
        {tabs.tab === 'recipes' && <TabRecipes />}
      </DialogContent>
      <DialogActions>
        <Button
          color="error"
          onClick={() => {}}
        >
          Reset all
        </Button>
        <Button
          autoFocus
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {}}
          variant="contained"
        >
          Calculate
        </Button>
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
