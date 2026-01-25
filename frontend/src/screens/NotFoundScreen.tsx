import { Button, Typography, Box } from "@mui/material"
import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
                404 - Page Not Found
                <br />
                Please click the button to get back
            </Typography>
            
            <Button variant="contained" component={Link} to="/"
                    sx={{
                    textDecoration: 'none', 
                    borderRadius: 3,
                    color: 'white',         
                    '&:hover': {
                        color: 'white',      
                        textDecoration: 'none'
                    }
            }}>
                Back to home page
            </Button>
        </Box>
        
    </>
    
  )
}

export default NotFoundPage