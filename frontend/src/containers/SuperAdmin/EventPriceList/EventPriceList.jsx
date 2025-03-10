import * as React from "react";
import { Box, TextField, Typography, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CommonButton from "../../../components/CommonButton";
import AddEventPrice from "./AddEventPrice";
import moment from "moment";
import ToggleStatus from "../../../components/ToggleStatus";
import {
  fetchEventPriceList,
  createEventPrice,
  changeStatus,
  updateEventPrice,
} from "../../../services/Admin/EventPriceService";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditIcon from "@mui/icons-material/Edit";
import CommonModal from "../../../components/CommonModal/Modal";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

function EventPriceList() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [eventPriceDataList, setEventPriceDataList] = useState([]);
  const [isEditPriceModalOpen, setIsEditPriceModalOpen] = useState(false);
  const [currentEditPriceRowDetails, setCurrentEditPriceRowDetails] = useState(
    {}
  );

  const handleEditPriceAction = (params) => {
    const { row } = params;
    setCurrentEditPriceRowDetails(row);
    setIsEditPriceModalOpen(true);
  };

  const columns = [
    {
      field: "eventName",
      headerName: "Event Name",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 1,
    //   renderCell: (params) => <ToggleStatus status={params.row.status} />,
    // },
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
          icon={<EditIcon />}
          label="Edit Price"
          onClick={() => handleEditPriceAction(params)}
          showInMenu
        />,
      ],
    },
  ];
  var totalElements = 0;
  const {
    eventPriceList,
    loading,
    error,
    eventPriceCreated,
    eventPriceUpdated,
  } = useSelector((state) => ({
    error: state.eventPrice.error,
    eventPriceList: state.eventPrice.eventPriceList,
    loading: state.eventPrice.loading,
    eventPriceCreated: state.eventPrice.eventPriceCreated,
    eventPriceUpdated: state.eventPrice.eventPriceUpdated,
  }));

  if (eventPriceList !== "" && eventPriceList?.length > 0) {
    totalElements = eventPriceList?.length;
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
    if (eventPriceList && eventPriceList?.length > 0) {
      eventPriceList.map((uList, index) => {
        let listObject = {
          id: uList.id,
          eventName: uList.event_type,
          price: `$${uList.price}`,
          // status: uList.status,
          createdDate: moment(uList.created_at).format("DD MMM YYYY"),
          updatedDate: moment(uList.updated_at).format("DD MMM YYYY"),
        };
        uListArr.push(listObject);
      });
      setEventPriceDataList(uListArr);
    }
  }, [eventPriceList]);

  useEffect(() => {
    dispatch(fetchEventPriceList());
  }, []);

  const addNewData = (data) => {
    dispatch(createEventPrice(data)).then((data) => {
      if (data.payload.status === 200) {
        setOpen(false);
        toast.success(data.payload.data, {
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
        toast.error(data.payload.data, {
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

  useEffect(() => {
    if (eventPriceCreated) {
      dispatch(fetchEventPriceList());
    }
  }, [eventPriceCreated]);

  useEffect(() => {
    if (eventPriceUpdated) {
      dispatch(fetchEventPriceList());
    }
  }, [eventPriceUpdated]);

  const addNew = () => {
    setOpen(true);
  };

  const modalStyles = {
    inputFields: {
      display: "flex",
      flexDirection: "column",
      marginTop: "20px",
      marginBottom: "15px",
      ".MuiFormControl-root": {
        marginBottom: "20px",
      },
    },
  };

  const priceRegex = /^(?:[1-9]\d{0,3}|\d{1,4})?(?:\.\d{1,2})?$/;

  // const priceRegex = /^(?:(?:0\.(?:0[1-9]|[1-9]\d?))|(?:[1-9]\d{0,2}(?:\.\d{1,2})?))$/;
  const validationSchema = Yup.object().shape({
    price: Yup.string()
      .required("Price is required")
      .matches(
        priceRegex,
        "Price must be greater than 0, less than 1000, and can have up to 2 decimal places"
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });

  const handlePriceChange = (value) => {
    setCurrentEditPriceRowDetails({
      ...currentEditPriceRowDetails,
      price: value,
    });
  };

  const handleSubmitForEditPrice = (data) => {
    const payload = {
      price: data.price,
      id: currentEditPriceRowDetails.id,
    };
    dispatch(updateEventPrice(payload)).then((data) => {
      if (data.payload.status === 200) {
        setCurrentEditPriceRowDetails({});
        setIsEditPriceModalOpen(false);
        reset();
        setOpen(false);
        toast.success(data.payload.data, {
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
        toast.error(data.payload, {
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

  const editPriceComponent = () => {
    return (
      <Box sx={modalStyles.inputFields} key={isEditPriceModalOpen}>
        <TextField
          placeholder={"Event Name"}
          name={"event_name"}
          label={"Event Name"}
          value={currentEditPriceRowDetails.eventName}
          disabled
        />
        <TextField
          placeholder={"Price"}
          name={"price"}
          label={"Price"}
          required
          {...register("price")}
          error={errors.price ? true : false}
          helperText={errors.price?.message}
          value={currentEditPriceRowDetails.price}
          onChange={(e) => handlePriceChange(e.target.value)}
        />
      </Box>
    );
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
                  mb: 2,
                }}
              >
                Event Price List
              </Typography>
            </Grid>

            {/* Button Grid Item */}
            <Grid item xs={12} sm={4} md={4} lg={4}>
              <Box display="flex" justifyContent="flex-end">
                <CommonButton
                  variant="contained"
                  onClick={addNew}
                  startIcon={<AddOutlinedIcon />}
                  sx={{ width: { xs: "100%", sm: "auto" } }} // Full width on mobile, auto width on tablet/desktop
                >
                  Add New Event Price
                </CommonButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <AddEventPrice
            open={open}
            onClose={() => setOpen(false)}
            addNewData={addNewData}
            title="Add Event Price"
          />
        </Box>
        <Box sx={{ mt: 5 }}>
          <DataGrid
            rows={eventPriceDataList}
            columns={columns}
            rowCount={rowCount}
            loading={loading}
            paginationMode="server"
          />
        </Box>

        {/* edit price modal */}
        <React.Fragment key={isEditPriceModalOpen}>
          <CommonModal
            open={isEditPriceModalOpen}
            onClose={() => {
              reset();
              setCurrentEditPriceRowDetails({});
              setIsEditPriceModalOpen(false);
            }}
            title={"Update Event Price"}
            subTitle=""
            content={editPriceComponent()}
            hideSubmitButton={false}
            hideCancelButton={false}
            onSubmit={handleSubmit(handleSubmitForEditPrice)}
          />
        </React.Fragment>
      </Box>
    </>
  );
}

export default EventPriceList;
