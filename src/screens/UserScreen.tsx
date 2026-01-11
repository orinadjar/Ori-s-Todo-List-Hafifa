import { useOutletContext } from 'react-router-dom';

import ControlPanel from '../components/ControlPanel';
import TodoList from '../components/TodoList';
import TodoDialog from '../components/TodoDialog';
import { Box } from '@mui/material';

import MapContainer from '../components/Map/MapContainer';
import BaseLayer from '../components/Map/Layers/BaseLayer.jsx';
import TodosLayer from '../components/Map/Layers/TodosLayer.js';

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
        <Box sx={{ height: '100vh', maxHeight: '100vh',  display: 'flex' }}>

          <Box sx={{ flex: 1, mr: 1, border: '1px solid #ddd', borderRadius: '8px', overflowY: 'auto', '&::-webkit-scrollbar': { width: '0px' } }}>
            <ControlPanel  handleOpenDialog={handleOpenDialog}/>

            <TodoList openEditDialog={openEditDialog}/>

            <TodoDialog handleCloseDialog={handleCloseDialog} isDialogOpen={isDialogOpen} editingTodoId={editingTodoId} />
          </Box>

          <Box sx={{ flex: 1, border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', height: '100%', position: 'relative' }}>
            <MapContainer>
              <BaseLayer />
              <TodosLayer />
            </MapContainer>
          </Box>

        </Box>
      </>
    )
}

export default UserScreen