import { 
  IconButton,
  Table, TableBody, TableCell, 
  TableHead, TableRow , Box,
  Button,
  Typography
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
  getPaginationRowModel
} from "@tanstack/react-table";

import { useOutletContext } from 'react-router-dom';

import { useTodos } from "../context/todoContext"
import type { Todo } from "../types/types";

import TodoDialog from "../components/TodoDialog";
import ControlPanel from "../components/ControlPanel";

interface AdminOutletContext {
  openEditDialog: (id: string) => void;
  handleOpenDialog: () => void;
  isDialogOpen: boolean;
  editingTodoId: string | null;
  handleCloseDialog: () => void;
}

const AdminScreen = () => {
  const { filteredTodos, deleteTodo, toggleTodo } = useTodos();
  const { openEditDialog, handleOpenDialog, isDialogOpen, editingTodoId, handleCloseDialog } = useOutletContext<AdminOutletContext>();

  const columnHelper = createColumnHelper<Todo>();

  const columns = [
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
  ];

  const table = useReactTable({
    data: filteredTodos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    }
  });

  return (
    <>
      <ControlPanel handleOpenDialog={handleOpenDialog}/>

      <Box sx={{ display: 'flex',  justifyContent: 'space-between', width: '100%' }}>

          <Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}
            variant="contained"
            color="primary"
            sx={{ borderRadius: '10px' }}>
            Previous page
          </Button>

          <Typography sx={{ fontWeight: 'bold',justifyContent: 'end' }}>
            page { table.getState().pagination.pageIndex + 1 } of { table.getPageCount() }
          </Typography>

          <Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}
            variant="contained"
            color="primary"
            sx={{ borderRadius: '10px' }}>
            Next page
          </Button>

      </Box>

      <Table>
        <TableHead>

          {table.getHeaderGroups().map(headersGroup => (

            <TableRow key={headersGroup.id}>
              
              {headersGroup.headers.map(header => (
                <TableCell key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  sx={{ cursor: header.column.getCanSort() ? 'pointer' : 'default', userSelect: 'none' }}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableCell>
              ))}

            </TableRow>
          ))}
      
        </TableHead>

        <TableBody>

          {table.getRowModel().rows.map(row => (

            <TableRow key={row.id}
            sx={{ backgroundColor: row.original.isCompleted ? '#e8f5e9' : '#f8ddddff' }}>
              
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
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

      <TodoDialog isDialogOpen={isDialogOpen} editingTodoId={editingTodoId} handleCloseDialog={handleCloseDialog}/>
    
    </>
  )
}

export default AdminScreen