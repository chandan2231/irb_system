import { createTheme } from "@mui/material";
import { green, grey, indigo } from "@mui/material/colors";
import { light } from "@mui/material/styles/createPalette";

let theme = createTheme ({
    palette: {
        primary: {
            main: indigo[500],
            normal: indigo['A700'],
            white: '#ffffff',
            black: 'rgba(0, 0, 0, 0.87)'
        },
        secondary: {
            main: indigo[500], 
        },
        neutral: {
            light: grey[50],
            medium: grey[200],
            normal: grey[700],
            main: '#325ca8',
        },
        green: {
            main: green[800],
        },
    }
})

theme =  createTheme(theme, {
    typography: {
        link: {
            fontSize: '0.8rem',
            [theme.breakpoints.up('md')]: {
                fontSize: '0.9rem'
            },
            fontWeight: 500,
            color: theme.palette.primary.normal,
            display: 'block',
            cursor: 'pointer'
        },
        cardTitle: {
            fontSize: '1.2rem',
            fontWeight: 500,
            display: 'block',
        },
        h6: {
            fontSize: '1rem'
        },
        h7: {
            fontSize: '0.8rem'
        },
        h8: {
            fontSize: '0.7rem'
        },
        h5: {
            fontSize: '2rem',
            fontWeight: '500',
            [theme.breakpoints.up('md')]: {
                fontSize: '2rem',
                fontWeight: '500'
            },
            '@media (max-width:320px)': {
                fontSize: '1.2rem',
                fontWeight: '500'
            },
        },
        sideMenuTitle: {
            fontWeight: '600', 
            fontSize: '5rem'
        }
    },
    layoutContainer: {
        layoutSection: {
            margin: '1rem',
            padding: '1rem',
            [theme.breakpoints.down('md')]: {
                margin: '0.5rem',
                padding: '0rem'
            },
        },
    }

})

export default theme;