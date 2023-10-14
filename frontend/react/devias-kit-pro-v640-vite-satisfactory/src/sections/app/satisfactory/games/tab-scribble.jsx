import PropTypes from 'prop-types';
import { Stack } from '@mui/material';

import { QuillEditor } from 'src/components/quill-editor';
import { tokens } from 'src/locales/tokens';
import { useTranslate } from '@refinedev/core';

const TabScribble = (props) => {
  const translate = useTranslate();
  const { formik } = props;

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

TabScribble.propTypes = {
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func,
    values: PropTypes.shape({
      scribble: PropTypes.any,
    }),
  }),
  game: PropTypes.object.isRequired,
};

export default TabScribble;
