import { 
  IconButton,
  Table, TableBody, TableCell, 
  TableHead, TableRow 
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import DoneIcon from '@mui/icons-material/Done';

import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  createColumnHelper 
} from "@tanstack/react-table";

import { useTodoContext } from "../context/todoContext"
import type { Todo } from "../types/types";

import TodoDialog from "../components/TodoDialog";
import ControlPanel from "../components/ControlPanel";


const AdminScreen = () => {
  const { filteredTodos, deleteTodo, openEditDialog, toggleTodo } = useTodoContext();

  const columnHelper = createColumnHelper<Todo>();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('subject', {
      header: 'Subject',
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
    }),
    columnHelper.accessor('date', { 
      header: 'Due Date',
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
  });

  return (
    <>
      <ControlPanel />

      <Table>
        <TableHead>

          {table.getHeaderGroups().map(headersGroup => (

            <TableRow key={headersGroup.id}>
              
              {headersGroup.headers.map(header => (
                <TableCell key={header.id}>
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

            <TableRow key={row.id}>
              
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

      <TodoDialog />
    
    </>
  )
}

export default AdminScreen