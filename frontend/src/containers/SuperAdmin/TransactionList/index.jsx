import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Box,
    Typography,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Grid from "@mui/material/Grid";
import moment from "moment";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { fetchTransactionListByType } from "../../../services/Admin/UsersListService";

const TransactionList = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [transactionDataListByType, setTransactionDataListByType] =
        React.useState([]);
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState([]);
    const [options, setOptions] = useState("Transaction");

    const optionsList = ["Transaction", "Waive Fee"];

    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem("user"));
        if (userDetails) {
            setUser(userDetails);
        }
    }, []);

    const columns = [
        {
            field: "name",
            headerName: "Name",
            flex: 1,
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
            field: "companyName",
            headerName: "Company Name",
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
    ];

    var totalElements = 0;
    const { transactionDataList, loading, error } = useSelector((state) => ({
        error: state.admin.error,
        transactionDataList: state.admin.transactionDataList,
        loading: state.admin.loading,
    }));

    useEffect(() => {
        const data = { selectedUserType: options };
        dispatch(fetchTransactionListByType(data));
    }, [dispatch, user.id, options]);

    if (transactionDataList !== "" && transactionDataList?.length > 0) {
        totalElements = transactionDataList.length;
    }

    const rowCountRef = React.useRef(totalElements || 0);
    const rowCount = React.useMemo(() => {
        if (totalElements !== undefined) {
            rowCountRef.current = totalElements;
        }
        return rowCountRef.current;
    }, [totalElements]);

    const handleChange = (event) => {
        setOptions(event.target.value);
    };

    useEffect(() => {
        const pListArr = [];
        if (transactionDataList && transactionDataList?.length > 0) {
            transactionDataList.map((pList, index) => {
                let protocolObject = {
                    id: pList.id,
                    name: pList.name,
                    email: pList.email,
                    mobile: pList.mobile || "--",
                    companyName: pList.company_name || "--",
                    city: pList.city || "--",
                    createdDate: moment(pList.created_date).format("DD MMM YYYY"),
                    updatedDate: moment(pList.updated_date).format("DD MMM YYYY"),
                };
                pListArr.push(protocolObject);
            });
            setTransactionDataListByType(pListArr);
        }
    }, [transactionDataList]);

    return (
        <Box m={theme.layoutContainer.layoutSection}>
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
            <Box>
                <Grid container spacing={2} alignItems="center">
                    {/* Title */}
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Typography
                            variant="h5"
                            mb={2}
                            sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" } }}
                        >
                            Transactions List
                        </Typography>
                    </Grid>

                    {/* Dropdown for Role Selection */}
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Select Type"
                                value={options}
                                onChange={handleChange}
                            >
                                {optionsList.map((role, index) => (
                                    <MenuItem key={index} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ mt: 5 }}>
                <DataGrid
                    rows={transactionDataList}
                    columns={columns}
                    rowCount={rowCount}
                    loading={loading}
                    paginationMode="server"
                />
            </Box>
        </Box>
    );
};

export default TransactionList;
