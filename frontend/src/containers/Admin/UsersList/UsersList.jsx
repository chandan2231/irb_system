import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersList } from "../../../services/Admin/UsersListService";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import moment from "moment";
import ToggleStatus from "../../../components/ToggleStatus";
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

function UsersList() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [allUsersList, setAllUsersList] = React.useState([]);
    const [user, setUser] = useState([]);
    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        if (userDetails) {
            setUser(userDetails);
        }
    }, []);
    const navigateProtocolDetails = (params) => {
        navigate("/protocol-details", {state:{details: params.row}});
    };
    const columns = [
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            renderCell: (params) => <a className="link-tag" onClick={() => navigateProtocolDetails(params)}>{params.value}</a>,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "mobile",
            headerName: "Mobile",
            flex: 1,
        },
        {
            field: "city",
            headerName: "City",
            flex: 1,
        },
        
        {
            field: "createdDate",
            headerName: "Created Date",
            flex: 1,
        },
        {
            field: "updatedDate",
            headerName: "Updated Date",
            flex: 1,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 80,
            getActions: (params) => [
                <GridActionsCellItem
                    icon={<RadioButtonUncheckedIcon />}
                    label="Change Status"
                    onClick={handleChangeStatus(params)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<EditNoteIcon />}
                    label="Edit"
                    onClick={handleItemEdit(params)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<SettingsSuggestIcon />}
                    label="Details"
                    onClick={handleItemDetail(params)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={handleItemDelete(params)}
                    showInMenu
                />,
            ],
        },
    ];
    
    var totalElements = 0;
    const { usersList, loading, error } = useSelector(
        state => ({
            error: state.admin.error,
            usersList: state.admin.usersList,
            loading: state.admin.loading,
        })
    );
    useEffect(() => {
        dispatch(fetchUsersList());
    }, [dispatch, user.id]);
    if(usersList !== '' && usersList?.length > 0){
        totalElements = usersList.length;
    }
    const rowCountRef = React.useRef(totalElements || 0);
    const rowCount = React.useMemo(() => {
        if (totalElements !== undefined) {
            rowCountRef.current = totalElements;
        }
        return rowCountRef.current;
    }, [totalElements]);

    const addNew = () => {
        setOpen(true);
    };

    useEffect(() => {
        const pListArr = []
        if(usersList && usersList?.length > 0) {
            usersList.map((pList, index) => {
                let protocolObject = {
                    id: pList.id,
                    name: pList.name,
                    email:  pList.email,
                    mobile: pList.mobile,
                    city: pList.city,
                    createdDate: moment(pList.created_date).format("DD-MM-YYYY"),
                    updatedDate: moment(pList.updated_date).format("DD-MM-YYYY"),
                }
                pListArr.push(protocolObject)
            })
            setAllUsersList(pListArr)
        }
    }, [usersList]);
    
    const addNewData = (data) => {
        let dataObj = {
            research_type_id: data.research_type_id,
            login_id: user.id
        }
        dispatch(createProtocol(dataObj))
        .then(data=> {
            if(data.payload.status === 200){
                setOpen(false);
            } else {
                alert(data.payload)
            }
        })
        
        
    };
    

    const handleChangeStatus = (status) => {
        //console.log('Change status Item', params)
    }
    const handleItemDelete = (params) => {
        //console.log('Delete Item', params)
    }

    const handleItemDetail = (params) => {
        //console.log('Details Item', params)
    }
    
    const handleItemEdit = (params) => {
        //console.log('Edit Item', params)
    }
    return (
        <Box m={theme.layoutContainer.layoutSection}>
            <Box>
                <Grid container spacing={2}>
                <Grid item xs={5} sm={5} md={8} lg={8}>
                    <Typography variant="h5" mb={2}>
                    Users List
                    </Typography>
                </Grid>
                </Grid>
            </Box>
           
            <Box sx={{ mt: 5 }}>
                <DataGrid
                    rows={allUsersList}
                    columns={columns}
                    rowCount={rowCount}
                    loading={loading}
                    paginationMode="server"
                    onCellClick={(param) => handleChangeStatus(param)}
                    // onRowClick={(param) => handleChangeStatus(param)}
                />
            </Box>
        </Box>
    );
    }

    export default UsersList;
