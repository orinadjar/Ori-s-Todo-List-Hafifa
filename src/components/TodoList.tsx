import { Grid, Typography } from "@mui/material"

import { useTodoContext } from "../context/todoContext"
import TodoItem from "./TodoItem"

const TodoList = () => {
  const { filteredTodos } = useTodoContext();

  return (
    <>
      <Grid container spacing={3} alignItems="stretch" justifyContent="center">
        {filteredTodos.length === 0 ? (
          <Grid size={{ xs: 2, sm: 4, md: 6, lg: 120 }}>
            <Typography variant="h6" align="center">
              No todos found.
            </Typography>
          </Grid>
        ) : (
          filteredTodos.map((todo) => (
            <Grid size={{ xs: 2, sm: 3, md: 3, lg: 3 }} key={todo.id}>
              <TodoItem todo={todo} />
            </Grid>
          ))
        )}
      </Grid>
    </>
  )
}

export default TodoList;