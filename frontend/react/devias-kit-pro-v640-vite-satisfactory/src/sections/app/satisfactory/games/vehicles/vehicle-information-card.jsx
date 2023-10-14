import { Box, Button, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useTranslate } from '@refinedev/core';
import { useConfirm } from 'material-ui-confirm';
import { nanoid } from 'nanoid';
import { CardDefault } from 'src/components/app/card-default';
import { VEHICLE_IMAGES, VEHICLE_TYPES } from 'src/custom/libs/satisfactory/static';
import { tokens } from 'src/locales/tokens';

const VehicleInformationCard = ({
  vehicle,
  setVehicle,
  handleChange,
  errors,
  formikNamespace,
  setModalOpen,
  deleteVehicle,
  isSaved,
}) => {
  const translate = useTranslate();
  const confirm = useConfirm();

  let freightCarNumber = 0;

  return (
    <CardDefault title="Information">
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
          value={vehicle.name || ''}
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
          value={vehicle.description || ''}
        />
      </Stack>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
      >
        <TextField
          label="Type"
          sx={{ flexGrow: 1 }}
          select
          disabled={isSaved}
          name={`${formikNamespace}.type`}
          //onChange={handleChange}
          onChange={(e) => {
            console.log(e.target.value);
            const type = e.target.value === 'train' ? 'locomotive' : '';
            const car = { id: nanoid(), type };
            setVehicle(vehicle.id, { ...vehicle, type: e.target.value, cars: [car], stops: [] });
            // let car = { id: nanoid(), type: e.target.valaue };
            // console.log(selectedVehicle);

            // if (e.target.value === 'train') {
            //   console.log('train');
            // } else {
            //   console.log('not train');
            // }
          }}
          value={vehicle.type || ''}
        >
          {VEHICLE_TYPES.map((option) => (
            <MenuItem
              key={option.key}
              value={option.key}
            >
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack
        alignItems="center"
        direction="row"
        spacing={1}
        justifyContent={'space-between'}
      >
        <Typography>Vehicle configuration:</Typography>
        {vehicle.type === 'train' && (
          <Button onClick={() => setModalOpen(true)}>Change configuration</Button>
        )}
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        divider={
          <Divider
            orientation="vertical"
            flexItem
          />
        }
      >
        {vehicle.type !== 'train' && (
          <Box
            sx={{
              width: 100,
              '& img': {
                width: '100%',
              },
            }}
          >
            <img src={VEHICLE_IMAGES[vehicle.type]} />
          </Box>
        )}
        {vehicle.type === 'train' &&
          vehicle?.cars?.map((car) => {
            if (car.type !== 'locomotive') freightCarNumber++;
            return (
              <Box
                sx={{
                  width: 100,
                  '& img': {
                    width: '100%',
                  },
                }}
                key={car.id}
              >
                <Box textAlign={'center'}>
                  <img src={VEHICLE_IMAGES[car.type]} />
                  {car.type !== 'locomotive' && <Box>Freight car {freightCarNumber}</Box>}
                </Box>
              </Box>
            );
          })}
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
              confirm().then(() => {
                deleteVehicle(vehicle.id);
                // const currentStations = formik.values?.transport?.vehicles
                //   ? [...formik.values.transport.vehicles]
                //   : [];
                // formik.setFieldValue(
                //   'transport.vehicles',
                //   currentStations.filter((item) => item.id !== selectedVehicle.id)
                // );
              });
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

export default VehicleInformationCard;
