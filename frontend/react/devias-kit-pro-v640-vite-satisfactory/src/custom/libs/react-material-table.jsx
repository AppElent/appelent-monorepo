import { Popover } from '@mui/material';

export const PopoverHeader = ({ column }) => {
  return <Popover>{column.columnDef.header}</Popover>;
};
