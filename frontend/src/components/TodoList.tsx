import { Grid, Typography, CircularProgress, Box } from "@mui/material"

import TodoItem from "./TodoItem"

import { useAtomValue } from "jotai";

import { debouncedSearchAtom } from "../atoms/todoAtoms";

import { useTodos } from "../hooks/useTodos";
import { useVirtualization } from "../hooks/useVirtualization";

interface Props {
  openEditDialog: (id: string) => void;
}

const TodoList = ({ openEditDialog }: Props) => {

  const searchTerm = useAtomValue(debouncedSearchAtom);

  const { todos, isLoading, error, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useTodos(searchTerm);

  const { parentRef, rowVirtualizer, virtualRows } = useVirtualization(Math.ceil(todos.length / 3), hasNextPage, isFetchingNextPage, fetchNextPage, 280);

  if (isLoading) return <CircularProgress />

  if (error) return 'An error has occurred while fetching todos...' + error.message;

  return (
    <>
      {status === 'pending' ? <CircularProgress /> : status === 'error' ? 'An error has occured while fetching the todos' :
        <>
          <Box ref={parentRef} style={{ overflow: 'auto', height: '85vh', position: 'relative', width: '100%' }}>
            {todos.length === 0 ? (
              <Grid size={{ xs: 2, sm: 4, md: 6, lg: 120 }}>
                <Typography variant="h6" align="center">
                  No todos found.
                </Typography>
              </Grid>
            ) :
              <Box sx={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>

                {virtualRows.map((virtualRow) => {
                  const startIndex = virtualRow.index * 3;
                  const rowTodos = todos.slice(startIndex, startIndex + 3);

                  return (
                    <Box key={virtualRow.key} sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${virtualRow.size}px`, transform: `translateY(${virtualRow.start}px)`}}>
                      <Grid container spacing={3} sx={{ width: '100%' }}>
                        {rowTodos.map((todo) => (
                          <Grid key={todo.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <TodoItem todo={todo} openEditDialog={openEditDialog} />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )
                })}
              </Box>
            }
          </Box>
        </>
      }
    </>
  )
}

export default TodoList;