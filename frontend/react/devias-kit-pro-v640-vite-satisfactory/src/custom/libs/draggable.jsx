/* eslint-disable react/display-name */
import { TableBody, TableRow } from '@mui/material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
  ...draggableStyle,

  // ...(isDragging && {
  //   background: 'rgb(235,235,235)',
  // }),
});

export const DraggableComponent = (id, index) => (props) => {
  return (
    <Draggable
      draggableId={id}
      index={index}
    >
      {(provided, snapshot) => (
        <TableRow
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
          {...props}
        >
          {props.children}
        </TableRow>
      )}
    </Draggable>
  );
};

export const DroppableComponent = (onDragEnd) => (props) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId={'1'}
        direction="vertical"
      >
        {(provided) => {
          return (
            <TableBody
              ref={provided.innerRef}
              {...provided.droppableProps}
              {...props}
            >
              {props.children}
              {provided.placeholder}
            </TableBody>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const onDragEnd = (items, setItems) => (result) => {
  // dropped outside the list
  if (!result.destination) {
    return;
  }

  console.log(`dragEnd ${result.source.index} to  ${result.destination.index}`);
  const newItems = reorder(items, result.source.index, result.destination.index);

  setItems([...newItems]);
};

export const useDraggable = (items, setItems) => {
  return DroppableComponent(onDragEnd(items, setItems));
};
