import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper 
} from "@mui/material";

import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender, 
  createColumnHelper 
} from "@tanstack/react-table";

import { useTodoContext } from "../context/todoContext"
import TodoDialog from "../components/TodoDialog";
import ControlPanel from "../components/ControlPanel";
import type { Todo } from "../types/types";


const AdminScreen = () => {
  const { filteredTodos, deleteTodo, setEditingTodoId, handleOpenDialog } = useTodoContext();

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