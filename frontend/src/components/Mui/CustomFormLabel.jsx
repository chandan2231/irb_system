import React from 'react';
import { FormLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
    fontSize: '1.1rem !important',
    color: 'black !important',
}));

export const CustomMUIFormLabel = ({ children, ...props }) => {
    return <StyledFormLabel {...props}>{children}</StyledFormLabel>;
};

