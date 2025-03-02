import * as React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CommonButton from "../../../components/CommonButton";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EventDetails from "./EventDetails";
import { ToggleStatusForAllowVoting } from "../../../components/ToggleStatus";
import { Chip } from "@mui/material";
import {
  fetchActiveVotingMemberList,
  fetchMemberEventList,
  allowVoteForMember,
} from "../../../services/Admin/MembersService";
import CommonModal from "../../../components/CommonModal/Modal";

function ProtocolEventList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [userId, setUserId] = useState();
  const [userDataList, setUserDataList] = useState([]);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] =
    React.useState(false);
  const [viewDetailsData, setViewDetailsData] = React.useState(null);
  const [confirmAllowVoting, setConfirmAllowVoting] = React.useState(false);
  const [currentAllowVotingData, setCurrentAllowVotingData] = React.useState(null);

  const columns = [
    {
      field: "event_date_time",
      headerName: "Event Date Time",
      flex: 2,
    },
    {
      field: "event_subject",
      headerName: "Subject",
      flex: 1,
    },
    {
      field: "protocol_name",
      headerName: "Protocol",
      flex: 1,
    },

    {
      field: "members",
      headerName: "Members",
      flex: 1,
    },
    {
      field: "allowVoting",
      headerName: "Allow Voting",
      flex: 1,
      renderCell: (params) => (
        <ToggleStatusForAllowVoting
          status={params.row.allowVoting}
          onStatusChange={(newAllowVoting) => {
            const payload = {
              id: params.row.id,
              allowVoting: newAllowVoting,
              protocol_id: params.row.event_protocols,
              params: params,
            };
            handleAllowVoteChange(payload);
          }}
        />
      ),
    },
    {
      field: "eventStatus",
      headerName: "Event Status",
      flex: 1,
      renderCell: (params) => params.row.eventStatus,
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
          icon={<VisibilityIcon />}
          label="View Details"
          onClick={() => handleViewDetails(params)}
          showInMenu
        />,
      ],
    },
  ];
  const handleViewDetails = (params) => {
    setIsViewDetailsModalOpen(true);
    setViewDetailsData(params.row);
  };
  const handleCloseDetails = (params) => {
    setIsViewDetailsModalOpen(false);
    setViewDetailsData(null);
  };
  var totalElements = 0;
  const {
    memberEventList,
    loading,
    error,
    activeVotingMemberList,
    votingAllowedForMember,
  } = useSelector((state) => ({
    error: state.member.error,
    memberEventList: state.member.memberEventList,
    loading: state.member.loading,
    activeVotingMemberList: state.member.activeVotingMemberList,
    votingAllowedForMember: state.member.votingAllowedForMember,
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
          event_date_time: uList.event_date_with_time,
          event_subject: uList.event_subject,
          protocol_name: uList.event_protocol_id_label,
          members: uList.member_with_role,
          createdDate: moment(uList.created_date).format("DD MMM YYYY"),
          allowVoting: Number(uList.allow_voting),
          eventStatus: <EventStatusLabel status={uList.status} />,
          updatedDate: moment(uList.updated_date).format("DD MMM YYYY"),
          event_protocols: uList.event_protocols,
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

  useEffect(() => {
    dispatch(fetchMemberEventList());
  }, [dispatch, votingAllowedForMember]);

  const navigateToaddNewEvent = (params) => {
    navigate("/admin/add-event");
  };


  const handleAllowVotingModalOpen = (status) => {
    setConfirmAllowVoting(true);
    setCurrentAllowVotingData(status);
  }

  const handleAllowVotingModalClose = () => {
    setConfirmAllowVoting(false);
    setCurrentAllowVotingData(null);
  }

  const handleAllowVoteChange = (status) => {
    //  if allow voting is 1, than disable it
    const { params } = status;
    const { allowVoting } = params.row;
    console.log("allowVoting", allowVoting);

    if (Number(allowVoting) === 2) {
      return
    }

    // open modal to allow voting
    return handleAllowVotingModalOpen(status);
  };

  const handleSubmitForAllowVoting = (status) => {
    console.log("handleSubmitForAllowVoting ====> ", status);
    // return;
    let data = {
      id: status?.id,
      allow_voting: status?.allowVoting,
      protocol_id: status?.protocol_id,
    };
    // return
    dispatch(allowVoteForMember(data)).then((data) => {
      console.log("data ====>", data);
      if (data.payload.status === 200) {
        toast.success(data.payload.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        handleAllowVotingModalClose();
      } else {
        toast.error(data.payload.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        handleAllowVotingModalClose();
      }
    });
  }

  const EventStatusLabel = ({ status }) => {
    const statusLabel = status === 1 ? "Pending" : "Completed";
    const color = status === 1 ? "primary" : "success"; // "primary" for Pending, "success" for Completed

    return (
      <Chip
        label={statusLabel}
        color={color}
        style={{ textTransform: "capitalize" }} // Optional, to make the first letter capitalized
      />
    );
  };

  const getContentForVotingForMember = () => {
    return (
      <Box>
        <Typography variant="h6" gutterBottom
          sx={{ fontSize: "20px" }}
        >
          Are you sure you want to allow voting for members?
        </Typography>
        <Typography variant="h6" gutterBottom
          style={{ color: "red" }}
          sx={{ fontSize: "20px" }}
        >
          *Once you allowed voting, it can't be reverted back.
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ fontSize: "20px" }}>
          Event Date Time: {currentAllowVotingData?.params?.row?.event_date_time}
        </Typography>
      </Box>
    );
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
                  Schedule Meeting
                </CommonButton>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 5 }}>
          <DataGrid
            rows={userDataList}
            columns={columns}
            pageSize={10}
            rowCount={userDataList.length}
            loading={false}
            paginationMode="server"
            disableSelectionOnClick
            autoHeight
          />
        </Box>
        {viewDetailsData !== null && (
          <Box>
            <EventDetails
              open={isViewDetailsModalOpen}
              data={viewDetailsData}
              onClose={() => handleCloseDetails()}
              type="view_event_details"
            />
          </Box>
        )}

        <CommonModal
          open={confirmAllowVoting}
          onClose={() => handleAllowVotingModalClose()}
          title="Allow Voting"
          subTitle=""
          content={getContentForVotingForMember()}
          onSubmit={() => handleSubmitForAllowVoting(currentAllowVotingData)}
        />

      </Box>
    </>
  );
}

export default ProtocolEventList;
