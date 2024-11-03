import React, { useState, useEffect, useMemo } from 'react'
import { TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

export default function CommonTextField({
  placeholder,
  name,
  label,
  error,
  helperText,
  value,
  onChange,
  ...others
}) {
  return (
    <TextField
      placeholder={placeholder}
      name={name}
      label={label}
      error={error}
      helperText={helperText}
      value={value}
      onChange={onChange}
      {...others}
    />
  )
}
