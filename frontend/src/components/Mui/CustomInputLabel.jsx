import React from 'react';
import { styled } from '@mui/material/styles';
import { InputLabel } from '@mui/material';

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
    fontSize: '1.1rem !important',
    color: 'black !important',
}));

export const CustomInputLabel = ({ children, ...props }) => {
    return <StyledInputLabel {...props}>{children}</StyledInputLabel>;
}

 