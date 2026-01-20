import { Grid, Typography, CircularProgress } from "@mui/material"

import TodoItem from "./TodoItem"

import { useAtomValue } from "jotai";

import { debouncedSearchAtom } from "../atoms/todoAtoms";

import { useTodos } from "../hooks/useTodos";

interface Props {
  openEditDialog: (id: string) => void;
}

const TodoList = ({ openEditDialog }: Props) => {

  const searchTerm = useAtomValue(debouncedSearchAtom);

  const { todos, isLoading, error } = useTodos(searchTerm);

  if (isLoading) return <CircularProgress />

  if (error) return 'An error has occurred while fetching todos...' + error.message;
  return (
    <>
      <Grid container spacing={3} alignItems="stretch" justifyContent="center">
        {todos.length === 0 ? (
          <Grid size={{ xs: 2, sm: 4, md: 6, lg: 120 }}>
            <Typography variant="h6" align="center">
              No todos found.
            </Typography>
          </Grid>
        ) : (
          todos.map((todo) => (
            <Grid size={{ xs: 4, sm: 4, md: 4, lg: 4 }} key={todo.id}>
              <TodoItem todo={todo} openEditDialog={openEditDialog} />
            </Grid>
          ))
        )}
      </Grid>
    </>
  )
}

export default TodoList;