import { Button, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CardDefault } from 'src/components/app/card-default';
import { useMounted } from 'src/hooks/use-mounted';
import { useTranslate } from '@refinedev/core';
import { tokens } from 'src/locales/tokens';

const ChangePasswordCard = ({ updatePassword }) => {
  const isMounted = useMounted();
  const translate = useTranslate();
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

  return (
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
            }}
          />
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
  );
};

export default ChangePasswordCard;
