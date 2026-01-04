import './App.css'

import CssBaseline from '@mui/material/CssBaseline';

import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import TodoList from './components/TodoList';
import TodoDialog from './components/TodoDialog';

function App() {
  return (
    <>
      <CssBaseline />

      <Header />
      
      <ControlPanel />

      <TodoList />

      <TodoDialog />
    </>
  )
}

export default App
