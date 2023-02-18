import PropTypes from "prop-types";
import {
  Button,
  Stack,
} from "@mui/material";



import { QuillEditor } from "components/quill-editor";

export const SatisfactoryGamesScribble = (props) => {
  const { formik, game } = props;
  return (
    <Stack spacing={4}>
      <QuillEditor
        placeholder="Make notes or write a love poem"
        sx={{
          border: "none",
          flexGrow: 1,
        }}
        value={formik.values.scribble}
        onChange={(v) => formik.setFieldValue("scribble", v)}
      />
      <Button
        //color="inherit"
        disabled={!formik.dirty}
        size="small"
        onClick={formik.handleSubmit}
        sx={{ maxWidth: 50 }}
        variant="contained"
      >
        Save
      </Button>
    </Stack>
  );
};

SatisfactoryGamesScribble.propTypes = {
  game: PropTypes.object.isRequired,
};
