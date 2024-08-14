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
    console.log("loaction", loaction)
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
                    <MenuItem active={location.pathname === '/dashboard' || location.pathname === '/protocol-details' ? true : false} component={<Link to ='/dashboard' />} icon={<AddBusinessOutlinedIcon />}>
                        <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Dashboard</Typography>
                    </MenuItem>
                    <MenuItem active={location.pathname === '/continuin-review' || location.pathname === '/continuin-review-details' ? true : false} component={<Link to ='/continuin-review' />} icon={<GroupAddOutlinedIcon />}>
                        <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Continuing Review</Typography>
                    </MenuItem>
                    <MenuItem active={location.pathname === '/application' ? true : false} component={<Link to ='/#/' />} icon={<LayersOutlinedIcon />}>
                        <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Protocol Amendment Request</Typography>
                    </MenuItem>
                    <MenuItem active={location.pathname === '/privilege' ? true : false} component={<Link to ='/#/' />} icon={<LockOpenOutlinedIcon />}>
                        <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Adverse Events</Typography>
                    </MenuItem>
                    <MenuItem active={location.pathname === '/resource' ? true : false} component={<Link to ='/#/' />} icon={<SourceOutlinedIcon />}>
                        <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Promptly Reportable Event </Typography>
                    </MenuItem>
                    
                    {/*<MenuItem active={location.pathname === '/user' ? true : false} component={<Link to ='/user' />} icon={<PersonAddAltOutlinedIcon />}>
                        <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>User</Typography>
                    </MenuItem>
                    <MenuItem active={location.pathname === '/role' ? true : false} component={<Link to ='/role' />} icon={<GroupOutlinedIcon />}>
                        <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Role</Typography>
                    </MenuItem>
                    <MenuItem active={location.pathname === '/user-application-role' ? true : false} component={<Link to ='/user-application-role' />} icon={<PermIdentityOutlinedIcon />}>
                        <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>User Application Role</Typography>
                    </MenuItem>
                    <MenuItem active={location.pathname === '/hierarchy' ? true : false} component={<Link to ='/hierarchy' />} icon={<GroupAddOutlinedIcon />}>
                        <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Hierarchy</Typography>
                    </MenuItem>  
                    <MenuItem active={location.pathname === '/team' ? true : false} component={<Link to ='/team' />} icon={<GroupAddOutlinedIcon />}>
                        <Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Team</Typography>
                    </MenuItem> */}
                    {/* <SubMenu label={<Typography variant="body2" style={{fontWeight: '500', fontSize: '0.875rem'}}>Hierarchy</Typography>} icon={<ManageAccountsOutlinedIcon />}>
                            
                    </SubMenu> */}
                </Menu>
            </Sidebar>
        )
    )
};

export default SideNav;