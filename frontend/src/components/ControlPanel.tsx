import { Box, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import SearcField from './SearcField';

interface Props {
  handleOpenDialog: () => void;
}

const ControlPanel = ({ handleOpenDialog }: Props ) => {

  return (
    <Box sx={{ mb: 4, mt: 5, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
      <Stack direction="row" spacing={2}>

        <SearcField />

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            borderRadius: 3,
            px: 3, 
            whiteSpace: 'nowrap', 
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            width: '150px',
          }}
        >
          add Task
        </Button>

      </Stack>
    </Box>
  )
}

export default ControlPanel