import React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomMUITextField = styled(TextField, {
    shouldForwardProp: (prop) => prop !== 'hasAsterisk' && prop !== 'filled'
})(({ theme, hasAsterisk, filled }) => ({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {},
        '&:hover fieldset': {},
        '&.Mui-focused fieldset': {},
    },
    '& .MuiInputLabel-root': {
        //  default label styling when data is populated,
        // #3f51b5
        color: (filled && hasAsterisk) ? undefined : (filled && !hasAsterisk) ? undefined : undefined,
        fontSize: filled ? '22px' : undefined,
        background: filled ? 'white' : undefined,
        marginTop: filled ? '-1px' : undefined,
        paddingRight: filled ? '0.5rem' : undefined,
        paddingLeft: filled ? '0.5rem' : undefined,

        '&.Mui-focused': {
            color: hasAsterisk ? 'red' : undefined,
            fontSize: '22px',
            background: 'white',
            marginTop: '-1px',
            paddingRight: '0.5rem',
            paddingLeft: '0.5rem',
        },
    },
}));

CustomMUITextField.defaultProps = {}

export const CustomMUITextFieldWrapper = (props) => {
    //    if props.label have * than hasAsterisk is true

    const getHasAsterisk = (label) => {
        if (label.includes('*')) {
            return true;
        }
        return false
    }


    return (
        <CustomMUITextField {...props}
            filled={Boolean(props.value) ?? false}
            hasAsterisk={getHasAsterisk(String(props.label) ?? '')}

        />
    );
}

