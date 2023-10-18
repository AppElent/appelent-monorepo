import {
  Avatar,
  Box,
  Button,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  MenuItem,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import Camera01Icon from '@untitled-ui/icons-react/build/esm/Camera01';
import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import { useFormik } from 'formik';

import { CardDefault } from 'src/components/app/card-default';
import { useMounted } from 'src/hooks/use-mounted';
import { generateName } from 'src/custom/libs/random-name-generator';

const BasicDetailsCard = ({ user, updateProfile, profilePublic, setProfilePublic }) => {
  const avatar = user.avatar || '';
  const isMounted = useMounted();
  console.log(user);
  const formik = useFormik({
    initialValues: { name: user.displayName, backend: '' },
    //validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        return await updateProfile(user, { displayName: values.name }); //user.update({ displayName: values.name });
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  const generateRandomName = () => {
    const generatedName = generateName();
    formik.setFieldValue('name', generatedName);
  };

  const email = user.email || '';

  return (
    <CardDefault title="Basic details">
      <Stack spacing={3}>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <Box
            sx={{
              borderColor: 'neutral.300',
              borderRadius: '50%',
              borderStyle: 'dashed',
              borderWidth: 1,
              p: '4px',
            }}
          >
            <Box
              sx={{
                borderRadius: '50%',
                height: '100%',
                width: '100%',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                  borderRadius: '50%',
                  color: 'common.white',
                  cursor: 'pointer',
                  display: 'flex',
                  height: '100%',
                  justifyContent: 'center',
                  left: 0,
                  opacity: 0,
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  zIndex: 1,
                  '&:hover': {
                    opacity: 1,
                  },
                }}
              >
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <SvgIcon color="inherit">
                    <Camera01Icon />
                  </SvgIcon>
                  <Typography
                    color="inherit"
                    variant="subtitle2"
                    sx={{ fontWeight: 700 }}
                  >
                    Select
                  </Typography>
                </Stack>
              </Box>
              <Avatar
                src={avatar}
                sx={{
                  height: 100,
                  width: 100,
                }}
              >
                <SvgIcon>
                  <User01Icon />
                </SvgIcon>
              </Avatar>
            </Box>
          </Box>
          <Button
            color="inherit"
            size="small"
          >
            Change
          </Button>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <TextField
            defaultValue={user.uid}
            disabled={true}
            label="User ID"
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                borderStyle: 'dashed',
              },
            }}
          />
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <TextField
            label="Displayname"
            sx={{ flexGrow: 1 }}
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          <Button
            color="inherit"
            size="small"
            onClick={generateRandomName}
          >
            Generate
          </Button>
          <Button
            color="inherit"
            size="small"
            onClick={formik.handleSubmit}
          >
            Save
          </Button>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <TextField
            defaultValue={email}
            disabled={true}
            label="Email Address"
            required
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                borderStyle: 'dashed',
              },
            }}
          />
        </Stack>
      </Stack>
    </CardDefault>
  );
};

export default BasicDetailsCard;
