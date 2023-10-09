import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import numeral from 'numeral';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/app';
import { ItemDrawer } from 'src/components/app/list/item-drawer';
import { ItemListContainer } from 'src/components/app/list/item-list-container';
import { ItemListSearch } from 'src/components/app/list/item-list-search';
import { ItemListTableContainer } from 'src/components/app/list/item-list-table';
import { ItemDetailsContainer } from 'src/components/app/list/item-drawer/item-details';
import { SeverityPill } from 'src/components/severity-pill';
//import { useSearch, useItems } from "components/app/list/utils";

import prodv700 from 'src/custom/libs/satisfactory/data/v700/items.json';
import prodv800 from 'src/custom/libs/satisfactory/data/v800/items.json';
import { paginate } from 'src/custom/libs/paginate';
import { useRouter } from 'src/hooks/use-router';
import {
  getRecipesByProduct,
  getSatisfactoryData,
  getSatisfactoryItem,
  SatisfactoryCurrentVersion,
  satisfactoryVersions,
} from 'src/custom/libs/satisfactory';
import { paths } from 'src/paths';
import { SatisfactoryProductDetail } from 'src/sections/app/satisfactory/products/product-detail';
import { useTranslate } from '@refinedev/core';
import { tokens } from 'src/locales/tokens';
import { Seo } from 'src/components/seo';
import { NumberParam, StringParam, useQueryParam, withDefault } from 'use-query-params';
import { useItems } from 'src/custom/hooks/use-items';
import { CardDefault } from 'src/components/app/card-default';
import _ from 'lodash';
import useTabs from 'src/custom/hooks/use-tabs';
import RecipeList from 'src/sections/app/satisfactory/calculations/recipe-list';
import PreferredRecipes from 'src/sections/app/satisfactory/calculations/preferred-recipes';
import { useSettings } from 'src/hooks/use-settings';
import EndProducts from 'src/sections/app/satisfactory/calculations/end-products';

const tabsData = [
  { label: 'Recipe list by Product', value: 'recipe_list' },
  { label: 'All end products', value: 'end_products' },
];

const Calculations = () => {
  const [version, setVersion] = useQueryParam('version');
  const tabs = useTabs({ initial: tabsData[0].value, tabname: 'tab' });
  const [preferredRecipes, setPreferredRecipes] = useState([]);
  const settings = useSettings();

  console.log(preferredRecipes);

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
