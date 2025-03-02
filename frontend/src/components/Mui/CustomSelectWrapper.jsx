import React from 'react';
import { InputLabel, Select } from '@mui/material';
import { styled } from '@mui/material/styles';

// Create a custom styled InputLabel
const CustomMUIInputLabel = styled(InputLabel, {
    shouldForwardProp: (prop) => prop !== 'hasAsterisk' && prop !== 'filled'
})(({ theme, hasAsterisk, filled }) => ({
    // Default styling; adjust as needed
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
}));

// Custom Select wrapper component
export const CustomMUISelectWrapper = ({
    inputLabel,
    children,
    ...props
}) => {
    const { value, labelId } = props || {}

    // Determine if the label contains an asterisk
    const hasAsterisk = inputLabel.includes('*');
    const filled = Boolean(value);

    return (
        <>
            <CustomMUIInputLabel
                hasAsterisk={hasAsterisk}
                filled={filled}
                id={labelId}
            >
                {inputLabel}
            </CustomMUIInputLabel>
            <Select {...props}>
                {children}
            </Select>
        </>
    );
};
