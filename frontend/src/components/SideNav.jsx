import { Box, Typography, useTheme } from "@mui/material";
import {Sidebar, Menu, MenuItem, SubMenu} from 'react-pro-sidebar';
import AddBusinessOutlinedIcon from '@mui/icons-material/AddBusinessOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import {Link, useLocation} from 'react-router-dom';


function SideNav (){
    const theme = useTheme();
    const loaction = useLocation();
    const userDetails = JSON.parse(localStorage.getItem('user'));
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
                                <MenuItem active={location.pathname === '/admin/users-list' ? true : false} component={<Link to ='/admin/users-list' />} icon={<SourceOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Users</Typography>
                                </MenuItem>
                            </>
                        ) : (
                            <>
                                <MenuItem active={location.pathname === '/dashboard' || location.pathname === '/protocol-details' ? true : false} component={<Link to ='/dashboard' />} icon={<AddBusinessOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Dashboard</Typography>
                                </MenuItem>
                                <MenuItem active={location.pathname === '/continuin-review' || location.pathname === '/continuin-review-details' ? true : false} component={<Link to ='/continuin-review' />} icon={<GroupAddOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Continuing Review</Typography>
                                </MenuItem>
                                <MenuItem component={<Link to ='/#/' />} icon={<LayersOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Protocol Amendment Request</Typography>
                                </MenuItem>
                                <MenuItem component={<Link to ='/#/' />} icon={<LockOpenOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Adverse Events</Typography>
                                </MenuItem>
                                <MenuItem component={<Link to ='/#/' />} icon={<SourceOutlinedIcon />}>
                                    <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Promptly Reportable Event </Typography>
                                </MenuItem>
                            </>
                        )
                    }
                </Menu>
            </Sidebar>
        )
    )
};

export default SideNav;