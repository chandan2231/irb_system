import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import moment from "moment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import { fetchUnderReviewProtocolList } from "../../services/Admin/ProtocolListService";
import { protocolReport } from "../../services/UserManagement/UserService";


function CommitteeChairProtocolList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [protocolDataList, setProtocolDataList] = React.useState([]);
  const [user, setUser] = useState([]);
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (userDetails) {
      setUser(userDetails);
    }
  }, []);
  const navigateProtocolDetails = (params) => {
    navigate("/committee-chair/protocol-details", { state: { details: params.row, type: 'committee-chair' } });
  };
  const navigateMemberApprovalDetails = (params) => {
    navigate("/committee-chair/approval-member-details", { state: { details: params.row, type: 'committee-chair' } });
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
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditCalendarOutlinedIcon />}
          label="View Members Approval"
          onClick={() => navigateMemberApprovalDetails(params)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<PictureAsPdfIcon />}
          label="View Pdf"
          onClick={() => handleViewPdf(params)}
          showInMenu
        />,
        // <GridActionsCellItem
        //   icon={<EditCalendarOutlinedIcon />}
        //   label="Add Event"
        //   onClick={() => handleAddProtocolEvent(params)}
        //   showInMenu
        // />,
        
      ],
    },
  ];

  var totalElements = 0;
  const { underReviewProtocolList, loading, error } = useSelector((state) => ({
    error: state.admin.error,
    underReviewProtocolList: state.admin.underReviewProtocolList,
    loading: state.admin.loading,
  }));
  useEffect(() => {
    dispatch(fetchUnderReviewProtocolList());
  }, [dispatch, user.id]);
  if (underReviewProtocolList !== "" && underReviewProtocolList?.length > 0) {
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
    const pListArr = [];
    if (underReviewProtocolList && underReviewProtocolList?.length > 0) {
      underReviewProtocolList.map((pList, index) => {
        let protocolObject = {
          id: pList.id,
          protocolId: pList.protocol_id,
          researchType: pList.research_type,
          status:
            pList.status === "1"
              ? "Created"
              : pList.status === "2"
                ? "Under Review"
                : pList.status === "3"
                  ? "Approved"
                  : "Rejected",
          createdDate: moment(pList.created_at).format("DD-MM-YYYY"),
          updatedDate: moment(pList.updated_at).format("DD-MM-YYYY"),
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
    let pdfResponse = await protocolReport(protocolReportPayload);
    if (pdfResponse !== "") {
      window.open(pdfResponse.pdfUrl, "_blank", "noopener,noreferrer");
    }
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
                    <Grid item xs={5} sm={5} md={8} lg={8}>
                    <Typography variant="h5" mb={2}>
                        Protocol List
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
                // onCellClick={(param) => handleChangeStatus(param)}
            />
            </Box>
        </Box>
        </>
    );
}

export default CommitteeChairProtocolList;
