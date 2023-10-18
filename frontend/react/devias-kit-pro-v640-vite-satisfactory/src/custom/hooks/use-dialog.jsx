import { Paper } from '@mui/material';
import { useState } from 'react';
import Draggable from 'react-draggable';

/**
 *
 * @param props
 */
function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const useDialog = (initialMode = false, initialData, options) => {
  const [modalOpen, setModalOpen] = useState(initialMode);
  const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(300);
  const [data, setData] = useState(initialData);
  const setDialogOpen = (state) => {
    setModalOpen(state);
    if (state === false) {
      setData(undefined);
    }
  };

  const onResize = (event) => {
    setHeight(height + event.movementY);
    setWidth(width + event.movementX);
  };

  return {
    open,
    data,
    setData,
    setDialogOpen,
    PaperComponent,
    resizable: { height, width, setHeight, setWidth, onResize },
  };
};

export default useDialog;
