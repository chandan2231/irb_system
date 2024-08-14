import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import { OutlinedInput } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
const SearchBar = ({ placeholder, onChange, searchBarWidth }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <OutlinedInput
                placeholder={placeholder}
                onChange={onChange}
                sx={{width: searchBarWidth, color: 'rgba(0, 0, 0, 0.6)', fontSize: '1.1rem'}}
                startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon sx={{ marginRight: '10px' }} />
                    </InputAdornment>
                }
            />
        </Box>
    )
}

export default SearchBar