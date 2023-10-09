import { Box, Button, Container, Stack, Tab, Tabs, Typography } from '@mui/material';

import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Seo } from 'src/components/seo';
import { useMemo, useState } from 'react';

import { useQueryParam } from 'use-query-params';
import useTabs from 'src/custom/hooks/use-tabs';
import Graph from 'src/sections/app/satisfactory/factory-planner/graph';
import useModal from 'src/custom/hooks/use-modal';
import Input from 'src/sections/app/satisfactory/factory-planner/input';
import useLocalStorage from 'src/custom/hooks/use-local-storage';
import ProductList from 'src/components/app/satisfactory/product-list';

const tabsData = [
  { label: 'Graph', value: 'graph' },
  { label: 'Table', value: 'table' },
];

const FactoryPlanner = () => {
  usePageView();
  const [version] = useQueryParam('version');
  const settings = useSettings();
  const tabs = useTabs({ initial: tabsData[0].value, tabname: 'tab' });
  const modal = useModal();
  const [plannerConfig, setPlannerConfig] = useLocalStorage(
    'satisfactory_planner_config',
    { test: true },
    'sessionStorage'
  );

  const plannerData = useMemo(() => {
    return {
      elements: [
        { data: { id: 'one', label: 'Product A' }, classes: ['item-shape', 'side-product'] },
        { data: { id: 'two', label: 'Recipe A' }, classes: ['recipe-shape'] },
        { data: { source: 'one', target: 'two', label: 'Edge from Node1 to Node2' } },
      ],
    };
  }, [plannerConfig]);

  console.log(modal);

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
          <Box>
            <Stack
              alignItems="flex-start"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <div>
                <Typography variant="h4">Calculations</Typography>
              </div>
              <Button
                variant="contained"
                onClick={() => modal.setModalState(true)}
              >
                Set input
              </Button>
            </Stack>
          </Box>
          <Input
            open={modal.modalOpen}
            handleClose={() => modal.setModalState(false)}
            config={plannerConfig}
            setConfig={setPlannerConfig}
          />
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

          {/* <CytoscapeComponent
            elements={elements}
            //style={{ width: '100%', height: '100%' }}
            //style={{ width: '100vw', height: '100vh' }}
            style={{ height: '45vw', width: '100%', overflow: 'hidden' }}
            layout={layout}
            // /stylesheet={}
          /> */}
          {tabs.tab === 'graph' && <Graph data={plannerData} />}
          {tabs.tab === 'table' && <ProductList />}
        </Container>
      </Box>
    </>
  );
};

export default FactoryPlanner;
