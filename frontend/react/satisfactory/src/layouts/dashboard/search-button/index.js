import { useCallback, useState } from "react";

export const SearchButton = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpen = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpenDialog(false);
  }, []);

  return (
    <>
      {/* <Tooltip title="Search">
        <IconButton onClick={handleOpen}>
          <SvgIcon>
            <SearchMdIcon />
          </SvgIcon>
        </IconButton>
      </Tooltip>
      <SearchDialog
        onClose={handleClose}
        open={openDialog}
      /> */}
    </>
  );
};
