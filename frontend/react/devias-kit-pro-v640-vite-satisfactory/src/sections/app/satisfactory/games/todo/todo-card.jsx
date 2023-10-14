import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Divider,
  Grid,
  MenuItem,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { GridDeleteIcon } from '@mui/x-data-grid';
import { nanoid } from 'nanoid';

const TodoCard = ({ todos, addTodo, removeTodo, players, formikNamespace, handleChange }) => {
  const todosSorted = [...todos.filter((todo) => !todo.done), ...todos.filter((todo) => todo.done)];

  return (
    <Card>
      <CardHeader
        title="To do"
        action={
          <Button
            variant="contained"
            onClick={() => {
              const template = { id: nanoid(), description: '', assigned_to: '', done: false };
              addTodo(template);
            }}
          >
            Add
          </Button>
        }
      />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Done</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Assigned to</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {todosSorted?.map((todo, index) => {
                return (
                  <TableRow key={todo.id}>
                    <TableCell width={50}>
                      <Checkbox
                        name={`${formikNamespace}.${index}.done`}
                        checked={todo.done}
                        onChange={handleChange}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        label="Description"
                        sx={{ flexGrow: 1, width: '100%' }}
                        name={`${formikNamespace}.${index}.description`}
                        onChange={handleChange}
                        value={todo.description}
                      />
                    </TableCell>
                    <TableCell width={150}>
                      <TextField
                        label="Assigned to"
                        sx={{ flexGrow: 1, width: 200 }}
                        select
                        name={`${formikNamespace}.${index}.assigned_to`}
                        onChange={handleChange}
                        value={todo.assigned_to || ''}
                      >
                        {players?.map((player) => (
                          <MenuItem
                            key={player.uid}
                            value={player.uid}
                          >
                            {player.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          removeTodo(todo.id);
                        }}
                      >
                        <GridDeleteIcon>Delete</GridDeleteIcon>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default TodoCard;
