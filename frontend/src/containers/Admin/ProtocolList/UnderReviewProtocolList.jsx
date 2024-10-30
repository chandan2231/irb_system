import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnderReviewProtocolList, allowProtocolEdit } from "../../../services/Admin/ProtocolListService";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import moment from "moment";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useNavigate } from "react-router-dom";
import { protocolReport } from "../../../services/UserManagement/UserService";
import ToggleStatus from "../../../components/ToggleStatus";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import AddProtocolEvent from "./AddProtocolEvent";

function UnderReviewProtocolList() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [protocolDataList, setProtocolDataList] = React.useState([]);
    const [user, setUser] = useState([]);
    const [open, setOpen] = useState(false);
    const [protocolDetails, setProtocolDetails] = useState();
    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        if (userDetails) {
            setUser(userDetails);
        }
    }, []);
    const navigateProtocolDetails = (params) => {
        navigate("/admin/protocol-details", {state:{details: params.row}});
    };
    const columns = [
        {
            field: "protocolId",
            headerName: "Protocol Number",
            flex: 1,
            renderCell: (params) => <a className="link-tag" onClick={() => navigateProtocolDetails(params)}>{params.value}</a>,
        },
        {
            field: "researchType",
            headerName: "Research Type",
            flex: 1,
        },
        {
            field: "username",
            headerName: "Username",
            flex: 1,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1,
        },
        {
            field: "allowEdit",
            headerName: "Allow Edit",
            flex: 1,
            renderCell: (params) => (
                <ToggleStatus
                    status={params.row.allowEdit}
                    onStatusChange={(newAllowEdit) => {
                        handleChangeStatus(params.row.id, newAllowEdit);
                    }}
                />
            ),
        },
        {
            field: "status",
            headerName: "Status",
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
                    icon={<EditCalendarOutlinedIcon />}
                    label="Add Event"
                    onClick={() => handleAddProtocolEvent(params)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<PictureAsPdfIcon />}
                    label="View Pdf"
                    onClick={() => handleViewPdf(params)}
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
                // <GridActionsCellItem
                //     icon={<DeleteIcon />}
                //     label="Delete"
                //     onClick={handleItemDelete(params)}
                //     showInMenu
                // />,
            ],
        },
    ];
    
    var totalElements = 0;
    const { underReviewProtocolList, loading, error } = useSelector(
        state => ({
            error: state.admin.error,
            underReviewProtocolList: state.admin.underReviewProtocolList,
            loading: state.admin.loading,
        })
    );
    useEffect(() => {
        dispatch(fetchUnderReviewProtocolList());
    }, [dispatch, user.id]);
    if(underReviewProtocolList !== '' && underReviewProtocolList?.length > 0){
        totalElements = underReviewProtocolList.length;
    }
    const rowCountRef = React.useRef(totalElements || 0);
    const rowCount = React.useMemo(() => {
        if (totalElements !== undefined) {
            rowCountRef.current = totalElements;
        }
        return rowCountRef.current;
    }, [totalElements]);


    useEffect(() => {
        const pListArr = []
        if(underReviewProtocolList && underReviewProtocolList?.length > 0) {
            underReviewProtocolList.map((pList, index) => {
                let protocolObject = {
                    id: pList.id,
                    protocolId: pList.protocol_id,
                    researchType:  pList.research_type,
                    username: pList.name,
                    email: pList.email,
                    allowEdit: pList.allow_edit,
                    status: pList.status === '1' ? 'Created' : pList.status === '2' ? 'Under Review' : pList.status === '3' ? 'Approved' : 'Rejected',
                    createdDate: moment(pList.created_at).format("DD-MM-YYYY"),
                    updatedDate: moment(pList.updated_at).format("DD-MM-YYYY"),
                }
                pListArr.push(protocolObject)
            })
            setProtocolDataList(pListArr)
        }
    }, [underReviewProtocolList]);


    const handleViewPdf = async (params) => {
        const {row} = params
        const {protocolId, researchType} = row
        const protocolReportPayload = {
            protocolId: protocolId,
            protocolType: researchType
        }
        let pdfResponse = await protocolReport(protocolReportPayload)
        if(pdfResponse !== ''){
            window.open(pdfResponse.pdfUrl, '_blank', 'noopener,noreferrer')
        }
    }

    /* CHANGE STATUS API CALL */
    const handleChangeStatus = async (id, editStatus) => {
        if(Number(editStatus) === 1 || Number(editStatus) === 2){
            let allowEditvalue = ''
            if(Number(editStatus) === 1) {
                allowEditvalue = 2
            } else if(Number(editStatus) === 2){
                allowEditvalue = 1
            }
            let payloadData = {id: id, allow_edit: allowEditvalue}
            dispatch(allowProtocolEdit(payloadData))
            .then(data => {

                if (data.payload.status === 200) {
                    toast.success(data.payload.msg, {position: "top-right",autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark"});
                    const updatedProtocolDataList = protocolDataList.map((element) =>
                        element.id === response.payload.data.id ? { ...element, allow_edit: response.payload.data.allowEditvalue } : element
                    );
                    setProtocolDataList(updatedProtocolDataList);
                } else {
                    toast.error(data.payload.msg, {position: "top-right",autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark"});
                }
            });
        }
    }
    
    
    const handleAddProtocolEvent = (params) => {
        console.log('Add Event', params)
        setOpen(true);
        setProtocolDetails(params?.row)
    }

    const addNewData = (data) => {
        dispatch(createMember(data))
        .then(data => {
            console.log('data', data)
            if (data.payload.status === 200) {
                setOpen(false);
                toast.success(data.payload.data, {position: "top-right",autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark"});
                setFo
            } else {
                setOpen(false);
                toast.error(data.payload, {position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark"});
            }
        })
        
    };

    // const handleItemDetail = (params) => {
    //     //console.log('Details Item', params)
    // }
    
    // const handleItemEdit = (params) => {
    //     //console.log('Edit Item', params)
    // }

    

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"/>
            <Box m={theme.layoutContainer.layoutSection}>
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={5} sm={5} md={8} lg={8}>
                            <Typography variant="h5" mb={2}>
                                Under Review Protocol List
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <AddProtocolEvent open={open} onClose={() => setOpen(false)} addNewData={addNewData} title={'Create Protocol Event'} protocolDetails={protocolDetails}/>
                </Box>
                <Box sx={{ mt: 5 }}>
                    <DataGrid
                        rows={protocolDataList}
                        columns={columns}
                        rowCount={rowCount}
                        loading={loading}
                        paginationMode="server"
                        // onCellClick={(param) => handleChangeStatus(param)}
                    />
                </Box>
            </Box>
        </>
    );
}

export default UnderReviewProtocolList;
