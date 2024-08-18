import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProtocolList } from "../../services/Dashboard/DashboardService";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CommonButton from "../../components/CommonButton";
import moment from "moment";
import ToggleStatus from "../../components/ToggleStatus";
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

function ContinuingReview() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [protocolDataList, setProtocolDataList] = React.useState([]);
    const [user, setUser] = useState([]);
    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        if (userDetails) {
            setUser(userDetails);
        }
    }, []);
    const navigateReviewDetails = (params) => {
        console.log('params', params)
        navigate("/continuin-review-details", {state:{details: params.row}});
    };
    const columns = [
        {
            field: "protocolId",
            headerName: "Protocol Number",
            flex: 1,
            renderCell: (params) => <a className="link-tag" onClick={() => navigateReviewDetails(params)}>{params.value}</a>,
        },
        {
            field: "researchType",
            headerName: "Research Type",
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
    const { protocolList, loading, error } = useSelector(
        state => ({
            error: state.dashboard.error,
            protocolList: state.dashboard.protocolList,
            loading: state.dashboard.loading,
        })
    );
    useEffect(() => {
        const data = { login_id: user.id };
        dispatch(fetchProtocolList(data));
    }, [dispatch, user.id]);
    if(protocolList !== '' && protocolList?.length > 0){
        totalElements = protocolList.length;
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
        if(protocolList && protocolList?.length > 0) {
            protocolList.map((pList, index) => {
                let protocolObject = {
                    id: pList.id,
                    protocolId: pList.protocol_id,
                    researchType:  pList.research_type === 'contractor_researcher' ? 'Contractor Researcher' :  pList.research_type === 'multi_site_sponsor' ? 'Multi Site Sponsor' : 'Clinical Researcher',
                    createdDate: moment(pList.created_date).format("DD-MM-YYYY"),
                    updatedDate: moment(pList.updated_date).format("DD-MM-YYYY"),
                }
                pListArr.push(protocolObject)
            })
            setProtocolDataList(pListArr)
        }
    }, [protocolList]);
    
    

    const handleChangeStatus = (params) => {
        //console.log('Status Item', params)
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
                            Continuing Review
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ mt: 5 }}>
                <DataGrid
                    rows={protocolDataList}
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

    export default ContinuingReview;