import { Box, Container, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';
import { Seo } from 'src/components/seo';
import useTabs from 'src/custom/hooks/use-tabs';
//import { useSearch, useItems } from "components/app/list/utils";
import { SatisfactoryCurrentVersion } from 'src/custom/libs/satisfactory';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import EndProducts from 'src/sections/app/satisfactory/calculations/end-products';
import PreferredRecipes from 'src/sections/app/satisfactory/calculations/preferred-recipes';
import RecipeList from 'src/sections/app/satisfactory/calculations/recipe-list';
import { useQueryParam } from 'use-query-params';

const tabsData = [
  { label: 'Recipe list by Product', value: 'recipe_list' },
  { label: 'All end products', value: 'end_products' },
];

const Calculations = () => {
  const [version, setVersion] = useQueryParam('version');
  const tabs = useTabs({ initial: tabsData[0].value, tabname: 'tab' });
  const [preferredRecipes, setPreferredRecipes] = useState([]);
  const settings = useSettings();

  usePageView();

  //const products = useMemo(() => getSatisfactoryData('items'), []);
  //const recipes = useMemo(() => getSatisfactoryData('recipes'), []);

  return (
    <>
      <Seo title="Products" />
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
            </Stack>
          </Box>
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
          <Divider sx={{ mb: 3 }} />
          {tabs.tab === 'recipe_list' && (
            <Stack spacing={4}>
              <RecipeList
                version={version || SatisfactoryCurrentVersion}
                preferredRecipes={preferredRecipes}
                setPreferredRecipes={setPreferredRecipes}
              />
              <PreferredRecipes
                version={version || SatisfactoryCurrentVersion}
                preferredRecipes={preferredRecipes}
                setPreferredRecipes={setPreferredRecipes}
              />
            </Stack>
          )}
          {tabs.tab === 'end_products' && (
            <EndProducts version={version || SatisfactoryCurrentVersion} />
          )}
        </Container>
      </Box>
    </>
  );
};

export default Calculations;
