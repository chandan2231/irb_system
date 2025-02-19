import * as React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CommonButton from "../../../components/CommonButton";
import moment from "moment";
import ToggleStatus from "../../../components/ToggleStatus";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  fetchActiveVotingMemberList,
  fetchMemberEventList,
} from "../../../services/Admin/MembersService";

function ProtocolEventList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [userId, setUserId] = useState();
  const [userDataList, setUserDataList] = useState([]);

  const columns = [
    {
      field: "event_date_time",
      headerName: "Event Date Time",
      flex: 2,
    },
    {
      field: "event_subject",
      headerName: "Subject",
      flex: 2,
    },
    {
      field: "protocol_name",
      headerName: "Protocol",
      flex: 2,
    },

    {
      field: "members",
      headerName: "Members",
      flex: 2,
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   width: 100,
    // },
    {
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) => [
        // <GridActionsCellItem
        //     icon={<LockResetIcon />}
        //     label="Change Password"
        //     onClick={() => handleChangePassword(params)}
        //     showInMenu
        // />,
        // <GridActionsCellItem
        //     icon={<DeleteIcon />}
        //     label="Delete"
        //     onClick={handleItemDelete(params)}
        //     showInMenu
        // />,
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
  const { memberEventList, loading, error, activeVotingMemberList } =
    useSelector((state) => ({
      error: state.member.error,
      memberEventList: state.member.memberEventList,
      loading: state.member.loading,
      activeVotingMemberList: state.member.activeVotingMemberList,
    }));

  if (memberEventList !== "" && memberEventList?.length > 0) {
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
    const uListArr = [];
    if (memberEventList && memberEventList?.length > 0) {
      memberEventList.map((uList, index) => {
        let listObject = {
          id: uList.id,
          event_date_time: "",
          event_subject: uList.event_subject,
          protocol_name: uList.protocol_name,
          members: uList.members,
          createdDate: moment(uList.created_date).format("DD-MM-YYYY"),
          // status: uList.status === 1 ? "Pending" : "Completed",
          // updatedDate: moment(uList.updated_date).format("DD-MM-YYYY"),
        };
        uListArr.push(listObject);
      });
      setUserDataList(uListArr);
    }
  }, [memberEventList]);

  useEffect(() => {
    dispatch(fetchMemberEventList());
  }, []);

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
  useEffect(() => {
    dispatch(fetchActiveVotingMemberList());
  }, [dispatch]);

  const navigateToaddNewEvent = (params) => {
    navigate("/admin/add-event");
  };

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
            <Grid item xs={12} sm={8} md={8} lg={8}>
              <Typography
                variant="h2"
                sx={{
                  textAlign: "left",
                  fontSize: { xs: "1.2rem", sm: "1.2rem", md: "1.5rem" },
                  fontWeight: "bold",
                }}
              >
                Protocol Meeting Events List
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <Box display="flex" justifyContent="flex-end">
                <CommonButton
                  variant="contained"
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => navigateToaddNewEvent()}
                >
                  Add Events
                </CommonButton>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 5 }}>
          <DataGrid
            rows={userDataList}
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

export default ProtocolEventList;
