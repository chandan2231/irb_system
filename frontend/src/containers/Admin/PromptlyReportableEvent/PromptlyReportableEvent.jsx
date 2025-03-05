import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useNavigate } from "react-router-dom";
import { getPromptlyReportableEvent } from "../../../services/Admin/EventAndRequestService";

function AdminPromptlyReportableEvent() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [promptlyReportableEventDataList, setPromptlyReportableEventDataList] =
    React.useState([]);
  const [user, setUser] = useState([]);
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (userDetails) {
      setUser(userDetails);
    }
  }, []);
  const navigateReviewDetails = (params) => {
    navigate("/admin/promptly-reportable-event-details", {
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
  ];

  var totalElements = 0;
  const { promptlyReportableEventList, loading, error } = useSelector(
    (state) => ({
      error: state.admin.error,
      promptlyReportableEventList:
        state.admin.promptlyReportableEventList?.data,
      loading: state.admin.loading,
    })
  );
  useEffect(() => {
    dispatch(getPromptlyReportableEvent());
  }, [dispatch]);
  if (
    promptlyReportableEventList !== "" &&
    promptlyReportableEventList?.length > 0
  ) {
    totalElements = promptlyReportableEventList.length;
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
    if (
      promptlyReportableEventList &&
      promptlyReportableEventList?.length > 0
    ) {
      promptlyReportableEventList.map((pList, index) => {
        let protocolObject = {
          id: pList.id,
          protocolId: pList.protocol_id,
          researchType: pList.protocol_type,
          createdDate: moment(pList.created_at).format("DD MMM YYYY"),
          updatedDate: moment(pList.updated_at).format("DD MMM YYYY"),
        };
        pListArr.push(protocolObject);
      });
      setPromptlyReportableEventDataList(pListArr);
    }
  }, [promptlyReportableEventList]);

  return (
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
                mb: 2,
              }}
            >
              Promptly Reportable Event
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mt: 5 }}>
        <DataGrid
          rows={promptlyReportableEventDataList}
          columns={columns}
          rowCount={rowCount}
          loading={loading}
          paginationMode="server"
        />
      </Box>
    </Box>
  );
}

export default AdminPromptlyReportableEvent;
