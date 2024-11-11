import * as React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import Grid from '@mui/material/Grid';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import CommonButton from '../../../components/CommonButton';
import moment from "moment";
import ToggleStatus from '../../../components/ToggleStatus';
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchActiveVotingMemberList, fetchMemberEventList } from '../../../services/Admin/MembersService'; 

function ProtocolEventList(){
    const theme = useTheme();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
    const [userId, setUserId] = useState();
    const [userDataList, setUserDataList] = useState([]);
    
    const columns = [
        { 
            field: 'protocol_id', 
            headerName: 'Protocol Id', 
            flex: 1,
        },
        { 
            field: 'protocol_name', 
            headerName: 'Protocol Name', 
            flex: 1,
        },
        { 
            field: 'event_subject', 
            headerName: 'Event Subject', 
            flex: 1,
        },
        { 
            field: 'members', 
            headerName: 'Members', 
            flex: 2,
        },
        { 
            field: 'status', 
            headerName: 'Status', 
            width: 100,
        },
        {
            field: 'createdDate',
            headerName: 'Created Date',
            flex: 1,
        },
        
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<LockResetIcon />}
                    label="Change Password"
                    onClick={() => handleChangePassword(params)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={handleItemDelete(params)}
                    showInMenu
                />,
                // <GridActionsCellItem
                //     icon={<EditNoteIcon />}
                //     label="Edit"
                //     onClick={handleItemEdit(params)}
                //     showInMenu
                // />,
                // <GridActionsCellItem
                //     icon={<SettingsSuggestIcon />}
                //     label="Details"
                //     onClick={handleItemDetail(params)}
                //     showInMenu
                // />,
            ],
        },
    ];
    var totalElements = 0;
    const { memberEventList, loading, error, activeVotingMemberList } = useSelector(
        state => ({
            error: state.member.error,
            memberEventList: state.member.memberEventList,
            loading: state.member.loading,
            activeVotingMemberList: state.member.activeVotingMemberList,
        })
    );

    if(memberEventList !== '' && memberEventList?.length > 0){
        totalElements = memberEventList.totalElements;
    }
    const rowCountRef = React.useRef(totalElements || 0);
    const rowCount = React.useMemo(() => {
        if (totalElements !== undefined) {
            rowCountRef.current = totalElements;
        }
        return rowCountRef.current;
    }, [totalElements]);

    useEffect(() => {
        const uListArr = []
        if(memberEventList && memberEventList?.length > 0) {
            memberEventList.map((uList, index) => {
                let listObject = {
                    id: uList.id,
                    protocol_id:  uList.protocol_id,
                    protocol_name:  uList.protocol_name,
                    event_subject:  uList.event_subject,
                    members:  uList.members,
                    status:  uList.status === 1 ? 'Pending' : 'Completed',
                    createdDate: moment(uList.created_date).format("DD-MM-YYYY"),
                    updatedDate: moment(uList.updated_date).format("DD-MM-YYYY"),
                }
                uListArr.push(listObject)
            })
            setUserDataList(uListArr)
        }
    }, [memberEventList]);

    useEffect(() => {
        dispatch(fetchMemberEventList());
    }, [])

    const activeVotingMemberListArr = [];
    if (activeVotingMemberList && activeVotingMemberList.length > 0) {
        activeVotingMemberList.map((mList, index) => {
            let objectData = {
                id: mList.id,
                name: mList.name,
            };
            activeVotingMemberListArr.push(objectData);
        });
    }
    console.log('activeVotingMemberListArr', activeVotingMemberListArr)
    useEffect(() => {
        dispatch(fetchActiveVotingMemberList());
      }, [dispatch]);

    const handleItemDelete = (params) => {
        //console.log('Delete Item', params)
    }

    // const handleItemDetail = (params) => {
    //     //console.log('Details Item', params)
    // }
    
    // const handleItemEdit = (params) => {
    //     //console.log('Edit Item', params)
    // }

    return(
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"/>
            <Box m={theme.layoutContainer.layoutSection}>
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={5} sm={5} md={8} lg={8}>
                            <Typography variant="h5" mb={2}>Protocol Meeting Events List</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box sx={{mt: 5}}>
                    <DataGrid
                        rows={userDataList}
                        columns={columns}
                        rowCount={rowCount}
                        loading={loading}
                        paginationMode="server"
                        onCellClick={(param) => handleChangeStatus(param)}
                    />
                </Box>
            </Box>
        </>
    )
}

export default ProtocolEventList;