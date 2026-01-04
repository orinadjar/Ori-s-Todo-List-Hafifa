import { useLocation } from 'react-router-dom';

import { AppBar, Toolbar, Typography, Box, Chip, Tab, Tabs } from '@mui/material';

import { useTodoContext } from '../context/todoContext';
import { Link } from 'react-router-dom';

const Header = () => {

  const { filteredTodos } = useTodoContext();
  
  const total = filteredTodos.length;
  const completed = filteredTodos.filter(t => t.isCompleted).length;

  const location = useLocation();

  return (
    <AppBar position="static" sx={{ bgcolor: 'white', color: 'black', boxShadow: 3, mb: 4 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Ori's Todo
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tabs value={location.pathname} textColor='primary' indicatorColor='primary'>
            <Tab label="Todos" value='/' component={Link} to='/' sx={{ fontWeight: 'bold', textTransform: 'none' }}/>
            <Tab label="Admin" value='/admintab' component={Link} to='/admintab' sx={{ fontWeight: 'bold', textTransform: 'none' }}/>
          </Tabs>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip 
            label={`${completed} / ${total} Done`} 
            color="primary" 
            variant="outlined" 
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header;