import PropTypes from 'prop-types';
import { Button, Checkbox, Stack, TextField } from '@mui/material';
import { useTranslate } from '@refinedev/core';
import { CardDefault } from 'src/components/app/card-default';
import { tokens } from 'src/locales/tokens';

const FactoryInformationCard = ({
  factory,
  deleteFactory,
  errors,
  formikNamespace,
  handleChange,
}) => {
  const translate = useTranslate();

  return (
    <CardDefault title="Factory information">
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <TextField
          label={translate(tokens.common.fields.name)}
          sx={{ flexGrow: 1 }}
          name={`${formikNamespace}.name`}
          onChange={handleChange}
          required
          error={errors?.name}
          helperText={errors?.name}
          value={factory.name || ''}
        />
      </Stack>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <TextField
          label={translate(tokens.common.fields.description)}
          sx={{ flexGrow: 1 }}
          multiline
          minRows={3}
          name={`${formikNamespace}.description`}
          onChange={handleChange}
          value={factory.description || ''}
        />
      </Stack>

      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <Checkbox
          value={factory.finished || false}
          onChange={handleChange}
          name={`${formikNamespace}.finished`}
          sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
        />{' '}
        {translate(tokens.satisfactory.pages.games.factories.finished)}
      </Stack>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <Checkbox
          value={factory.checked || false}
          onChange={handleChange}
          name={`${formikNamespace}.checked`}
          sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
        />{' '}
        {translate(tokens.satisfactory.pages.games.factories.checked)}
      </Stack>
      <Stack
        justifyContent="flex-end"
        direction="row"
      >
        <div>
          <Button
            color="error"
            size="small"
            onClick={() => {
              deleteFactory(factory.id);
            }}
            variant="contained"
          >
            Delete
          </Button>
        </div>
      </Stack>
    </CardDefault>
  );
};

FactoryInformationCard.propTypes = {
  deleteFactory: PropTypes.func,
  formik: PropTypes.any,
  selectedFactory: PropTypes.object,
  selectedFactoryIndex: PropTypes.number,
};

export default FactoryInformationCard;
