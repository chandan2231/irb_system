import React, { useState, useEffect } from 'react'
import CommonModal from '../../components/CommonModal/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup'

const defaultInputValues = {
    name: '',
    code: '',
};

const AddMarket = ({ open, onClose, addNewData }) => {
    const [values, setValues] = useState(defaultInputValues);
    const modalStyles = {
        inputFields: {
            display: 'flex',
            flexDirection: 'column',
            marginTop: '20px',
            marginBottom: '15px',
            '.MuiFormControl-root': {
                marginBottom: '20px',
            },
        },
    };

    
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        code: Yup.string().required('Code is required')
    });

    const {register, handleSubmit, formState: { errors }} = useForm({resolver: yupResolver(validationSchema)});

    const addNew = (data) => {
        addNewData(data);
    };

    const handleChange = (value) => {
        setValues(value)
    };

    useEffect(() => {
        if (open) setValues(defaultInputValues);
    }, [open])

    const getContent = () => (
        <Box sx={modalStyles.inputFields}>
            <TextField
                placeholder="Name"
                name="name"
                label="Name"
                required
                {...register('name')}
                error={errors.name ? true : false}
                helperText={errors.name?.message}
                value={values.name}
                onChange={(event) => handleChange({ ...values, name: event.target.value })}
            />
            <TextField
                placeholder="Code"
                name="code"
                label="Code"
                required
                {...register('code')}
                error={errors.code ? true : false}
                helperText={errors.code?.message}
                value={values.code}
                onChange={(event) => handleChange({ ...values, code: event.target.value })}
            />
        </Box>
    );
    
    return (
        <CommonModal
            open={open}
            onClose={onClose}
            title="Create New Market"
            subTitle=""
            content={getContent()}
            onSubmit={handleSubmit(addNew)}
        />
            
    )
}

export default AddMarket