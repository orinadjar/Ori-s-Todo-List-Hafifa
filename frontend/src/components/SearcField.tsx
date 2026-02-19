import { useEffect, useState } from "react";

import { TextField } from "@mui/material"

import { useSetAtom } from "jotai";

import { useDebounce } from "../hooks/useDebounce";

import { debouncedSearchAtom } from "../atoms/todoAtoms";


const SearcField = () => {
    const [ searchQuery, setSearchQuery ] = useState('');

    const setDebuncedSearchAtom = useSetAtom(debouncedSearchAtom);

    const debuncedValue = useDebounce(searchQuery, 300);

    useEffect(() => {
        setDebuncedSearchAtom(debuncedValue);
    }, [debuncedValue, setDebuncedSearchAtom])

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