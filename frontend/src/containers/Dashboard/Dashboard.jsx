import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkMultisiteProtocolExist,
  createProtocol,
  fetchProtocolList,
} from "../../services/Dashboard/DashboardService";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CommonButton from "../../components/CommonButton";
import moment from "moment";
import ToggleStatus from "../../components/ToggleStatus";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddResearch from "./AddResearch";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { protocolReport } from "../../services/UserManagement/UserService";
import Loader from "../../components/Loader";
import PreviewIcon from '@mui/icons-material/Preview';
import CommonModal from "../../components/CommonModal/Modal";
import MultisiteChildProtocol from "./MultisiteAllProtocol";

function Dashboard() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = React.useState(false);
  const [isViewChildProtocolModalOpen, setIsViewChildProtocolModalOpen] = React.useState(false);
  const [viewChildProtocolData, setViewChildProtocolData] = React.useState(null);

  const [protocolDataList, setProtocolDataList] = React.useState([]);
  const [user, setUser] = useState([]);
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
    setIsViewChildProtocolModalOpen(true)
    setViewChildProtocolData(params.row)
  }
  const handleCloseViewChildProtocol = () => {
    setIsViewChildProtocolModalOpen(false)
    setViewChildProtocolData(null)
  }
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
      getActions: (params) => params.row.protocolStatus !== "Created"
        &&
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
            label="View Child Protocol"
            onClick={() => handleViewChildProtocol(params)}
            showInMenu
          />
        ] : [
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
          // <GridActionsCellItem
          //     icon={<DeleteIcon />}
          //     label="Delete"
          //     onClick={handleItemDelete(params)}
          //     showInMenu
          // />,
        ],
    },
  ];

  var totalElements = 0;
  const { protocolList, loading, error, createdProtocol } = useSelector(
    (state) => ({
      error: state.dashboard.error,
      protocolList: state.dashboard.protocolList,
      loading: state.dashboard.loading,
      createdProtocol: state.dashboard.createdProtocol,
    })
  );
  useEffect(() => {
    const data = { login_id: user.id };
    dispatch(fetchProtocolList(data));
  }, [dispatch, user.id]);

  if (protocolList !== "" && protocolList?.length > 0) {
    totalElements = protocolList.length;
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
          createdDate: moment(pList.created_at).format("DD-MM-YYYY"),
          updatedDate: moment(pList.updated_at).format("DD-MM-YYYY"),
          isParent: pList.parent_protocol_id === "" ? true : false,
        };
        pListArr.push(protocolObject);
      });
      setProtocolDataList(pListArr);
    }
  }, [protocolList]);

  const addNewData = (data, haveProtocolId = "") => {
    setLoader(true);
    if (haveProtocolId === "") {
      let dataObj = {
        research_type_id: data.research_type_id,
        login_id: user.id,
      };
      if (data.research_type_id === "Principal Investigator") {
        dataObj = {
          ...dataObj,
          protocol_user_type: data.protocol_user_type
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
        console.log("datadatadata", data);
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
      const data = { login_id: user.id };
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

  // const handleItemDelete = (params) => {
  //     //console.log('Delete Item', params)
  // }

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
            <Grid item xs={5} sm={5} md={8} lg={8}>
              <Typography variant="h5" mb={2}>
                Protocol List
              </Typography>
            </Grid>
            <Grid item xs={7} sm={7} md={4} lg={4}>
              <Box display="flex" justifyContent="flex-end">
                <CommonButton
                  variant="contained"
                  onClick={addNew}
                  startIcon={<AddOutlinedIcon />}
                >
                  Add Research Type
                </CommonButton>
              </Box>
            </Grid>
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
            paginationMode="server"
          // onCellClick={(param) => handleChangeStatus(param)}
          // onRowClick={(param) => handleChangeStatus(param)}
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
    </>
  );
}

export default Dashboard;
