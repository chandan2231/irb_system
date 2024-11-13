import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { protocolReport } from "../../services/UserManagement/UserService";
import { createProtocolEvent, assignProtocolToMember } from "../../services/Admin/MembersService";
import { useLocation } from "react-router-dom";
import { fetchApprovedProtocolsByMembersList } from "../../services/Admin/MembersService";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';


function ApprovalMemberDetails() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState([]);
    const protocolTypeDetails = location.state.details;

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem("user"));
        if (userDetails) {
            setUser(userDetails);
        }
    }, []);

    const { approvedProtocolsByMembersList, loading, error } = useSelector((state) => ({
        error: state.member.error,
        approvedProtocolsByMembersList: state.member.approvedProtocolsByMembersList,
        loading: state.member.loading,
    }));
    useEffect(() => {
        let data={'protocolId': protocolTypeDetails.protocolId}
        dispatch(fetchApprovedProtocolsByMembersList(data));
    }, [dispatch, user.id]);

    console.log('approvedProtocolsByMembersList', approvedProtocolsByMembersList)

    return (
        <>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />
        <Box m={theme.layoutContainer.layoutSection}>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={5} sm={5} md={8} lg={8}>
                    <Typography variant="h5" mb={2}>
                         Protocol Approved By Members List
                    </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ mt: 5 }}>
                <Grid container spacing={2}>
                    {
                        approvedProtocolsByMembersList?.data !== null && approvedProtocolsByMembersList?.data?.length > 0 &&  approvedProtocolsByMembersList?.data?.map(users => (
                            <Grid item xs={12} sm={12} md={6} lg={6} key={users.id}>
                                <Card>
                                    <CardHeader subheader={users.name}/>
                                    <CardContent style={{paddingTop: '0px'}}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }} style={{marginTop: '10px'}}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6} sm={6} md={6} lg={6}>Protocol</Grid>
                                                <Grid item xs={6} sm={6} md={6} lg={6}><strong>{users.protocol !== '' ? users.protocol : 'Awating Response'}</strong></Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }} style={{marginTop: '10px'}}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6} sm={6} md={6} lg={6}>Consent</Grid>
                                                <Grid item xs={6} sm={6} md={6} lg={6}><strong>{users.consent !== '' ? users.consent : 'Awating Response'}</strong></Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }} style={{marginTop: '10px'}}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6} sm={6} md={6} lg={6}>Supported Document</Grid>
                                                <Grid item xs={6} sm={6} md={6} lg={6}><strong>{users.supported_documents !== '' ? users.supported_documents : 'Awating Response'}</strong></Grid>
                                            </Grid>
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }} style={{marginTop: '10px'}}>
                                            Comment: <strong>{users.comment}</strong>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    }
                </Grid>
            </Box>
        </Box>
        </>
    );
}

export default ApprovalMemberDetails;
