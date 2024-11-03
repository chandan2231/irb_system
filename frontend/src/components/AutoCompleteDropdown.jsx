import * as React from 'react'
import { useState, useEffect } from 'react'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { FormHelperText } from '@mui/material'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

export default function AutoCompleteDropdown() {
  const [selectedValue, setSelectedValue] = useState(null)
  console.log('selectedValue', selectedValue)
  return (
    <>
      <Autocomplete
        multiple={multiple}
        id="checkboxes-tags-demo"
        options={options}
        disableCloseOnSelect
        getOptionLabel={(option) => option.name}
        onChange={(event, newValue) => {
          console.log('newValue', newValue)
          setSelectedValue(newValue)
        }}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            label={placeholder}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
          />
        )}
        fullWidth
      />
    </>
  )
}
