import * as React from "react";
import { useState, useEffect } from "react";
import { Typography, useTheme } from "@mui/material";
import {Sidebar, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import {Link, useLocation} from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { approvedProtocolListCheck } from "../services/Dashboard/DashboardService";
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

function SideNav (){
    const theme = useTheme();
    const loaction = useLocation();
    const dispatch = useDispatch();
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const { approvedProtocolListCount, loading, error } = useSelector(
        state => ({
            error: state.dashboard.error,
            approvedProtocolListCount: state.dashboard.approvedProtocolListCount,
            loading: state.dashboard.loading,
        })
    );
    useEffect(() => {
        if(userDetails){
            let data = {userId: userDetails.id}
            dispatch(approvedProtocolListCheck(data));
        }
    }, [dispatch, userDetails && userDetails?.id !== null]);
    

    return (
        (loaction.pathname === "/reset-password" || loaction.pathname === "/forget-password" || loaction.pathname === "/signin" || loaction.pathname === "/signup" ) ? (
            <></>
        ) : (
            <Sidebar
                style={{height: '100%', top: 'auto'}}
                breakPoint="md"
                width="285px"
                backgroundColor={theme.palette.primary.white}
            >
                <Menu 
                    menuItemStyles={{
                        button: ({active}) => {
                            return{
                                // backgroundColor: active ? theme.palette.neutral.main : undefined,
                                color: active ? theme.palette.neutral.main : undefined,
                                '&:hover': {
                                    color: active ? theme.palette.primary.black : undefined,
                                },
                            
                            }
                        }
                    }}
                >
                    { 
                        userDetails.researcher_type === 'admin' ? (
                            <>
                                <MenuItem active={location.pathname === '/admin/protocol-list' || location.pathname === '/admin/protocol-details' ? true : false} component={<Link to ='/admin/protocol-list' />} icon={<AddBusinessOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Protocol List</Typography>
                                </MenuItem>
                                <MenuItem active={location.pathname === '/admin/continuin-review-list' || location.pathname === '/admin/continuin-review-details' ? true : false} component={<Link to ='/admin/continuin-review-list' />} icon={<GroupAddOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Continuing Review List</Typography>
                                </MenuItem>
                                <MenuItem active={location.pathname === '/admin/protocol-amendment-request' || location.pathname === '/admin/protocol-amendment-request-details' ? true : false} component={<Link to ='/admin/protocol-amendment-request' />} icon={<AddBusinessOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Protocol Amendment Request</Typography>
                                </MenuItem>
                                <MenuItem active={location.pathname === '/admin/adverse-events' || location.pathname === '/admin/adverse-events-details' ? true : false} component={<Link to ='/admin/adverse-events' />} icon={<AddBusinessOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Adverse Events</Typography>
                                </MenuItem>
                                <MenuItem active={location.pathname === '/admin/promptly-reportable-event' || location.pathname === '/admin/promptly-reportable-event-details' ? true : false} component={<Link to ='/admin/promptly-reportable-event' />} icon={<AddBusinessOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Promptly Reportable Event</Typography>
                                </MenuItem>
                                <MenuItem active={location.pathname === '/admin/study-close-request' || location.pathname === '/admin/study-close-request-details' ? true : false} component={<Link to ='/admin/study-close-request' />} icon={<AddBusinessOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Study Closeout Request</Typography>
                                </MenuItem>
                                <MenuItem active={location.pathname === '/admin/users-list' ? true : false} component={<Link to ='/admin/users-list' />} icon={<SourceOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Users</Typography>
                                </MenuItem>
                                <MenuItem active={location.pathname === '/members' ? true : false} component={<Link to ='/members' />} icon={<PersonAddAltOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Members List</Typography>
                                </MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem active={location.pathname === '/dashboard' || location.pathname === '/protocol-details' ? true : false} component={<Link to ='/dashboard' />} icon={<AddBusinessOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Protocol List</Typography>
                                </MenuItem>
                                {
                                    approvedProtocolListCount !== null && approvedProtocolListCount > 0 && (
                                        <>
                                            <MenuItem active={location.pathname === '/continuin-review' || location.pathname === '/continuin-review-details' ? true : false} component={<Link to ='/continuin-review' />} icon={<GroupAddOutlinedIcon />}>
                                                <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Continuing Review</Typography>
                                            </MenuItem>
                                            <MenuItem active={location.pathname === '/protocol-amendment-request' || location.pathname === '/protocol-amendment-request-details' ? true : false} component={<Link to ='/protocol-amendment-request' />} icon={<AddBusinessOutlinedIcon />}>
                                                <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Protocol Amendment Request</Typography>
                                            </MenuItem>
                                            <MenuItem active={location.pathname === '/adverse-events' || location.pathname === '/adverse-events-details' ? true : false} component={<Link to ='/adverse-events' />} icon={<AddBusinessOutlinedIcon />}>
                                                <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Adverse Events</Typography>
                                            </MenuItem>
                                            <MenuItem active={location.pathname === '/promptly-reportable-event' || location.pathname === '/promptly-reportable-event-details' ? true : false} component={<Link to ='/promptly-reportable-event' />} icon={<AddBusinessOutlinedIcon />}>
                                                <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Promptly Reportable Event</Typography>
                                            </MenuItem>
                                            <MenuItem active={location.pathname === '/study-close-request' || location.pathname === '/study-close-request-details' ? true : false} component={<Link to ='/study-close-request' />} icon={<AddBusinessOutlinedIcon />}>
                                                <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Study Closeout Request</Typography>
                                            </MenuItem>
                                        </>
                                    )
                                }
                            </>
                        )
                    }
                </Menu>
            </Sidebar>
        )
    )
};

export default SideNav;