import React, { useState, useEffect } from 'react'
import CommonModal from '../../../components/CommonModal/Modal'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import FormControl from '@mui/material/FormControl'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import DropdownWithSearch from '../../../components/DropdownWithSearch'
import FormHelperText from '@mui/material/FormHelperText'

const defaultInputValues = {
  password: '',
  passwordConfirmation: ''
}

const ChangePassword = ({ open, onClose, addNewData, title }) => {
  const [values, setValues] = useState(defaultInputValues)
  const [showPassword, setShowPassword] = React.useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }
  const modalStyles = {
    inputFields: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '20px',
      marginBottom: '15px',
      '.MuiFormControl-root': {
        marginBottom: '20px'
      }
    }
  }
  const validationSchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Passwords must match'
    )
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validationSchema) })

  const addNew = (data) => {
    addNewData(data)
  }

  const handleChange = (value) => {
    setValues(value)
  }

  useEffect(() => {
    if (open) setValues(defaultInputValues)
  }, [open])

  const getContent = () => (
    <Box sx={modalStyles.inputFields}>
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          placeholder="Password"
          name="password"
          label="Password"
          required
          {...register('password')}
          error={errors.password ? true : false}
          helperText={errors.password?.message}
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        {errors.password?.message && (
          <FormHelperText error id="accountId-error">
            {errors.password?.message}
          </FormHelperText>
        )}
      </FormControl>
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">
          Confirm Password
        </InputLabel>
        <OutlinedInput
          placeholder="Confirm Password"
          name="passwordConfirmation"
          label="passwordConfirmation"
          required
          {...register('passwordConfirmation')}
          error={errors.passwordConfirmation ? true : false}
          helperText={errors.passwordConfirmation?.message}
          id="outlined-adornment-confirm-password"
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        {errors.passwordConfirmation?.message && (
          <FormHelperText error id="accountId-error">
            {errors.passwordConfirmation?.message}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  )

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={title}
      subTitle=""
      content={getContent()}
      onSubmit={handleSubmit(addNew)}
    />
  )
}

export default ChangePassword
