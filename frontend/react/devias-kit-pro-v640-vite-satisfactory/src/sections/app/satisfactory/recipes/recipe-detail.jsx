import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Stack, useMediaQuery } from '@mui/material';
import { SeverityPill } from 'src/components/severity-pill';
import { PropertyListTemplate } from 'src/components/app/property-list-template';
import { tokens } from 'src/locales/tokens';

export const SatisfactoryRecipeDetail = ({ recipe, translate }) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
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
      value: recipe.producedIn,
    },
    {
      label: translate(tokens.satisfactory.pages.products.stackSize),
      value: recipe.slug,
    },
    {
      label: 'Active',
      value: getSeverityPill(true),
    },
  ];

  return (
    <Stack>
      <Card>
        <CardHeader title={translate(tokens.satisfactory.pages.recipes.info)} />
        <CardContent>
          {/* <Stack spacing={3} maxWidth={500}> */}
          <PropertyListTemplate items={propertyItems} />
          {/* </Stack> */}
          {/* <Stack spacing={3} maxWidth={500}> */}

          {/* </Stack> */}
        </CardContent>
      </Card>
    </Stack>
  );
};

SatisfactoryRecipeDetail.propTypes = {
  recipe: PropTypes.object.isRequired,
  translate: PropTypes.func,
};
