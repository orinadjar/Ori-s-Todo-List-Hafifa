import { useState } from 'react';
import './App.css'

import CssBaseline from '@mui/material/CssBaseline';

import { Outlet } from 'react-router-dom';

import Header from './components/Header';

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
      
      <Outlet />
    </>
  )
}

export default App
