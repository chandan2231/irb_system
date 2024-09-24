import * as React from 'react';
import {useState } from "react";
import { useCookies } from 'react-cookie';
import { Box, Typography, AppBar, Toolbar, IconButton, Badge } from "@mui/material";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import NotificationIcon from "@mui/icons-material/Notifications";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import {useProSidebar} from 'react-pro-sidebar';
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from '../services/Auth/AuthService';

function AppHeader () {
    const dispatch = useDispatch();
    const {collapseSidebar, toggleSidebar, broken} = useProSidebar();
    const [err, setErr] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken']);
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const handleCloseUserMenu = () => {
        dispatch(userLogout())
        .then(data => {
            if(data.payload.status === 200){
                removeCookie('accessToken')
                window.localStorage.clear();
                window.location.replace('/signin');
                window.location.reload()
            } else {
                setErr(err.respone.data)
            }
        })
    }
    
    return (
        <AppBar position='sticky' sx={styles.appBar}>
            {
                (window.location.pathname === '/reset-password' || window.location.pathname === '/forget-password' || window.location.pathname === '/signin' || window.location.pathname === '/signup') ? (
                    <Toolbar>
                        {/* <Box
                            component='img'
                            sx={styles.appLogo}
                            src='/src/assets/irb_logo.png'
                        /> */}
                        <Box className="center-card"><h2>IRB System</h2></Box>
                    </Toolbar>
                ) : (
                    <Toolbar>
                        <IconButton onClick={() => broken ? toggleSidebar() : collapseSidebar()}>
                            <MenuTwoToneIcon sx={styles.iconColor} />
                        </IconButton>
                        <h2>IRB System</h2>
                        <Box className="center-card"><h2>{userDetails.researcher_type === 'admin' ? 'Super Admin Portal' : ''}</h2></Box>
                        {/* <Box
                            component='img'
                            sx={styles.appLogo}
                            src='/src/assets/irb_logo.png'
                        /> */}
                        <Box sx={{flexGrow: 1}}/>
                        <IconButton title='Notification' sx={styles.iconColor}>
                            <Badge badgeContent={14} color="error">
                                <NotificationIcon />
                            </Badge>
                        </IconButton>
                        <IconButton title='Settings' sx={styles.iconColor}>
                            <SettingsIcon />
                        </IconButton>
                        <IconButton title='Logout' sx={styles.iconColor}>
                            <LogoutIcon onClick={handleCloseUserMenu} />
                        </IconButton>
                    </Toolbar>
                )
            }
            
        </AppBar>
    );
}

/* @type {import("@mui/icons-material").SxProps } */

const styles = {
    appBar: {
        bgcolor: 'neutral.main'
    },
    appLogo: {
        borderRadius: 2,
        width: 80,
        ml: 2,
        cursor: 'pointer'
    },
    iconColor: {
        color: '#ffffff'
    }
}

export default AppHeader;