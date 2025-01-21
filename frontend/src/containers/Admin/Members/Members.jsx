import * as React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CommonButton from "../../../components/CommonButton";
import AddMember from "./AddMember";
import ChangePassword from "./ChangePassword";
import moment from "moment";
import ToggleStatus from "../../../components/ToggleStatus";
import {
  fetchMemberList,
  createMember,
  changeStatus,
  resetMemberPassword,
} from "../../../services/Admin/MembersService";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Members() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [userId, setUserId] = useState();
  const [userDataList, setUserDataList] = useState([]);

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
      headerName: "Phone",
      flex: 1,
    },
    {
      field: "userType",
      headerName: "User Type",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => <ToggleStatus status={params.row.status} />,
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
      field: "actions",
      type: "actions",
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
  const { memberList, loading, error, memberCreated } = useSelector(
    (state) => ({
      error: state.member.error,
      memberList: state.member.memberList,
      loading: state.member.loading,
      memberCreated: state.member.memberCreated,
    })
  );

  if (memberList !== "" && memberList?.length > 0) {
    totalElements = memberList.length;
  }
  const rowCountRef = React.useRef(totalElements || 0);
  const rowCount = React.useMemo(() => {
    if (totalElements !== undefined) {
      rowCountRef.current = totalElements;
    }
    return rowCountRef.current;
  }, [totalElements]);

  useEffect(() => {
    const uListArr = [];
    if (memberList && memberList?.length > 0) {
      memberList.map((uList, index) => {
        let marketObject = {
          id: uList.id,
          name: uList.name,
          email: uList.email,
          phone: uList.mobile,
          userType: uList.user_type,
          status: uList.status,
          createdDate: moment(uList.created_date).format("DD-MM-YYYY"),
          updatedDate: moment(uList.updated_date).format("DD-MM-YYYY"),
        };
        uListArr.push(marketObject);
      });
      setUserDataList(uListArr);
    }
  }, [memberList]);

  useEffect(() => {
    dispatch(fetchMemberList());
  }, []);

  const addNewData = (data) => {
    dispatch(createMember(data)).then((data) => {
      console.log("data", data);
      if (data.payload.status === 200) {
        setOpen(false);
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
        setOpen(false);
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

  useEffect(() => {
    if (memberCreated) {
      dispatch(fetchMemberList());
    }
  }, [memberCreated]);

  const handleChangeStatus = (status) => {
    if (status.value === 1 || status.value === 2) {
      let statusValue = "";
      if (status.value === 1) {
        statusValue = 2;
      } else if (status.value === 2) {
        statusValue = 1;
      }
      let data = { id: status.id, status: statusValue };
      dispatch(changeStatus(data)).then((data) => {
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

  const addNew = () => {
    setOpen(true);
  };

  const handleChangePassword = (params) => {
    if (params.row.userType) {
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
    dispatch(resetMemberPassword(dataObject)).then((data) => {
      console.log("data", data);
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

  // const handleItemDetail = (params) => {
  //     //console.log('Details Item', params)
  // }

  // const handleItemEdit = (params) => {
  //     //console.log('Edit Item', params)
  // }

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
            {/* Title Grid Item */}
            <Grid item xs={4} sm={8} md={8} lg={8}>
              <Typography
                variant="h5"
                mb={2}
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                }}
              >
                Members
              </Typography>
            </Grid>

            {/* Button Grid Item */}
            <Grid item xs={8} sm={4} md={4} lg={4}>
              <Box display="flex" justifyContent="flex-end">
                <CommonButton
                  variant="contained"
                  onClick={addNew}
                  startIcon={<AddOutlinedIcon />}
                  sx={{ width: { xs: "100%", sm: "auto" } }} // Full width on mobile, auto width on tablet/desktop
                >
                  Add New Member
                </CommonButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <AddMember
            open={open}
            onClose={() => setOpen(false)}
            addNewData={addNewData}
          />
        </Box>
        <Box>
          <ChangePassword
            open={passwordChangeOpen}
            onClose={() => setPasswordChangeOpen(false)}
            addNewData={resetPasswordData}
            title="Reset Member Password"
          />
        </Box>
        <Box sx={{ mt: 5 }}>
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
  );
}

export default Members;
