import { useState } from 'react';
import './App.css'

import CssBaseline from '@mui/material/CssBaseline';

import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import TodoList from './components/TodoList';
import TodoDialog from './components/TodoDialog';

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  const openEditDialog = (id: string) => {
          setEditingTodoId(id);
          setIsDialogOpen(true);
  }

  const handleOpenDialog = () => {
      setEditingTodoId(null);
      setIsDialogOpen(true);
  }

  const handleCloseDialog = () => {
      setIsDialogOpen(false);
      setEditingTodoId(null);
  }

  return (
    <>
      <CssBaseline />

      <Header />
      
      <ControlPanel handleOpenDialog={handleOpenDialog}/>

      <TodoList openEditDialog={openEditDialog}/>

      <TodoDialog handleCloseDialog={handleCloseDialog} isDialogOpen={isDialogOpen} editingTodoId={editingTodoId} />
    </>
  )
}

export default App
