import './App.css'

import CssBaseline from '@mui/material/CssBaseline';

import { Outlet } from 'react-router-dom';

import Header from './components/Header';

function App() {
  return (
    <>
      <CssBaseline />

      <Header />
      
      <Outlet />
    </>
  )
}

export default App
