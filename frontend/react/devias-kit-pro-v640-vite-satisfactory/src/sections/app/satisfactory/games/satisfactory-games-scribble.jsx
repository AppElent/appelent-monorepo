import PropTypes from 'prop-types';
import { Stack } from '@mui/material';

import { QuillEditor } from 'src/components/quill-editor';
import { tokens } from 'src/locales/tokens';

export const SatisfactoryGamesScribble = (props) => {
  const { formik, translate } = props;

  console.log(formik.values.scribble);
  return (
    <Stack spacing={1}>
      {/* <Box sx={{ borderBottom: 1, borderColor: "primary.main" }}> */}
      <QuillEditor
        placeholder={translate(tokens.satisfactory.pages.games.scribble.helperText)}
        sx={{
          flexGrow: 1,
          minHeight: '60vh',
        }}
        name="scribble"
        value={formik.values.scribble}
        onChange={(v) => {
          console.log(v);
          if (v !== formik.values.scribble) {
            formik.setFieldValue('scribble', v);
          }
        }}
      />
      {/* </Box> */}
      {/* <Button
        //color="inherit"
        disabled={!formik.dirty}
        size="small"
        onClick={formik.handleSubmit}
        sx={{ maxWidth: 50 }}
        variant="contained"
      >
        Save
      </Button> */}
    </Stack>
  );
};

SatisfactoryGamesScribble.propTypes = {
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func,
    values: PropTypes.shape({
      scribble: PropTypes.any,
    }),
  }),
  game: PropTypes.object.isRequired,
  translate: PropTypes.func,
};
