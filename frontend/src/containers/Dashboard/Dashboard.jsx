import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkMultisiteProtocolExist,
  createProtocol,
  fetchProtocolList,
} from "../../services/Dashboard/DashboardService";
import { Box, TextField, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CommonButton from "../../components/CommonButton";
import moment from "moment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddResearch from "./AddResearch";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { protocolReport } from "../../services/UserManagement/UserService";
import Loader from "../../components/Loader";
import PreviewIcon from "@mui/icons-material/Preview";
import MultisiteChildProtocol from "./MultisiteAllProtocol";
import CTMProtocolReport from "./CTMProtocolReport";
import { uploadFile } from "../../services/UserManagement/UserService";
import CommonModal from "../../components/CommonModal/Modal";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function Dashboard() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = React.useState(false);
  const [isViewChildProtocolModalOpen, setIsViewChildProtocolModalOpen] =
    React.useState(false);
  const [viewChildProtocolData, setViewChildProtocolData] =
    React.useState(null);
  const [viewCTMProtocolData, setViewCTMProtocolData] = React.useState(null);
  const [isViewCTMModalOpen, setIsViewCTMModalOpen] = React.useState(false);

  const [protocolDataList, setProtocolDataList] = React.useState([]);
  const [user, setUser] = useState([]);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [isAddProtocolModalOpen, setIsAddProtocolModalOpen] =
    React.useState(false);
  const [addProtocolData, setAddProtocolData] = React.useState(null);
  const [options, setOptions] = useState("All");
  const optionsList = [
    "Created",
    "Under Review",
    "Approved",
    "Rejected",
    "All",
  ];
  var totalElements = 0;
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
  const navigateToCommunicationDetails = (params) => {
    navigate("/communication", {
      state: { details: params.row, identifierType: "user" },
    });
  };
  const navigateToUploadDocument = (params) => {
    navigate("/upload-protocol-document", {
      state: { details: params.row, identifierType: "user" },
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

  const handleViewCTMReport = (params) => {
    setIsViewCTMModalOpen(true);
    setViewCTMProtocolData(params.row);
  };
  const handleCloseCTMReport = (params) => {
    setIsViewCTMModalOpen(false);
    setViewCTMProtocolData(null);
  };

  const handleAddMoreClinicalSiteProtocol = (params) => {
    setIsAddProtocolModalOpen(true);
    setAddProtocolData({
      ...params,
      number_of_protocols: 0,
      error: {},
    });
  };

  const handleCloseAddProtocolModal = () => {
    setIsAddProtocolModalOpen(false);
    setAddProtocolData(null);
  };

  const handleSubmitForAddMoreProtocol = (data) => {
    const { number_of_protocols } = data;
    if (
      number_of_protocols === undefined ||
      number_of_protocols === null ||
      number_of_protocols === ""
    ) {
      setAddProtocolData({
        ...data,
        error: {
          ...data.error,
          number_of_protocols: "Error: Number of protocols can not be empty.",
        },
      });
      return;
    }
    const parsedNumber = parseInt(number_of_protocols, 10);
    if (isNaN(parsedNumber)) {
      setAddProtocolData({
        ...data,
        error: {
          ...data.error,
          number_of_protocols:
            "Error: Number of protocols should be a valid number.",
        },
      });
      return;
    }

    if (parsedNumber < 1) {
      setAddProtocolData({
        ...data,
        error: {
          ...data.error,
          number_of_protocols:
            "Error: Number of protocols can not be less than 1.",
        },
      });
      return;
    }

    if (parsedNumber > 10) {
      setAddProtocolData({
        ...data,
        error: {
          ...data.error,
          number_of_protocols:
            "Error: Number of protocols can not be greater than 10.",
        },
      });
      return;
    }

    const payload = {
      rowId: data.row.id,
      protocol_count: parsedNumber,
      protocol_type: data.row.researchType,
      protocol_id: data.row.protocolId,
      paymentType: "Multi-Site Joining Clinical Site",
    };
    navigateToPaymentPage(payload);
  };

  const navigateToPaymentPage = (params) => {
    navigate("/payment", {
      state: { details: params, identifierType: "add_more_site" },
    });
  };

  const getContentForAddMoreProtocol = () => {
    // show a number input
    return (
      <Box sx={{ width: "100%", maxWidth: "100%" }}>
        <TextField
          fullWidth
          label="Number of Protocols"
          id="number_of_protocols"
          name="number_of_protocols"
          value={addProtocolData?.number_of_protocols}
          onChange={(e) =>
            setAddProtocolData({
              ...addProtocolData,
              number_of_protocols: e.target.value,
            })
          }
          variant="outlined"
          type="number"
        />
        {addProtocolData?.error?.number_of_protocols && (
          <div className="error">
            {addProtocolData.error.number_of_protocols}
          </div>
        )}
      </Box>
    );
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
      field: "protocolStatus",
      headerName: "Protocol Status",
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
        params.row.protocolStatus !== "Created" &&
        params.row.researchType === "Multi-Site Sponsor" &&
        params.row.isParent
          ? [
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
                icon={<CloudUploadIcon />}
                label="Upload Document"
                onClick={() => navigateToUploadDocument(params)}
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
                label="Add More Clinical Site Protocol"
                onClick={() => handleAddMoreClinicalSiteProtocol(params)}
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
                icon={<CloudUploadIcon />}
                label="Upload Document"
                onClick={() => navigateToUploadDocument(params)}
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

  const { protocolList, loading, error, createdProtocol, pagination } =
    useSelector((state) => ({
      error: state.dashboard.error,
      protocolList: state.dashboard.protocolList?.data,
      loading: state.dashboard.loading,
      createdProtocol: state.dashboard.createdProtocol,
      pagination: state.dashboard.protocolList?.pagination,
    }));
  useEffect(() => {
    const data = {
      page: paginationModel.page,
      pageSize: paginationModel.pageSize,
      login_id: user.id,
      selectedStatus: options,
    };
    dispatch(fetchProtocolList(data));
  }, [
    dispatch,
    user.id,
    paginationModel.page,
    paginationModel.pageSize,
    options,
  ]);

  if (protocolList !== "" && protocolList?.length > 0) {
    totalElements = pagination?.totalRecords;
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
    if (protocolList && protocolList?.length > 0) {
      protocolList.map((pList, index) => {
        let protocolObject = {
          id: pList.id,
          protocolId: pList.protocol_id,
          researchType: pList.research_type,
          protocolStatus:
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
          protocolUserType: pList.protocol_user_type,
        };
        pListArr.push(protocolObject);
      });
      setProtocolDataList(pListArr);
    } else {
      setProtocolDataList();
    }
  }, [protocolList]);

  const addNewData = async (data, haveProtocolId = "") => {
    setLoader(true);
    if (haveProtocolId === "") {
      let dataObj = {
        research_type_id: data.research_type_id,
        login_id: user.id,
        protocol_user_type:
          data.research_type_id === "Principal Investigator"
            ? data.protocol_user_type
            : data.research_type_id,
      };

      if (
        data.research_type_id === "Principal Investigator" &&
        data.protocol_user_type !== "Commercial"
      ) {
        let pushed_file = [];
        if (data.attachments_file) {
          for (let file of data.attachments_file) {
            let id = await uploadFile(file, {
              userId: dataObj.login_id,
              protocolType: dataObj.research_type_id,
              informationType: "document_verification",
              subType: dataObj.protocol_user_type,
            });
            pushed_file.push(id);
          }
        }
      }

      dispatch(createProtocol(dataObj)).then((data) => {
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
        }
      });
      setLoader(false);
      return;
    } else {
      const updatedPayload = {
        ...data,
        loggedinUserId: user.id,
      };
      dispatch(checkMultisiteProtocolExist(updatedPayload)).then((data) => {
        if (data.payload.status === 200) {
          setOpen(false);
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
        } else {
          // setOpen(false);
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
        }
      });
      setLoader(false);
    }
  };

  useEffect(() => {
    if (createdProtocol) {
      const data = {
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        login_id: user.id,
      };
      dispatch(fetchProtocolList(data));
    }
  }, [createdProtocol]);

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

  const handleChange = (event) => {
    setOptions(event.target.value);
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
            <Grid item xs={12} sm={12} md={8} lg={8}>
              <Typography
                variant="h2"
                sx={{
                  textAlign: "left",
                  fontSize: { xs: "1.2rem", sm: "1.2rem", md: "1.5rem" },
                  fontWeight: "bold",
                }}
              >
                Protocol List
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              <Box display="flex" justifyContent="flex-end">
                <CommonButton
                  variant="contained"
                  onClick={addNew}
                  startIcon={<AddOutlinedIcon />}
                >
                  Add Research Protocol
                </CommonButton>
              </Box>
            </Grid>
          </Grid>
          {/* Dropdown for Role Selection */}
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{ marginTop: "2rem" }}
          >
            <FormControl fullWidth className="mt-mb-10">
              <InputLabel id="demo-simple-select-label">
                Search By Protocol Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Search By Protocol Status"
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
        </Box>
        <Box>
          <AddResearch
            open={open}
            onClose={() => setOpen(false)}
            addNewData={addNewData}
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

      <CommonModal
        open={isAddProtocolModalOpen}
        onClose={() => handleCloseAddProtocolModal()}
        title="Add More Clinical Site Protocol"
        subTitle=""
        content={getContentForAddMoreProtocol()}
        onSubmit={() => handleSubmitForAddMoreProtocol(addProtocolData)}
      />
    </>
  );
}

export default Dashboard;
