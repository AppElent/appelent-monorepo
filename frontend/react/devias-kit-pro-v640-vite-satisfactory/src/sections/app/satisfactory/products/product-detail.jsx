import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material';
import { SeverityPill } from 'src/components/severity-pill';
import { PropertyListTemplate } from 'src/components/app/property-list-template';
import { tokens } from 'src/locales/tokens';
import {
  getSatisfactoryData,
  getSatisfactoryDataArray,
  recipeChart,
} from 'src/custom/libs/satisfactory';
import Mermaid from 'src/custom/libs/mermaid';

export const SatisfactoryProductDetail = ({ product, translate }) => {
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
      value: product.name,
    },
    {
      label: translate(tokens.common.fields.description),
      value: product.description,
    },
    {
      label: translate(tokens.satisfactory.pages.products.stackSize),
      value: product.stackSize?.toString(),
    },
    {
      label: 'Sink points',
      value: product.sinkPoints?.toString(),
    },
    {
      label: 'Is Fuel',
      value: getSeverityPill(product.isFuel),
    },
  ];
  const propertyItems2 = [
    {
      label: 'Is Equipment',
      value: getSeverityPill(product.isEquipment),
    },
    {
      label: 'Is Fluid',
      value: getSeverityPill(product.isFluid),
    },
    {
      label: 'Is Resource',
      value: getSeverityPill(product.resource != undefined),
    },
  ];

  const recipe = getSatisfactoryDataArray('recipes').find((recipe) =>
    recipe.products.find((p) => p.itemClass === product.className)
  );

  console.log(recipe);
  const machines = getSatisfactoryData('buildables');
  const chart = recipeChart(recipe, getSatisfactoryData('items'), machines);

  return (
    <Stack>
      <Card>
        <CardHeader title={translate(tokens.satisfactory.pages.products.info)} />
        <CardContent>
          {/* <Stack spacing={3} maxWidth={500}> */}
          <PropertyListTemplate items={propertyItems} />
          {/* </Stack> */}
          {/* <Stack spacing={3} maxWidth={500}> */}
          <PropertyListTemplate items={propertyItems2} />
          {/* </Stack> */}
          <Stack
            spacing={3}
            sx={{
              mt: 5,
            }}
            //maxWidth={500}
          >
            {recipe && (
              <>
                <Typography variant="subtitle2">Default recipe:</Typography>
                <Mermaid chart={chart} />
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

SatisfactoryProductDetail.propTypes = {
  product: PropTypes.object.isRequired,
  translate: PropTypes.func,
};
