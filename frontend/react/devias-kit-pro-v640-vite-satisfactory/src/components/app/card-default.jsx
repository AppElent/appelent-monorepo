import PropTypes from 'prop-types';
import { Card, CardContent, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';

export const CardDefault = (props) => {
  return (
    <Stack
      spacing={4}
      {...props}
    >
      <Card>
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">{props.title}</Typography>
            </Grid>
            <Grid
              xs={12}
              md={8}
            >
              <Stack spacing={3}>
                {/* <Stack alignItems="center" direction="row" spacing={2}>
                  <TextField
                    label="Full Name"
                    sx={{ flexGrow: 1 }}
                    name="name"
                    onChange={formikUsername.handleChange}
                    value={formikUsername.values.name}
                  />
                  <Button
                    color="inherit"
                    size="small"
                    onClick={formikUsername.handleSubmit}
                  >
                    Save
                  </Button>
                </Stack> */}
                {props.children}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};

CardDefault.propTypes = {
  children: PropTypes.any,
  title: PropTypes.string.isRequired,
};
