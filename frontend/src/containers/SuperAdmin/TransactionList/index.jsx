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
import { getTransactionList } from "../../../services/Payment/PaymentService";

const TransactionList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [transactionDataListByType, setTransactionDataListByType] =
    React.useState([]);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState([]);
  const [options, setOptions] = useState("");

  const optionsList = ["Transaction", "Waive Fee"];

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (userDetails) {
      setUser(userDetails);
    }
  }, []);

  const columns = [
    {
      field: "protocol_id",
      headerName: "Protocol Id",
      flex: 1,
    },
    {
      field: "transaction_id",
      headerName: "Transaction Id",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Applicant Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Applicant Email",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount Paid",
      flex: 1,
    },
    {
      field: "payment_type",
      headerName: "Payment Type",
      flex: 1,
    },

    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
    },
  ];

  var totalElements = 0;
  const { transactionList, loading, error } = useSelector((state) => ({
    error: state.payment.error,
    transactionList: state.payment.transactionList,
    loading: state.payment.loading,
  }));

  useEffect(() => {
    const data = { selectedUserType: options };
    dispatch(getTransactionList(data));
  }, [dispatch, user.id, options]);

  if (transactionList !== "" && transactionList?.length > 0) {
    totalElements = transactionList.length;
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
    if (transactionList && transactionList?.length > 0) {
      transactionList.map((pList, index) => {
        let protocolObject = {
          id: pList.id,
          protocol_id: pList.protocol_id,
          transaction_id: pList.payment_id,
          name: pList.name,
          email: pList.email,
          amount: pList.amount,
          payment_type: pList.payment_type,
          createdDate: moment(pList.created_at).format("DD MMM YYYY"),
        };
        pListArr.push(protocolObject);
      });
      setTransactionDataListByType(pListArr);
    }
  }, [transactionList]);

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
              variant="h2"
              sx={{
                textAlign: "left",
                fontSize: { xs: "1.2rem", sm: "1.2rem", md: "1.5rem" },
                fontWeight: "bold",
                mb: 2,
              }}
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
          rows={transactionDataListByType}
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
