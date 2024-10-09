import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import ProductList from 'src/components/app/satisfactory/product-list';
import { Seo } from 'src/components/seo';
import useLocalStorage from 'src/custom/hooks/use-local-storage';
import useModal from 'src/custom/hooks/use-modal';
import useTabs from 'src/custom/hooks/use-tabs';
import { useSatisfactoryPlanner } from 'src/custom/libs/satisfactory/use-satisfactory-planner';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import Graph from 'src/sections/app/satisfactory/factory-planner/graph';
import Input from 'src/sections/app/satisfactory/factory-planner/input';
import { useQueryParam } from 'use-query-params';
import AddIcon from '@mui/icons-material/Add';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import SaveIcon from '@mui/icons-material/Save';
import TempResult from 'src/sections/app/satisfactory/factory-planner/temp-result';

const FactoryPlanner = () => {
  usePageView();
  const [version] = useQueryParam('version');
  const [debug] = useQueryParam('debug');
  const settings = useSettings();
  const tabs = useTabs({ initial: 'overview', tabname: 'tab' });
  const modal = useModal();

  const { config, result } = useSatisfactoryPlanner({ autoUpdate: true, version });

  const plannerData = useMemo(() => {
    return {
      elements: [
        { data: { id: 'one', label: 'Product A' }, classes: ['item-shape', 'side-product'] },
        { data: { id: 'two', label: 'Recipe A' }, classes: ['recipe-shape'] },
        { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
      ],
    };
  }, [config]);

  // graph page: https://github.com/Greven145/yet-another-factory-planner/blob/master/client/src/containers/ProductionPlanner/PlannerResults/ProductionGraphTab/index.tsx
  // tooltip: https://github.com/Greven145/yet-another-factory-planner/blob/master/client/src/components/GraphTooltip/index.tsx

  return (
    <>
      <Seo title={'Factory Planner'} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          {config.config && (
            <Input
              open={modal.modalOpen}
              handleClose={() => modal.setModalState(false)}
              config={config.config}
              setConfig={config.setConfig}
              resetConfig={config.resetConfig}
              version={version}
            />
          )}
          <Box>
            <Stack
              alignItems="flex-start"
              direction="row"
              justifyContent="space-between"
              spacing={3}
              sx={{ mb: 2 }}
            >
              <div>
                <Typography variant="h4">Factory Planner</Typography>
              </div>
              <Box>
                {/* <TextField
                  select
                  label="Planner config"
                ></TextField> */}
                {/* <Button
                  variant="contained"
                  onClick={() => modal.setModalState(true)}
                >
                  Add new
                </Button> */}
              </Box>
            </Stack>
          </Box>
          <Stack
            justifyContent={'space-between'}
            direction="row"
          >
            <Stack direction="row">
              <IconButton
                onClick={() => config.addConfig()}
                color="primary"
              >
                <AddIcon />
              </IconButton>
              <Tabs
                value={config?.config?.id || 0}
                onChange={(e, newValue) => {
                  //console.log(newValue);
                  config?.setCurrentConfig(newValue);
                }}
                indicatorColor="primary"
                variant="scrollable"
              >
                {config?.configs &&
                  config.configs.map((singleConfig) => {
                    return (
                      <Tab
                        value={singleConfig.id}
                        key={singleConfig.id}
                        label={singleConfig.name}
                      />
                    );
                  })}
              </Tabs>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
            >
              <Tooltip
                title="Save configuration to save-game"
                placement="top"
              >
                <IconButton
                  onClick={() => config.addConfig()}
                  color="primary"
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Clone configuration"
                placement="top"
              >
                <IconButton
                  onClick={() => config.cloneConfig(config?.config?.id)}
                  color="primary"
                  variant="outlined"
                >
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Share configuration"
                placement="top"
              >
                <IconButton
                  onClick={() => {}}
                  color="primary"
                  variant="outlined"
                >
                  <ShareOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Reset configuration"
                placement="top"
              >
                <IconButton onClick={() => config.resetConfig()}>
                  <RestartAltIcon color="error" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="Delete configuration"
                placement="top"
              >
                <IconButton
                  onClick={() => {
                    const newValue = config?.configs?.filter(
                      (c) => c.id !== config?.config?.id
                    )?.[0]?.id;
                    console.log('testing', newValue);
                    if (newValue) {
                      config?.setCurrentConfig(newValue);
                    }

                    config.removeConfig();
                  }}
                >
                  <DeleteOutlineIcon color="error" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
          {/* {tabs.tab === 'graph' && (
            <Graph
              data={plannerData}
              setData={() => {}}
            />
          )}
          {tabs.tab === 'table' && <ProductList />} */}
          <Divider sx={{ my: 1 }} />
          <TextField
            label="Name"
            value={config?.config?.name}
            onChange={(e) => {
              console.log(e);
              config.setConfig('name', e.target.value);
            }}
            required
            error={!config?.config?.name}
            helperText={!config?.config?.name && 'Name is required'}
          />
          <Stack
            justifyContent={'space-between'}
            direction={'row'}
          >
            <Tabs
              indicatorColor="primary"
              onChange={tabs.handleTabChange}
              scrollButtons="auto"
              value={tabs.tab}
              variant="scrollable"
            >
              <Tab
                label="Overview"
                value="overview"
              />
              <Tab
                label="Graph"
                value="grap"
              />
              {debug === 'true' && (
                <Tab
                  label="Result"
                  value="result"
                />
              )}
              {debug === 'true' && (
                <Tab
                  label="Config"
                  value="config"
                />
              )}
              {debug === 'true' && (
                <Tab
                  label="Logging"
                  value="logging"
                />
              )}

              {/* {tabsData.map((tab) => (
                <Tab
                  key={tab.value}
                  label={tab.label}
                  value={tab.value}
                />
              ))} */}
            </Tabs>

            <Box>
              <Button
                variant="contained"
                onClick={() => modal.setModalState(true)}
              >
                Set input
              </Button>
            </Box>
          </Stack>
          {result?.loading && <>LOADING</>}
          {!result?.loading && (
            <>
              {tabs.tab === 'graph' && (
                <Graph
                  data={plannerData}
                  setData={() => {}}
                />
              )}
              {tabs.tab === 'overview' && <TempResult results={result} />}
              {tabs.tab === 'config' && <pre>{JSON.stringify(result?.config, null, 2)}</pre>}
              {tabs.tab === 'result' && <pre>{JSON.stringify(result?.data, null, 2)}</pre>}
              {tabs.tab === 'logging' && <pre>{JSON.stringify(result?.logging, null, 2)}</pre>}
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default FactoryPlanner;
