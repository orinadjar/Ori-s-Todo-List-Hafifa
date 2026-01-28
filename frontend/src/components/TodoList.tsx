import { Grid, Typography, CircularProgress, Box } from "@mui/material"

import TodoItem from "./TodoItem"

import { useAtomValue } from "jotai";

import { debouncedSearchAtom } from "../atoms/todoAtoms";

import { useTodos } from "../hooks/useTodos";

import { useInView } from 'react-intersection-observer';
import { useEffect } from "react";

interface Props {
  openEditDialog: (id: string) => void;
}

const TodoList = ({ openEditDialog }: Props) => {

  const searchTerm = useAtomValue(debouncedSearchAtom);

  const { todos, isLoading, error, status, fetchNextPage, hasNextPage } = useTodos(searchTerm);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (isLoading) return <CircularProgress />

  if (error) return 'An error has occurred while fetching todos...' + error.message;
  return (
    <>
      {status === 'pending' ? <CircularProgress /> : status === 'error' ? 'An error has occured while fetching the todos' :
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

          <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            {hasNextPage && inView ? <CircularProgress /> : <Typography variant="body2" color="textSecondary">No more todos to load.</Typography>}
          </Box>
        </>
      }
    </>
  )
}

export default TodoList;