import React, { useState, useEffect } from 'react'
import CommonModal from '../../components/CommonModal/Modal'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { Box, MenuItem, InputLabel, Select, FormControl } from '@mui/material'
import DropdownWithSearch from '../../components/DropdownWithSearch'

const defaultInputValues = {
  research_type_id: ''
}

const AddResearch = ({ open, onClose, addNewData }) => {
  const [values, setValues] = useState(defaultInputValues)
  const [researchTypeError, setResearchTypeError] = useState('')
  const options = [
    { name: 'Clinical Site', id: 'Clinical Site' },
    { name: 'Multi-Site Sponsor', id: 'Multi-Site Sponsor' },
    { name: 'Principal Investigator', id: 'Principal Investigator' }
  ]
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
    research_type_id: Yup.string().required('Research type is required')
  })

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(validationSchema) })

  const addNew = (data) => {
    // console.log("data", data)
    // return
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
      <DropdownWithSearch
        title={'Select Research Type'}
        name={'research_type_id'}
        label={'Select Research Type *'}
        error={errors.research_type_id ? true : false}
        helpertext={errors.research_type_id?.message}
        value={values.research_type_id}
        labelId={'demo-simple-select-required-label'}
        id={'demo-simple-select-required'}
        activeListArr={options}
        setOption={(id) => handleChange({ ...values, research_type_id: id })}
        {...register('research_type_id')}
      />
      {/* <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">Researcher Type</InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    label="Researcher Type"
                    onChange={handleChange}
                    value={values.researcherType}
                    name="researcherType"
                >
                {options.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                    {item.label}
                    </MenuItem>
                ))}
                </Select>
                <p className="error_text">{researchTypeError}</p>
            </FormControl> */}
    </Box>
  )

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Create New Research Type"
      subTitle=""
      content={getContent()}
      onSubmit={handleSubmit(addNew)}
    />
  )
}

export default AddResearch
