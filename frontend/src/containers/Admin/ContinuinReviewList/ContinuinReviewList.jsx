import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContinuinReviewProtocolList } from "../../../services/Admin/ContinuinReviewListService";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { continueinReviewReport } from "../../../services/UserManagement/UserService";
import Loader from "../../../components/Loader";

function ContinuinReviewList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [protocolDataList, setProtocolDataList] = useState([]);
  const [user, setUser] = useState([]);
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (userDetails) {
      setUser(userDetails);
    }
  }, []);
  const navigateReviewDetails = (params) => {
    navigate("/admin/continuin-review-details", {
      state: { details: params.row },
    });
  };
  const columns = [
    {
      field: "protocolId",
      headerName: "Protocol Number",
      flex: 1,
      renderCell: (params) => (
        <a className="link-tag" onClick={() => navigateReviewDetails(params)}>
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
        // <GridActionsCellItem
        //     icon={<RadioButtonUncheckedIcon />}
        //     label="View Report"
        //     onClick={() => handleChangeStatus(params)}
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
  const { continuinReviewProtocolList, loading, error } = useSelector(
    (state) => ({
      error: state.admin.error,
      continuinReviewProtocolList: state.admin.continuinReviewProtocolList,
      loading: state.admin.loading,
    })
  );
  useEffect(() => {
    dispatch(fetchContinuinReviewProtocolList());
  }, [dispatch, user.id]);

  if (
    continuinReviewProtocolList !== "" &&
    continuinReviewProtocolList?.length > 0
  ) {
    totalElements = continuinReviewProtocolList.length;
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
    if (
      continuinReviewProtocolList &&
      continuinReviewProtocolList?.length > 0
    ) {
      continuinReviewProtocolList.map((pList, index) => {
        let protocolObject = {
          id: pList.id,
          protocolId: pList.protocol_id,
          researchType: pList.research_type,
          createdDate: moment(pList.created_date).format("DD MMM YYYY"),
          updatedDate: moment(pList.updated_date).format("DD MMM YYYY"),
        };
        pListArr.push(protocolObject);
      });
      setProtocolDataList(pListArr);
    }
  }, [continuinReviewProtocolList]);

  const handleViewPdf = async (params) => {
    const { row } = params;
    const { protocolId, researchType } = row;
    const protocolReportPayload = {
      protocolId: protocolId,
      protocolType: researchType,
    };
    try {
      setLoader(true);
      let pdfResponse = await continueinReviewReport(protocolReportPayload);
      setLoader(false);
      if (pdfResponse !== "") {
        window.open(pdfResponse.pdfUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      setLoader(false);
      console.log("error", error);
    }
  };

  // const handleChangeStatus = async (params) => {
  //     let data = {}
  //     data.protocolId = params.row.protocolId
  //     data.researchType = params.row.researchType
  //     let id = await continueinReviewReport(data)
  // }
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
    <Box m={theme.layoutContainer.layoutSection}>
      <Box>
        <Grid container spacing={2}>
          {/* Title Grid Item */}
          <Grid item xs={12} sm={8} md={8} lg={8}>
            <Typography
              variant="h5"
              mb={2}
              sx={{
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
              }}
            >
              Continuing Review
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
          // onRowClick={(param) => handleChangeStatus(param)}
        />
      </Box>
    </Box>
  );
}

export default ContinuinReviewList;
