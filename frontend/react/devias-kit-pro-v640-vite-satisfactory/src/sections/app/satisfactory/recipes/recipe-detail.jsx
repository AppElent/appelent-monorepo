import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Stack } from '@mui/material';
import { SeverityPill } from 'src/components/severity-pill';
import { PropertyListTemplate } from 'src/components/app/property-list-template';
import { tokens } from 'src/locales/tokens';
import {
  getSatisfactoryData,
  getSatisfactoryDataArray,
  recipeChart,
} from 'src/custom/libs/satisfactory';
import Mermaid from 'src/custom/libs/mermaid';
import { useMemo } from 'react';
import { useTranslate } from '@refinedev/core';

export const SatisfactoryRecipeDetail = ({ recipe }) => {
  const translate = useTranslate();
  const machines = getSatisfactoryData('buildables');
  const schematics = useMemo(() => {
    return getSatisfactoryDataArray('schematics');
  }, []);
  const getSeverityPill = (item) => {
    let status = 'error';
    let text = translate(tokens.common.words.no);
    if (item) {
      status = 'success';
      text = translate(tokens.common.words.yes);
    }
    return <SeverityPill color={status}>{text}</SeverityPill>;
  };

  const propertyItems = [
    {
      label: translate(tokens.common.fields.name),
      value: recipe.name,
    },
    {
      label: translate(tokens.satisfactory.pages.recipes.machine),
      value: machines[recipe.producedIn]?.name,
    },
    {
      label: translate(tokens.satisfactory.pages.recipes.slug),
      value: recipe.slug,
    },
    {
      label: 'Alternate',
      value: getSeverityPill(recipe.isAlternate),
    },

    {
      label: 'Tier',
      value:
        schematics?.find((schematic) =>
          schematic.unlocks?.recipes?.find((r) => r === recipe.className)
        )?.techTier || '',
    },
  ];

  const chart = recipeChart(recipe, getSatisfactoryData('items'), machines);

  return (
    <Stack>
      <Card>
        <CardHeader title={translate(tokens.satisfactory.pages.recipes.info)} />
        <CardContent>
          {/* <Stack spacing={3} maxWidth={500}> */}
          <PropertyListTemplate items={propertyItems} />
          {/* </Stack> */}
          <Stack
            spacing={3}
            sx={{
              mt: 5,
            }}
            //maxWidth={500}
          >
            <Mermaid chart={chart} />
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

SatisfactoryRecipeDetail.propTypes = {
  recipe: PropTypes.object.isRequired,
};
