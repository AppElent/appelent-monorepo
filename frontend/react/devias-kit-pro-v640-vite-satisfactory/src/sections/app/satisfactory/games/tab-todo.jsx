import TodoCard from './todo/todo-card';

const TabTodo = ({
  todos,
  addTodo,
  removeTodo,
  setTodo,
  players,
  formikNamespace,
  handleChange,
}) => {
  return (
    <TodoCard
      todos={todos}
      addTodo={addTodo}
      removeTodo={removeTodo}
      setTodo={setTodo}
      players={players}
      formikNamespace={formikNamespace}
      handleChange={handleChange}
    />
  );
};

export default TabTodo;
