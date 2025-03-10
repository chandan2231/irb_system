import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCRC,
  fetchCRCList,
} from "../../services/Dashboard/DashboardService";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CommonButton from "../../components/CommonButton";
import moment from "moment";
import ToggleStatus from "../../components/ToggleStatus";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import AddClinicalResearchCoordinator from "./AddClinicalResearchCoordinator";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader";
import LockResetIcon from "@mui/icons-material/LockReset";

function ClinicalResearchCoordinator() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = React.useState(false);

  const [dataList, setDataList] = React.useState([]);
  const [user, setUser] = useState([]);
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
      field: "phone",
      headerName: "Phone No",
      flex: 1,
    },
    {
      field: "companyName",
      headerName: "Company Name",
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
    //   ],
    // },
  ];

  var totalElements = 0;
  const { crcList, loading, error, createdCRC } = useSelector((state) => ({
    error: state.dashboard.error,
    crcList: state.dashboard.crcList,
    loading: state.dashboard.loading,
    createdCRC: state.dashboard.createdCRC,
  }));
  useEffect(() => {
    const data = { added_by: user.id };
    dispatch(fetchCRCList(data));
  }, [dispatch, user.id]);

  if (crcList !== "" && crcList?.length > 0) {
    totalElements = crcList.length;
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
    if (crcList && crcList?.length > 0) {
      crcList.map((pList, index) => {
        let externalMonitorObject = {
          id: pList.id,
          name: pList.name,
          email: pList.email,
          phone: pList.mobile,
          companyName: pList.company_name,
          createdDate: moment(pList.created_at).format("DD MMM YYYY"),
          updatedDate: moment(pList.updated_at).format("DD MMM YYYY"),
        };
        pListArr.push(externalMonitorObject);
      });
      setDataList(pListArr);
    }
  }, [crcList]);

  const addNewData = (externalData) => {
    externalData.added_by = user.id;
    setLoader(true);
    dispatch(createCRC(externalData)).then((data) => {
      if (data.payload.status === 200) {
        setOpen(false);
        toast.success(data.payload.data.msg, {
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
        setOpen(false);
        toast.error(data.payload.msg, {
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
    setLoader(false);
  };

  useEffect(() => {
    if (createdCRC) {
      const data = { added_by: user.id };
      dispatch(fetchCRCList(data));
    }
  }, [createdCRC]);

  const handleItemDelete = (params) => {
    //console.log('Delete Item', params)
  };

  // const handleItemDetail = (params) => {
  //     //console.log('Details Item', params)
  // }

  // const handleItemEdit = (params) => {
  //     //console.log('Edit Item', params)
  // }

  if (loader) {
    return <Loader />;
  }

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
            <Grid item xs={12} sm={12} md={8} lg={8}>
              <Typography
                variant="h2"
                sx={{
                  textAlign: "left",
                  fontSize: { xs: "1.2rem", sm: "1.2rem", md: "1.5rem" },
                  fontWeight: "bold",
                }}
              >
                Clinical Research Coordinator List
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <Box display="flex" justifyContent="flex-end">
                <CommonButton
                  variant="contained"
                  onClick={addNew}
                  startIcon={<AddOutlinedIcon />}
                >
                  Add Clinical Research Coordinator
                </CommonButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <AddClinicalResearchCoordinator
            open={open}
            onClose={() => setOpen(false)}
            addNewData={addNewData}
          />
        </Box>
        <Box sx={{ mt: 5 }}>
          <DataGrid
            rows={dataList}
            columns={columns}
            rowCount={rowCount}
            loading={loading}
            paginationMode="server"
          />
        </Box>
      </Box>
    </>
  );
}

export default ClinicalResearchCoordinator;
