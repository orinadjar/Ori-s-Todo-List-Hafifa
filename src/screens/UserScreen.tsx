import { useOutletContext } from 'react-router-dom';

import ControlPanel from '../components/ControlPanel';
import TodoList from '../components/TodoList';
import TodoDialog from '../components/TodoDialog';
import { Box } from '@mui/material';

interface AdminOutletContext {
  openEditDialog: (id: string) => void;
  handleOpenDialog: () => void;
  isDialogOpen: boolean;
  editingTodoId: string | null;
  handleCloseDialog: () => void;
}

const UserScreen = () => {
    const { openEditDialog, handleOpenDialog, isDialogOpen, editingTodoId, handleCloseDialog } = useOutletContext<AdminOutletContext>();

    return (
      <>
        <Box sx={{ height: '100vh' }}>

          <ControlPanel  handleOpenDialog={handleOpenDialog}/>

          <TodoList openEditDialog={openEditDialog}/>

          <TodoDialog handleCloseDialog={handleCloseDialog} isDialogOpen={isDialogOpen} editingTodoId={editingTodoId} />
      
      </Box>
      </>
    )
}

export default UserScreen