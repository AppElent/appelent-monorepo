import PropTypes from 'prop-types';
import {
  Button,
  Stack,
  TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { tokens } from 'src/locales/tokens';
import { useTranslate } from '@refinedev/core';
import { useMounted } from 'src/hooks/use-mounted';
import { CardDefault } from 'src/components/app/card-default';

export const AccountSecuritySettings = (props) => {
  const { loginEvents, updatePassword } = props;
  const translate = useTranslate();
  const isMounted = useMounted();
  // const [isEditing, setIsEditing] = useState(false);
  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPasswordConfirmed: '',
      newPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('Password is required'),
      newPasswordConfirmed: Yup.string().oneOf(
        [Yup.ref('newPassword'), null],
        'Passwords must match'
      ),
      newPassword: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, helpers) => {
      try {
        await updatePassword(formik.values.oldPassword, formik.values.newPassword);
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

  // const handleEdit = useCallback(async () => {
  //   if (isEditing) {
  //     console.log('password', formik.values.newPassword);
  //     await updatePassword(formik.values.oldPassword, formik.values.newPassword);

  //     setIsEditing((prevState) => !prevState);
  //   } else {
  //     setIsEditing((prevState) => !prevState);
  //   }
  // }, [updatePassword, isEditing, formik]);

  return (
    <Stack spacing={4}>
      <CardDefault title="Change password">
        <Stack spacing={3}>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <TextField
              label="Old password"
              type="password"
              name="oldPassword"
              error={!!(formik.touched.oldPassword && formik.errors.oldPassword)}
              helperText={formik.touched.oldPassword && formik.errors.oldPassword}
              value={formik.values.oldPassword}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              sx={{
                flexGrow: 1,
                // ...(!isEditing && {
                //   '& .MuiOutlinedInput-notchedOutline': {
                //     borderStyle: 'dotted',
                //   },
                // }),
              }}
            />
          </Stack>

          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <TextField
              label="New password"
              type="password"
              name="newPassword"
              error={!!(formik.touched.newPassword && formik.errors.newPassword)}
              helperText={formik.touched.newPassword && formik.errors.newPassword}
              value={formik.values.newPassword}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              sx={{
                marginTop: 2,
                flexGrow: 1,
                // ...(!isEditing && {
                //   '& .MuiOutlinedInput-notchedOutline': {
                //     borderStyle: 'dotted',
                //   },
                // }),
              }}
            />
            {/* <Button
                    disabled={!formik.isValid}
                    onClick={handleEdit}
                  >
                    {isEditing ? 'Save' : 'Edit'}
                  </Button> */}
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <TextField
              label="Confirm new password"
              type="password"
              error={!!(formik.touched.newPasswordConfirmed && formik.errors.newPasswordConfirmed)}
              helperText={formik.touched.newPasswordConfirmed && formik.errors.newPasswordConfirmed}
              name="newPasswordConfirmed"
              value={formik.values.newPasswordConfirmed}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              sx={{
                marginTop: 2,
                flexGrow: 1,
                // ...(!isEditing && {
                //   '& .MuiOutlinedInput-notchedOutline': {
                //     borderStyle: 'dotted',
                //   },
                // }),
              }}
            />
            <Button
              disabled={!formik.isValid}
              onClick={formik.handleSubmit}
            >
              {translate(tokens.common.buttons.save)}
            </Button>
          </Stack>
        </Stack>
      </CardDefault>
      {/* <Card>
        <CardHeader title="Multi Factor Authentication" />
        <CardContent sx={{ pt: 0 }}>
          <Grid
            container
            spacing={4}
          >
            <Grid
              xs={12}
              sm={6}
            >
              <Card
                sx={{ height: '100%' }}
                variant="outlined"
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'block',
                      position: 'relative'
                    }}
                  >
                    <Box
                      sx={{
                        '&::before': {
                          backgroundColor: 'error.main',
                          borderRadius: '50%',
                          content: '""',
                          display: 'block',
                          height: 8,
                          left: 4,
                          position: 'absolute',
                          top: 7,
                          width: 8,
                          zIndex: 1
                        }
                      }}
                    >
                      <Typography
                        color="error"
                        sx={{ pl: 3 }}
                        variant="body2"
                      >
                        Off
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{ mt: 1 }}
                    variant="subtitle2"
                  >
                    Authenticator App
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                    variant="body2"
                  >
                    Use an authenticator app to generate one time security codes.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Button
                      endIcon={(
                        <SvgIcon>
                          <ArrowRightIcon />
                        </SvgIcon>
                      )}
                      variant="outlined"
                    >
                      Set Up
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              sm={6}
              xs={12}
            >
              <Card
                sx={{ height: '100%' }}
                variant="outlined"
              >
                <CardContent>
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        '&::before': {
                          backgroundColor: 'error.main',
                          borderRadius: '50%',
                          content: '""',
                          display: 'block',
                          height: 8,
                          left: 4,
                          position: 'absolute',
                          top: 7,
                          width: 8,
                          zIndex: 1
                        }
                      }}
                    >
                      <Typography
                        color="error"
                        sx={{ pl: 3 }}
                        variant="body2"
                      >
                        Off
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    sx={{ mt: 1 }}
                    variant="subtitle2"
                  >
                    Text Message
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                    variant="body2"
                  >
                    Use your mobile phone to receive security codes via SMS.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Button
                      endIcon={(
                        <SvgIcon>
                          <ArrowRightIcon />
                        </SvgIcon>
                      )}
                      variant="outlined"
                    >
                      Set Up
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card> */}
      {/* <Card>
        <CardHeader
          title="Login history"
          subheader="Your recent login activity"
        />
        <Scrollbar>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell>Login type</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Client</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loginEvents.map((event) => {
                const createdAt = format(event.createdAt, "HH:mm a MM/dd/yyyy");

                return (
                  <TableRow
                    key={event.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Typography variant="subtitle2">{event.type}</Typography>
                      <Typography variant="body2" color="body2">
                        on {createdAt}
                      </Typography>
                    </TableCell>
                    <TableCell>{event.ip}</TableCell>
                    <TableCell>{event.userAgent}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Scrollbar>
      </Card> */}
    </Stack>
  );
};

AccountSecuritySettings.propTypes = {
  loginEvents: PropTypes.array.isRequired,
  updatePassword: PropTypes.func,
};
