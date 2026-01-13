import { TextField } from "@mui/material"

import { useAtom, useSetAtom } from "jotai";

import { useDebounce } from "../hooks/useDebounce";

import { searchQueryAtom ,debouncedSearchAtom } from "../atoms/todoAtoms";
import { useEffect } from "react";


const SearcField = () => {
    const [ searchQuery, setSearchQuery ] = useAtom(searchQueryAtom);

    const setDebuncedSearchAtom = useSetAtom(debouncedSearchAtom);

    const debuncedValue = useDebounce(searchQuery, 300);

    useEffect(() => {
        setDebuncedSearchAtom(debuncedValue);
    }, [debuncedValue])
    
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