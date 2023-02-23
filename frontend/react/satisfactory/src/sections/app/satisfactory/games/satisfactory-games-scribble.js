import PropTypes from "prop-types";
import { Button, Stack } from "@mui/material";

import { QuillEditor } from "components/quill-editor";
import { Box } from "@mui/system";
import { tokens } from "locales/tokens";

export const SatisfactoryGamesScribble = (props) => {
  const { formik, game, translate } = props;

  console.log(formik.values.scribble);
  return (
    <Stack spacing={1}>
      {/* <Box sx={{ borderBottom: 1, borderColor: "primary.main" }}> */}
      <QuillEditor
        placeholder={translate(
          tokens.satisfactory.pages.games.scribble.helperText
        )}
        sx={{
          flexGrow: 1,
          minHeight: "60vh",
        }}
        name="scribble"
        value={formik.values.scribble}
        onChange={(v) => {
          console.log(v);
          if (v === formik.values.scribble) {
          } else {
            formik.setFieldValue("scribble", v);
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
  game: PropTypes.object.isRequired,
};
