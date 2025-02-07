import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMasterListByType,
  changeUserStatus,
  resetUserPassword,
} from "../../../services/Admin/UsersListService";
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
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import ToggleStatus from "../../../components/ToggleStatus";
import LockResetIcon from "@mui/icons-material/LockReset";
import ChangePassword from "../Members/ChangePassword";

function MasterList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [masterDataListByType, setMasterDataListByType] = React.useState([]);
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState([]);
  const [selectedRole, setSelectedRole] = useState(
    "Clinical Researcher Coordinator"
  ); // Default selection

  // User Type List
  const roleOptions = [
    "External Monitor",
    "Clinical Researcher Coordinator",
    "Principle Investigator",
    "Principle Sub Investigator",
  ];

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (userDetails) {
      setUser(userDetails);
    }
  }, []);
  const navigateProtocolDetails = (params) => {
    navigate("/protocol-details", {
      state: { details: params.row, type: "user" },
    });
  };
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
    // {
    //   field: "actions",
    //   type: "actions",
    //   width: 80,
    //   getActions: (params) => [
    //     <GridActionsCellItem
    //       icon={<LockResetIcon />}
    //       label="Change Password"
    //       onClick={() => handleChangePassword(params)}
    //       showInMenu
    //     />,
    //     <GridActionsCellItem
    //       icon={<DeleteIcon />}
    //       label="Delete"
    //       onClick={handleItemDelete(params)}
    //       showInMenu
    //     />,
    //     // <GridActionsCellItem
    //     //     icon={<SettingsSuggestIcon />}
    //     //     label="Details"
    //     //     onClick={handleItemDetail(params)}
    //     //     showInMenu
    //     // />,
    //   ],
    // },
  ];

  var totalElements = 0;
  const { masterDataList, loading, error } = useSelector((state) => ({
    error: state.admin.error,
    masterDataList: state.admin.masterDataList,
    loading: state.admin.loading,
  }));
  useEffect(() => {
    const data = { selectedUserType: selectedRole };
    dispatch(fetchMasterListByType(data));
  }, [dispatch, user.id, selectedRole]);
  if (masterDataList !== "" && masterDataList?.length > 0) {
    totalElements = masterDataList.length;
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
    const pListArr = [];
    if (masterDataList && masterDataList?.length > 0) {
      masterDataList.map((pList, index) => {
        let protocolObject = {
          id: pList.id,
          name: pList.name,
          email: pList.email,
          mobile: pList.mobile || "--",
          companyName: pList.company_name || "--",
          city: pList.city || "--",
          createdDate: moment(pList.created_date).format("DD-MM-YYYY"),
          updatedDate: moment(pList.updated_date).format("DD-MM-YYYY"),
        };
        pListArr.push(protocolObject);
      });
      setMasterDataListByType(pListArr);
    }
  }, [masterDataList]);

  const handleChangeStatus = (status) => {
    console.log("status", status);
    if (status.value === 1 || status.value === 2) {
      let statusValue = "";
      if (status.value === 1) {
        statusValue = 2;
      } else if (status.value === 2) {
        statusValue = 1;
      }
      let data = { id: status.id, status: statusValue };
      dispatch(changeUserStatus(data)).then((data) => {
        if (data.payload.status === 200) {
          toast.success(data.payload.data, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error(data.payload.data, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      });
    }
  };

  const handleChangePassword = (params) => {
    console.log("params", params);
    if (params.row.email) {
      setUserId(params.row.id);
      setPasswordChangeOpen(true);
    }
  };

  const resetPasswordData = (data) => {
    const { password } = data;
    let dataObject = {
      password: password,
      id: userId,
    };
    dispatch(resetUserPassword(dataObject)).then((data) => {
      if (data.payload.status === 200) {
        setPasswordChangeOpen(false);
        setUserId("");
        toast.success(data.payload.data, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setFo;
      } else {
        setPasswordChangeOpen(false);
        setUserId("");
        toast.error(data.payload, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    });
  };

  const handleItemDelete = (params) => {
    //console.log('Delete Item', params)
  };

  const handleItemDetail = (params) => {
    //console.log('Details Item', params)
  };

  const handleItemEdit = (params) => {
    //console.log('Edit Item', params)
  };

  const handleChange = (event) => {
    setSelectedRole(event.target.value);
  };
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
              Master List
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
                value={selectedRole}
                onChange={handleChange}
              >
                {roleOptions.map((role, index) => (
                  <MenuItem key={index} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <ChangePassword
          open={passwordChangeOpen}
          onClose={() => setPasswordChangeOpen(false)}
          addNewData={resetPasswordData}
          title="Reset User Password"
        />
      </Box>
      <Box sx={{ mt: 5 }}>
        <DataGrid
          rows={masterDataListByType}
          columns={columns}
          rowCount={rowCount}
          loading={loading}
          paginationMode="server"
        />
      </Box>
    </Box>
  );
}

export default MasterList;
