import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  useTheme,
  TextField,
  FormHelperText,
  Button,
} from "@mui/material";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useForm, Controller } from "react-hook-form"; // Import Controller
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { fetchActiveVotingMemberList } from "../../../services/Admin/MembersService";
import { fetchUnderReviewProtocolAllList } from "../../../services/Admin/ProtocolListService";

// MUI components for checkboxes
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const defaultInputValues = {
  event_subject: "",
  event_msg: "",
  event_date_time: null, // Default to null for a blank date
  member_id: [], // Ensure it's initialized as an empty array
  protocol_id: [], // Ensure it's initialized as an empty array
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

function AddEvents() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [values, setValues] = useState(defaultInputValues);
  const [memberSelectionError, setMemberSelectionError] = useState();
  const [protocolSelectionError, setProtocolSelectionError] = useState();

  const { activeVotingMemberList, loading, error } = useSelector((state) => ({
    error: state.member.error,
    activeVotingMemberList: state.member.activeVotingMemberList,
    loading: state.member.loading,
  }));

  const { underReviewProtocolAllList } = useSelector((state) => ({
    underReviewProtocolAllList: state.admin.underReviewProtocolAllList,
  }));
  const activeVotingMemberListArr =
    activeVotingMemberList?.map((mList) => ({
      id: mList.id + "_" + mList.email,
      name: mList.name + " (" + mList.user_type + ")",
    })) || [];

  const underReviewProtocolListArr =
    underReviewProtocolAllList?.map((pList) => ({
      id: pList?.protocol_id + "_" + pList?.research_type,
      name: pList?.protocol_id + " (" + pList?.research_type + ")",
    })) || [];

  useEffect(() => {
    dispatch(fetchActiveVotingMemberList());
    dispatch(fetchUnderReviewProtocolAllList());
  }, [dispatch]);

  // Form validation schema using Yup
  const validationSchema = Yup.object().shape({
    event_subject: Yup.string().required("This is required"),
    event_msg: Yup.string().required("This is required"),
    event_date_time: Yup.date()
      .nullable()
      .required("Event date and time is required"), // Make date required
    member_id: Yup.array()
      .min(1, "At least one member must be selected")
      .required("Member selection required"),
    protocol_id: Yup.array()
      .min(1, "At least one protocol must be selected")
      .required("Protocol selection required"),
  });

  const {
    control, // Use control for controlled fields like Autocomplete
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Handle form submission
  const addNew = (data) => {
    console.log(data); // You should log the `data` from the form submission
    // addNewData(values); // You need to implement this function for actual submission
  };

  const handleCancelReplyButtonClicked = () => {
    navigate("/admin/protocol-event-list");
  };

  return (
    <Box m={theme.layoutContainer.layoutSection}>
      <Typography
        variant="h2"
        sx={{
          textAlign: "left",
          fontSize: { xs: "1.2rem", sm: "1.2rem", md: "1.5rem" },
          fontWeight: "bold",
        }}
      >
        Add Event
      </Typography>

      <Box sx={modalStyles.inputFields}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DateTimePicker"]}>
            <Controller
              name="event_date_time"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  label="Select Event date and Time"
                  value={values.event_date_time || null} // Ensure it can be null
                  onChange={(newValue) => {
                    setValues((prevValues) => ({
                      ...prevValues,
                      event_date_time: newValue,
                    }));
                    field.onChange(newValue); // Ensure React Hook Form updates the value
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            />
            {errors.event_date_time && (
              <FormHelperText error>
                {errors.event_date_time.message}
              </FormHelperText>
            )}
          </DemoContainer>
        </LocalizationProvider>

        <TextField
          placeholder="Enter the subject"
          name="event_subject"
          label="Event Subject"
          required
          {...register("event_subject")}
          error={!!errors.event_subject}
          helperText={errors.event_subject?.message}
          value={values.event_subject}
          onChange={(event) =>
            setValues((prevValues) => ({
              ...prevValues,
              event_subject: event.target.value,
            }))
          }
        />

        <TextField
          placeholder="Enter the event details"
          name="event_msg"
          label="Enter the event details"
          required
          rows={5}
          maxRows={5}
          multiline
          {...register("event_msg")}
          error={!!errors.event_msg}
          helperText={errors.event_msg?.message}
          value={values.event_msg}
          onChange={(event) =>
            setValues((prevValues) => ({
              ...prevValues,
              event_msg: event.target.value,
            }))
          }
        />

        <Controller
          name="protocol_id"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              fullWidth
              disableCloseOnSelect
              options={underReviewProtocolListArr}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Protocol"
                  placeholder="Select Protocol"
                  error={!!errors.protocol_id}
                  helperText={errors.protocol_id?.message}
                />
              )}
              onChange={(_, newValue) => {
                const protocolIds = newValue.map((member) => member.id);
                field.onChange(protocolIds); // Use React Hook Form's onChange to update the form value
              }}
            />
          )}
        />
        {protocolSelectionError && (
          <FormHelperText error>{protocolSelectionError}</FormHelperText>
        )}

        {/* Use Controller to bind Autocomplete to React Hook Form */}
        <Controller
          name="member_id"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              fullWidth
              disableCloseOnSelect
              options={activeVotingMemberListArr}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.name}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Members"
                  placeholder="Select Members"
                  error={!!errors.member_id}
                  helperText={errors.member_id?.message}
                />
              )}
              onChange={(_, newValue) => {
                const memberIds = newValue.map((member) => member.id);
                field.onChange(memberIds); // Use React Hook Form's onChange to update the form value
              }}
            />
          )}
        />
        {memberSelectionError && (
          <FormHelperText error>{memberSelectionError}</FormHelperText>
        )}

        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
          style={{ textAlign: "right" }}
        >
          <Button
            variant="outlined"
            color="error"
            type="button"
            onClick={handleCancelReplyButtonClicked}
            sx={{ mr: 2 }}
          >
            CANCEL
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="Submit"
            onClick={handleSubmit(addNew)}
          >
            SEND
          </Button>
        </Form.Group>
      </Box>
    </Box>
  );
}

export default AddEvents;
