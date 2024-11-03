import React, { useState, useEffect, useMemo } from 'react'
import {
  InputLabel,
  FormControl,
  Select,
  TextField,
  ListSubheader,
  InputAdornment,
  MenuItem,
  FormHelperText
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1
export default function DropdownWithSearch({
  title,
  name,
  label,
  error,
  helperText,
  value,
  onChange,
  labelId,
  Id,
  activeListArr,
  setOption,
  multiple,
  ...others
}) {
  const [searchText, setSearchText] = useState('')
  const activeOptions = useMemo(
    () =>
      activeListArr.filter((option) => containsText(option.name, searchText)),
    [searchText]
  )
  return (
    <FormControl required fullWidth>
      <InputLabel id="demo-simple-select-label">{title}</InputLabel>
      <Select
        placeholder={title}
        name={name}
        label={label}
        error={error}
        helperText={helperText}
        value={value}
        labelId={labelId}
        id={Id}
        multiple={multiple}
        {...others}
      >
        <ListSubheader>
          <TextField
            size="small"
            autoFocus
            placeholder="Type to search..."
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Escape') {
                e.stopPropagation()
              }
            }}
          />
        </ListSubheader>
        {activeOptions
          ? activeOptions.map((activeList, index) => (
              <MenuItem
                key={index}
                value={activeList.id}
                onClick={() => setOption(activeList.id)}
              >
                {activeList.name}
              </MenuItem>
            ))
          : null}
      </Select>
      {helperText !== undefined ? (
        <FormHelperText style={{ color: 'red' }}>{helperText}</FormHelperText>
      ) : null}
    </FormControl>
  )
}
