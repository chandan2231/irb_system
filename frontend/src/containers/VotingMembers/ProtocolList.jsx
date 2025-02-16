import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignMemberProtocolList } from "../../services/Admin/MembersService";
import { Box, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import moment from "moment";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useNavigate } from "react-router-dom";
import { protocolReport } from "../../services/UserManagement/UserService";
import ToggleStatus from "../../components/ToggleStatus";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../components/Loader";

function VotingMemberProtocolList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [protocolDataList, setProtocolDataList] = React.useState([]);
  const [loader, setLoader] = React.useState(false);

  const [user, setUser] = useState([]);
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (userDetails) {
      setUser(userDetails);
    }
  }, []);
  const navigateProtocolDetails = (params) => {
    navigate("/member/protocol-details", {
      state: { details: params.row, type: "member" },
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
      field: "assignedDate",
      headerName: "Assigned Date",
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
        //     label="Change Status"
        //     onClick={handleChangeStatus(params)}
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

  useEffect(() => {
    let data = { memberId: user.id };
    dispatch(fetchAssignMemberProtocolList(data));
  }, [dispatch, user.id]);

  var totalElements = 0;
  const { assignMemberProtocolList, loading, error } = useSelector((state) => ({
    error: state.member.error,
    assignMemberProtocolList: state.member.assignMemberProtocolList,
    loading: state.member.loading,
  }));

  if (
    assignMemberProtocolList?.data !== "" &&
    assignMemberProtocolList?.data?.length > 0
  ) {
    totalElements = assignMemberProtocolList?.data.length;
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
      assignMemberProtocolList?.data &&
      assignMemberProtocolList?.data?.length > 0
    ) {
      assignMemberProtocolList?.data?.map((pList, index) => {
        let protocolObject = {
          id: pList.id,
          protocolId: pList.protocol_id,
          researchType: pList.protocol_name,
          assignedDate: moment(pList.created_at).format("DD-MM-YYYY"),
          updatedDate: moment(pList.updated_at).format("DD-MM-YYYY"),
        };
        pListArr.push(protocolObject);
      });
      setProtocolDataList(pListArr);
    }
  }, [assignMemberProtocolList?.data]);

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

  // console.log('protocolList', protocolList)

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
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Typography
                variant="h2"
                sx={{
                  textAlign: "left",
                  fontSize: { xs: "1.2rem", sm: "1.2rem", md: "1.5rem" },
                  fontWeight: "bold",
                }}
              >
                Protocol Voting List
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
          />
        </Box>
      </Box>
    </>
  );
}

export default VotingMemberProtocolList;
