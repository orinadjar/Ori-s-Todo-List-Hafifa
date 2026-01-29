import { useEffect, useMemo } from "react";

import {
  IconButton,
  Table, TableBody, TableCell,
  TableHead, TableRow, Box,
  Typography,
  CircularProgress,
  TableContainer
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import DoneIcon from '@mui/icons-material/Done';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
} from "@tanstack/react-table";

import { useOutletContext } from 'react-router-dom';

import type { Todo } from "../types/types";

import TodoDialog from "../components/TodoDialog";
import ControlPanel from "../components/ControlPanel";
import { useTodos } from "../hooks/useTodos";

import { useVirtualization } from '../hooks/useVirtualization'

import { useAtomValue } from "jotai";
import { debouncedSearchAtom } from "../atoms/todoAtoms";

interface AdminOutletContext {
  openEditDialog: (id: string) => void;
  handleOpenDialog: () => void;
  isDialogOpen: boolean;
  editingTodoId: string | null;
  handleCloseDialog: () => void;
}

const AdminScreen = () => {

  const searchTerm = useAtomValue(debouncedSearchAtom);

  const { todos, deleteTodo, toggleTodo, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading, error, status } = useTodos(searchTerm);

  const { openEditDialog, handleOpenDialog, isDialogOpen, editingTodoId, handleCloseDialog } = useOutletContext<AdminOutletContext>();

  const columnHelper = createColumnHelper<Todo>();

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: 'Name',
      enableSorting: false,
    }),
    columnHelper.accessor('subject', {
      header: 'Subject',
      enableSorting: false,
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
    }),
    columnHelper.accessor('date', {
      header: 'Due Date',
      enableSorting: false,
      cell: info => {
        return new Date(info.getValue()).toLocaleDateString();
      }
    }),
    columnHelper.accessor('isCompleted', {
      header: 'Completed',
      cell: info => info.getValue() ? 'Yes' : 'No',
    }),
    columnHelper.display({
      id: 'location',
      header: 'Location',
      cell: ({ row }) => {
        const { lat, lng } = row.original;

        if (lat === null || lng === null) return '-';

        return (
          <Typography variant="body2">
            {row.original.geometryType === 'Point' ? `${lat.toFixed(2)}, ${lng.toFixed(2)}` : `${row.original.coordinates?.toString().substring(0, 15)}....`}
          </Typography>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => {
        const todo = row.original;

        return (
          <>
            <IconButton onClick={() => deleteTodo(todo.id)}>
              <DeleteIcon color='error' />
            </IconButton>

            <IconButton onClick={() => openEditDialog(todo.id)}>
              <EditIcon color='primary' />
            </IconButton>

            <Checkbox
              checked={todo.isCompleted}
              onChange={() => toggleTodo(todo.id)}
              color='success'
              icon={<DoneIcon />}
              checkedIcon={<DoneIcon />}
            />
          </>
        )
      }
    })
  ], [deleteTodo, toggleTodo, openEditDialog]);

  const table = useReactTable({
    data: todos || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    autoResetPageIndex: false,
  });

  const { parentRef, rowVirtualizer, virtualRows } = useVirtualization(todos.length, hasNextPage, isFetchingNextPage, fetchNextPage, 70)

  if (isLoading) return <CircularProgress />

  if (error) return 'An error has occurred while fetching todos...' + error.message;

  return (
    <>
      {status === 'pending' ? <CircularProgress /> : status === 'error' ? 'An error has occured while fetching the todos' :
        <>
          <ControlPanel handleOpenDialog={handleOpenDialog} />

          <TableContainer ref={parentRef} sx={{ maxHeight: '85vh', overflow: 'auto', position: 'relative' }}>
            <Table stickyHeader>

              <TableHead>

                {table.getHeaderGroups().map(headersGroup => (

                  <TableRow key={headersGroup.id}>

                    {headersGroup.headers.map(header => (
                      <TableCell key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        sx={{
                          cursor: header.column.getCanSort() ? 'pointer' : 'default', userSelect: 'none',
                          '&:hover': header.column.getCanSort() ? { backgroundColor: 'rgba(213, 231, 233, 0.4)' } : undefined
                        }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>

              <TableBody sx={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>

                {virtualRows.map(virtualRow => (

                  <TableRow key={virtualRow.key}
                    sx={{ position: 'absolute', width: '100%', height: `${virtualRow.size}px`, display: 'flex', transform: `translateY(${virtualRow.start}px)`, background: table.getRowModel().rows[virtualRow.index].original.isCompleted ? '#e8f5e9ff' : '#f8ddddff', 
                          '&:hover': { backgroundColor: 'rgba(213, 231, 233, 0.4)',  } }}>

                    {table.getRowModel().rows[virtualRow.index].getVisibleCells().map(cell => (
                      <TableCell key={cell.id} sx={{ minWidth: 0, flex: 1 }}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </TableContainer>

          <TodoDialog isDialogOpen={isDialogOpen} editingTodoId={editingTodoId} handleCloseDialog={handleCloseDialog} />
        </>
      }
    </>
  )
}

export default AdminScreen