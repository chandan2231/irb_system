import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreatedProtocolList,
  allowProtocolWaiveFee,
} from "../../../services/Admin/ProtocolListService";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import moment from "moment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useNavigate } from "react-router-dom";
import { protocolReport } from "../../../services/UserManagement/UserService";
import ToggleStatus from "../../../components/ToggleStatus";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../components/Loader";
import CTMProtocolReport from "../../Dashboard/CTMProtocolReport";
import PreviewIcon from "@mui/icons-material/Preview";

function CreatedProtocolList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = React.useState(false);
  const [protocolDataList, setProtocolDataList] = React.useState([]);
  const [user, setUser] = useState([]);
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

  const { createdProtocolList, loading, error, pagination } = useSelector(
    (state) => ({
      error: state.admin.error,
      loading: state.admin.loading,
      createdProtocolList: state.admin.createdProtocolList?.data,
      pagination: state.admin.createdProtocolList?.pagination,
    })
  );
  useEffect(() => {
    const data = {
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
    };
    dispatch(fetchCreatedProtocolList(data));
  }, [dispatch, user.id, paginationModel.page, paginationModel.pageSize]);

  if (createdProtocolList !== "" && createdProtocolList?.length > 0) {
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
    if (createdProtocolList && createdProtocolList?.length > 0) {
      createdProtocolList.map((pList, index) => {
        let protocolObject = {
          id: pList.id,
          protocolId: pList.protocol_id,
          researchType: pList.research_type,
          username: pList.name,
          email: pList.email,
          waiveFee: pList.waive_fee,
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
  }, [createdProtocolList]);

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
      console.log("error", error);
    }
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
                Created Protocol List
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
            pageSizeOptions={[5, 10, 20, 30, 40, 50, 100]}
            page={paginationModel.page}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
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
      </Box>
    </>
  );
}

export default CreatedProtocolList;
