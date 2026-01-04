import { TextField } from "@mui/material"
import { useTodoContext } from "../context/todoContext"

const SearcField = () => {
    const { searchQuery, setSearchQuery } = useTodoContext();
    
    return (
        <TextField
            variant="outlined"
            placeholder="Search missions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
                '& .MuiOutlinedInput-root': {
                borderRadius: 3, 
                width: '300px',
                }
            }}
        />
    )
}

export default SearcField