import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import moment from "moment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import PreviewIcon from "@mui/icons-material/Preview";
import { useNavigate } from "react-router-dom";
import ToggleStatus from "../../../components/ToggleStatus";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import AddProtocolEvent from "./AddProtocolEvent";
import {
  fetchUnderReviewProtocolList,
  allowProtocolEdit,
} from "../../../services/Admin/ProtocolListService";
import { protocolReport } from "../../../services/UserManagement/UserService";
import {
  createProtocolEvent,
  assignProtocolToMember,
} from "../../../services/Admin/MembersService";
import AssignProtocolToMember from "./AssignProtocolToMember";
import Loader from "../../../components/Loader";
import MultisiteChildProtocol from "../../Dashboard/MultisiteAllProtocol";
import CTMProtocolReport from "../../Dashboard/CTMProtocolReport";

function UnderReviewProtocolList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = React.useState(false);
  const [protocolDataList, setProtocolDataList] = React.useState([]);
  const [user, setUser] = useState([]);
  const [open, setOpen] = useState(false);
  const [assignedMemberOpen, setAssignedMemberOpen] = useState(false);
  const [protocolDetails, setProtocolDetails] = useState();
  const [isViewChildProtocolModalOpen, setIsViewChildProtocolModalOpen] =
    React.useState(false);
  const [viewChildProtocolData, setViewChildProtocolData] =
    React.useState(null);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [isViewCTMModalOpen, setIsViewCTMModalOpen] = React.useState(false);
  const [viewCTMProtocolData, setViewCTMProtocolData] = React.useState(null);
  var totalElements = 0;

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (userDetails) {
      setUser(userDetails);
    }
  }, []);

  const navigateProtocolDetails = (params) => {
    navigate("/admin/protocol-details", {
      state: { details: params.row, type: "admin" },
    });
  };
  const navigateToCommunicationDetails = (params) => {
    navigate("/communication", {
      state: { details: params.row, identifierType: "admin" },
    });
  };

  const handleViewChildProtocol = (params) => {
    setIsViewChildProtocolModalOpen(true);
    setViewChildProtocolData(params.row);
  };
  const handleCloseViewChildProtocol = () => {
    setIsViewChildProtocolModalOpen(false);
    setViewChildProtocolData(null);
  };

  const columns = [
    {
      field: "protocolId",
      headerName: "Protocol Number",
      flex: 1,
      renderCell: (params) => (
        <a className="link-tag" onClick={() => navigateProtocolDetails(params)}>
          {params.value}
        </a>
      ),
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
      field: "actions",
      type: "actions",
      width: 80,
      getActions: (params) =>
        params.row.researchType === "Multi-Site Sponsor" && params.row.isParent
          ? [
              <GridActionsCellItem
                icon={<EditCalendarOutlinedIcon />}
                label="Assign Members"
                onClick={() => handleAssignedMemberToProtocol(params)}
                showInMenu
              />,
              // <GridActionsCellItem
              //   icon={<EditCalendarOutlinedIcon />}
              //   label="Add Event"
              //   onClick={() => handleAddProtocolEvent(params)}
              //   showInMenu
              // />,
              <GridActionsCellItem
                icon={<PictureAsPdfIcon />}
                label="View Pdf"
                onClick={() => handleViewPdf(params)}
                showInMenu
              />,
              <GridActionsCellItem
                icon={<CompareArrowsIcon />}
                label="Communication"
                onClick={() => navigateToCommunicationDetails(params)}
                showInMenu
              />,
              <GridActionsCellItem
                icon={<PreviewIcon />}
                label="View Clinical Site Protocol"
                onClick={() => handleViewChildProtocol(params)}
                showInMenu
              />,
              <GridActionsCellItem
                icon={<PreviewIcon />}
                label="View CTM Report"
                onClick={() => handleViewCTMReport(params)}
                showInMenu
              />,
            ]
          : [
              <GridActionsCellItem
                icon={<EditCalendarOutlinedIcon />}
                label="Assign Members"
                onClick={() => handleAssignedMemberToProtocol(params)}
                showInMenu
              />,
              // <GridActionsCellItem
              //   icon={<EditCalendarOutlinedIcon />}
              //   label="Add Event"
              //   onClick={() => handleAddProtocolEvent(params)}
              //   showInMenu
              // />,
              <GridActionsCellItem
                icon={<PictureAsPdfIcon />}
                label="View Pdf"
                onClick={() => handleViewPdf(params)}
                showInMenu
              />,
              <GridActionsCellItem
                icon={<CompareArrowsIcon />}
                label="Communication"
                onClick={() => navigateToCommunicationDetails(params)}
                showInMenu
              />,
              <GridActionsCellItem
                icon={<PreviewIcon />}
                label="View CTM Report"
                onClick={() => handleViewCTMReport(params)}
                showInMenu
              />,
            ],
    },
  ];

  const { underReviewProtocolList, loading, error, pagination } = useSelector(
    (state) => ({
      error: state.admin.error,
      loading: state.admin.loading,
      underReviewProtocolList: state.admin.underReviewProtocolList?.data,
      pagination: state.admin.underReviewProtocolList?.pagination,
    })
  );

  useEffect(() => {
    const data = {
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
    };
    dispatch(fetchUnderReviewProtocolList(data));
  }, [dispatch, user.id, paginationModel.page, paginationModel.pageSize]);

  if (underReviewProtocolList !== "" && underReviewProtocolList?.length > 0) {
    totalElements = pagination?.totalRecords;
  }
  const rowCountRef = React.useRef(totalElements || 0);
  const rowCount = React.useMemo(() => {
    if (totalElements !== undefined) {
      rowCountRef.current = totalElements;
    }
    return rowCountRef.current;
  }, [totalElements]);

  useEffect(() => {
    const pListArr = [];
    if (underReviewProtocolList && underReviewProtocolList?.length > 0) {
      underReviewProtocolList.map((pList, index) => {
        let protocolObject = {
          id: pList.id,
          protocolId: pList.protocol_id,
          researchType: pList.research_type,
          username: pList.name,
          email: pList.email,
          allowEdit: pList.allow_edit,
          status:
            pList.status === "1"
              ? "Created"
              : pList.status === "2"
                ? "Under Review"
                : pList.status === "3"
                  ? "Approved"
                  : "Rejected",
          createdDate: moment(pList.created_at).format("DD MMM YYYY"),
          updatedDate: moment(pList.updated_at).format("DD MMM YYYY"),
          isParent: pList.parent_protocol_id === "" ? true : false,
        };
        pListArr.push(protocolObject);
      });
      setProtocolDataList(pListArr);
    }
  }, [underReviewProtocolList]);

  const handleViewPdf = async (params) => {
    const { row } = params;
    const { protocolId, researchType } = row;
    const protocolReportPayload = {
      protocolId: protocolId,
      protocolType: researchType,
    };
    try {
      setLoader(true);
      let pdfResponse = await protocolReport(protocolReportPayload);
      setLoader(false);
      if (pdfResponse !== "") {
        window.open(pdfResponse.pdfUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };

  /* CHANGE STATUS API CALL */
  const handleChangeStatus = async (id, editStatus) => {
    if (Number(editStatus) === 1 || Number(editStatus) === 2) {
      let allowEditvalue = "";
      if (Number(editStatus) === 1) {
        allowEditvalue = 2;
      } else if (Number(editStatus) === 2) {
        allowEditvalue = 1;
      }
      let payloadData = { id: id, allow_edit: allowEditvalue };
      dispatch(allowProtocolEdit(payloadData)).then((data) => {
        if (data.payload.status === 200) {
          toast.success(data.payload.msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          const updatedProtocolDataList = protocolDataList.map((element) =>
            element.id === response.payload.data.id
              ? { ...element, allow_edit: response.payload.data.allowEditvalue }
              : element
          );
          setProtocolDataList(updatedProtocolDataList);
        } else {
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
    }
  };

  const handleAddProtocolEvent = (params) => {
    setOpen(true);
    setProtocolDetails(params?.row);
  };

  const addNewData = (addedData) => {
    const { event_subject, event_msg, member_id } = addedData;
    let membersArr = [];
    member_id.map((pList) => {
      membersArr.push(pList.id);
    });
    let data = {
      event_subject: event_subject,
      event_message: event_msg,
      member_id: membersArr,
      protocol_id: protocolDetails?.protocolId,
      protocol_name: protocolDetails?.researchType,
      created_by: user.id,
    };
    console.log("data ", data);
    // return
    dispatch(createProtocolEvent(data)).then((data) => {
      console.log("data", data);
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
        toast.error(data.payload.data.msg, {
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

  const handleAssignedMemberToProtocol = (params) => {
    setAssignedMemberOpen(true);
    setProtocolDetails(params?.row);
  };

  const addAssignedMemberData = (addedData) => {
    const { member_id } = addedData;
    let membersArr = [];
    member_id.map((pList) => {
      membersArr.push(pList.id);
    });
    let data = {
      member_id: membersArr,
      protocol_id: protocolDetails?.protocolId,
      protocol_name: protocolDetails?.researchType,
      created_by: user.id,
    };

    dispatch(assignProtocolToMember(data)).then((data) => {
      if (data.payload.status === 200) {
        setAssignedMemberOpen(false);
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
        setAssignedMemberOpen(false);
        toast.error(data.payload.data.msg, {
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

  const handleViewCTMReport = (params) => {
    setIsViewCTMModalOpen(true);
    setViewCTMProtocolData(params.row);
  };
  const handleCloseCTMReport = (params) => {
    setIsViewCTMModalOpen(false);
    setViewCTMProtocolData(null);
  };

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
            {/* Title Grid Item */}
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography
                variant="h2"
                sx={{
                  textAlign: "left",
                  fontSize: { xs: "1.2rem", sm: "1.2rem", md: "1.5rem" },
                  fontWeight: "bold",
                }}
              >
                Under Review Protocol List
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <AddProtocolEvent
            open={open}
            onClose={() => setOpen(false)}
            addNewData={addNewData}
            title={"Create Protocol Event"}
            protocolDetails={protocolDetails}
          />
        </Box>
        <Box>
          <AssignProtocolToMember
            open={assignedMemberOpen}
            onClose={() => setAssignedMemberOpen(false)}
            addAssignedMemberData={addAssignedMemberData}
            title={"Assign Protocol To Members"}
            protocolDetails={protocolDetails}
          />
        </Box>
        <Box sx={{ mt: 5 }}>
          <DataGrid
            rows={protocolDataList}
            columns={columns}
            rowCount={rowCount}
            loading={loading}
            pageSizeOptions={[5, 10, 20, 30, 40, 50, 100]}
            page={paginationModel.page}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
          />
        </Box>
      </Box>
      <Box>
        <MultisiteChildProtocol
          open={isViewChildProtocolModalOpen}
          data={viewChildProtocolData}
          onClose={() => handleCloseViewChildProtocol()}
        />
      </Box>
      <Box>
        <CTMProtocolReport
          open={isViewCTMModalOpen}
          data={viewCTMProtocolData}
          onClose={() => handleCloseCTMReport()}
          type="ctm"
        />
      </Box>
    </>
  );
}

export default UnderReviewProtocolList;
