import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormGroup from "@mui/material/FormGroup";
import {
  createAdverseEvent,
  fetchEventAndRequestById,
} from "../../services/EventAndRequest/EventAndRequestService";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { CustomMUIFormLabel as FormLabel } from "../../components/Mui/CustomFormLabel";
import { CustomMUITextFieldWrapper as TextField } from "../../components/Mui/CustomTextField";
import { CustomDatePickerWrapper as DatePicker } from "../../components/Mui/CustomDatePickerWrapper";

const adverseEventSchema = yup.object().shape({
  protocol_number: yup.string().required("This is required"),
  participant_id_number: yup.string().required("This is required"),
  event_start_date: yup.string().required("This is required"),
  event_end_date: yup.string().required("This is required"),
  event_aware_date: yup.string().required("This is required"),
  irb_report_date: yup.string().required("This is required"),
  unexpected_event_explain: yup.string().when("unexpected_event", {
    is: "Yes" || "No",
    then: (schema) => schema.required("This is required"),
    otherwise: (schema) => schema,
  }),
  date_of_death: yup.string().when("event_nature", {
    is: "Death",
    then: (schema) => schema.required("This is required"),
    otherwise: (schema) => schema,
  }),
  event_nature_explain: yup.string().when("event_nature", {
    is: "Other",
    then: (schema) => schema.required("This is required"),
    otherwise: (schema) => schema,
  }),
  event_description: yup.string().required("This is required"),
  study_discontinued_explain: yup.string().when("study_discontinued", {
    is: "Yes",
    then: (schema) => schema.required("This is required"),
    otherwise: (schema) => schema,
  }),
  person_name: yup.string().required("This is required"),
  email: yup.string().required("This is required"),
  phone: yup.string().required("This is required"),
  your_name: yup.string().required("This is required"),
});

function AdverseEventsDetails() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const protocolDetails = location.state.details;
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [showUnexpectedEventTextArea, setShowUnexpectedEventTextArea] =
    React.useState(false);
  const [showEventNatureDateOfDeath, setShowEventNatureDateOfDeath] =
    React.useState(false);
  const [showEventNatureAdditionTextArea, setShowEventNatureAdditionTextArea] =
    React.useState(false);
  const [
    showStudyDiscontinuedAdditionTextArea,
    setShowStudyDiscontinuedAdditionTextArea,
  ] = React.useState(false);
  const [formData, setFormData] = useState({
    protocol_number: "",
    adverse_event_criteria: "",
    participant_id_number: "",
    event_start_date: "",
    event_end_date: "",
    event_aware_date: "",
    irb_report_date: "",
    severity_level: "",
    unexpected_event: "",
    unexpected_event_explain: "",
    event_nature: "",
    date_of_death: "",
    event_nature_explain: "",
    event_description: "",
    event_study_relationship: "",
    study_discontinued: "",
    study_discontinued_explain: "",
    person_name: "",
    email: "",
    phone: "",
    your_name: "",
    protocol_id: protocolDetails.protocolId,
    created_by: userDetails.id,
    protocol_type: protocolDetails.researchType,
  });
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    let data = {
      protocol_id: protocolDetails.protocolId,
      type: "adverse",
    };
    dispatch(fetchEventAndRequestById(data));
  }, [dispatch, userDetails.id]);

  const { adverseEventDetails, loading, error } = useSelector((state) => ({
    error: state.eventAndRequest.error,
    adverseEventDetails: state.eventAndRequest.eventAndRequestDetails,
    loading: state.eventAndRequest.loading,
  }));

  console.log("adverseEventDetails", adverseEventDetails);

  const handleAdverseEventCriteria = (event, radio_name) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSeverityLevel = (event, radio_name) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleUnexpectedEvent = (event, radio_name) => {
    if (radio_name === "unexpected_event" && event.target.value === "Yes") {
      setShowUnexpectedEventTextArea(true);
    } else if (
      radio_name === "unexpected_event" &&
      event.target.value === "No"
    ) {
      setShowUnexpectedEventTextArea(true);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleEventNature = (event, radio_name) => {
    if (radio_name === "event_nature" && event.target.value === "Death") {
      setShowEventNatureDateOfDeath(true);
      setShowEventNatureAdditionTextArea(false);
    } else if (
      radio_name === "event_nature" &&
      event.target.value === "Other"
    ) {
      setShowEventNatureDateOfDeath(false);
      setShowEventNatureAdditionTextArea(true);
    } else {
      setShowEventNatureDateOfDeath(false);
      setShowEventNatureAdditionTextArea(false);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleEventStudyRelationship = (event, radio_name) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStudyDiscontinued = (event, radio_name) => {
    if (radio_name === "study_discontinued" && event.target.value === "Yes") {
      setShowStudyDiscontinuedAdditionTextArea(true);
    } else if (
      radio_name === "study_discontinued" &&
      event.target.value === "No"
    ) {
      setShowStudyDiscontinuedAdditionTextArea(false);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      const getValidatedform = await adverseEventSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await adverseEventSchema.isValid(getValidatedform);
      // const isValid = true
      if (isValid === true) {
        dispatch(createAdverseEvent({ ...formData })).then((data) => {
          if (data.payload.status === 200) {
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
            setFormData({});
          } else {
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
      }
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        const firstErrorField = document.querySelector(
          `[name="${Object.keys(newErrors)[0]}"]`
        );
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  };
  return (
    <Box sx={{ width: "100%" }} style={{ padding: "1rem" }}>
      <h2 className="ml-20">
        Adverse Events Details ({protocolDetails.protocolId})
      </h2>
      <Box
        sx={{
          border: "1px solid #d3d3d3",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack on smaller screens
          gap: 1,
          justifyContent: { xs: "center", sm: "flex-start" }, // Center on small screens
          flexWrap: "wrap", // Allow wrapping for smaller screens
          margin: { xs: "0 8px", sm: "0 24px", md: "0 24px" },
          overflow: "hidden", // Prevent any overflow from buttons
        }}
      >
        <Box
          sx={{
            padding: "25px",
          }}
        >
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
          <form onSubmit={handleSubmitData} id="protocol_information">
            <Form.Group
              as={Col}
              controlId="validationFormik07"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Protocol number *"
                  id="protocol_number"
                  name="protocol_number"
                  onChange={handleChange}
                  value={formData.protocol_number}
                />
              </Box>
              {errors.protocol_number && (
                <div className="error">{errors.protocol_number}</div>
              )}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik01"
              className="mt-mb-20"
            >
              <FormControl>
                <div className="highlight-text">
                  An adverse event is any untoward medical occurrence that
                  includes one or more of the following regardless of causality:
                  death, is life-threatening, requires in-patient
                  hospitalization, results in prolongation of current
                  hospitalization, results in disability (acute or chronic),
                  results in a birth defect, is an important medical event that
                  requires intervention, and/or may jeopardize the health of the
                  research participant
                </div>
              </FormControl>
            </Form.Group>

            <Form.Group
              as={Col}
              controlId="validationFormik01"
              className="mt-mb-20"
            >
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Does the adverse event meet the criteria above?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="adverse_event_criteria"
                  onChange={(event) =>
                    handleAdverseEventCriteria(event, "adverse_event_criteria")
                  }
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Form.Group>

            <Form.Group
              as={Col}
              controlId="validationFormik06"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Participant ID Number *"
                  id="participant_id_number"
                  name="participant_id_number"
                  onChange={handleChange}
                  value={formData.participant_id_number}
                />
              </Box>
              {errors.participant_id_number && (
                <div className="error">{errors.participant_id_number}</div>
              )}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik08"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Event occur start date *"
                    onChange={(newValue) =>
                      setFormData({
                        ...formData,
                        event_start_date: dayjs(newValue).format("YYYY-MM-DD"),
                      })
                    }
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ width: "50%" }}
                  />
                </LocalizationProvider>
                {/* <TextField fullWidth label="Event occur start date *" id="event_start_date" name="event_start_date" onChange={handleChange} value={formData.event_start_date} /> */}
              </Box>
              {errors.event_start_date && (
                <div className="error">{errors.event_start_date}</div>
              )}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik08"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Event occur end date *"
                    onChange={(newValue) =>
                      setFormData({
                        ...formData,
                        event_end_date: dayjs(newValue).format("YYYY-MM-DD"),
                      })
                    }
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ width: "50%" }}
                  />
                </LocalizationProvider>
                {/* <TextField fullWidth label="Event occur end date *" id="event_end_date" name="event_end_date" onChange={handleChange} value={formData.event_end_date} /> */}
              </Box>
              {errors.event_end_date && (
                <div className="error">{errors.event_end_date}</div>
              )}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik08"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="When did you become aware of this event *"
                    onChange={(newValue) =>
                      setFormData({
                        ...formData,
                        event_aware_date: dayjs(newValue).format("YYYY-MM-DD"),
                      })
                    }
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ width: "50%" }}
                  />
                </LocalizationProvider>
                {/* <TextField fullWidth label="When did you become aware of this event *" id="event_aware_date" name="event_aware_date" onChange={handleChange} value={formData.event_aware_date} /> */}
              </Box>
              {errors.event_aware_date && (
                <div className="error">{errors.event_aware_date}</div>
              )}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik08"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of report to IRB *"
                    onChange={(newValue) =>
                      setFormData({
                        ...formData,
                        irb_report_date: dayjs(newValue).format("YYYY-MM-DD"),
                      })
                    }
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ width: "50%" }}
                  />
                </LocalizationProvider>
                {/* <TextField fullWidth label="Date of report to IRB *" id="irb_report_date" name="irb_report_date" onChange={handleChange} value={formData.irb_report_date} /> */}
              </Box>
              {errors.irb_report_date && (
                <div className="error">{errors.irb_report_date}</div>
              )}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik01"
              className="mt-mb-20"
            >
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Which level of severity best describes the nature of the
                  event?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="severity_level"
                  onChange={(event) =>
                    handleSeverityLevel(event, "severity_level")
                  }
                >
                  <FormControlLabel
                    value="Mild (asymptomatic or mild symptoms not requiring intervention, clinical or diagnostic observations only)"
                    control={<Radio />}
                    label="Mild (asymptomatic or mild symptoms not requiring intervention, clinical or diagnostic observations only)"
                  />
                  <FormControlLabel
                    value="Moderate (minimal or non-invasive intervention required, limiting age-appropriate activities)"
                    control={<Radio />}
                    label="Moderate (minimal or non-invasive intervention required, limiting age-appropriate activities)"
                  />
                  <FormControlLabel
                    value="Severe/medically significant (not immediately life-threatening, requires hospitalization/ prolongation of current hospitalization, disabling"
                    control={<Radio />}
                    label="Severe/medically significant (not immediately life-threatening, requires hospitalization/ prolongation of current hospitalization, disabling)"
                  />
                  <FormControlLabel
                    value="Life-threatening (urgent intervention required to prevent death or other serious outcome including significant disability whether acute or long-term)"
                    control={<Radio />}
                    label="Life-threatening (urgent intervention required to prevent death or other serious outcome including significant disability whether acute or long-term)"
                  />
                  <FormControlLabel
                    value="Death related to adverse event"
                    control={<Radio />}
                    label="Death related to adverse event"
                  />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik01"
              className="mt-mb-20"
            >
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Was this event unexpected?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="unexpected_event"
                  onChange={(event) =>
                    handleUnexpectedEvent(event, "unexpected_event")
                  }
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            {showUnexpectedEventTextArea === true && (
              <Form.Group
                as={Col}
                controlId="validationFormik03"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Explain *"
                    name="unexpected_event_explain"
                    fullWidth
                    id="explain"
                    rows={3}
                    multiline
                    onChange={handleChange}
                    value={formData.unexpected_event_explain}
                  />
                </Box>
                {errors.unexpected_event_explain && (
                  <div className="error">{errors.unexpected_event_explain}</div>
                )}
              </Form.Group>
            )}

            <Form.Group
              as={Col}
              controlId="validationFormik01"
              className="mt-mb-20"
            >
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Which category best describes the nature of the event?
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="event_nature"
                  onChange={(event) => handleEventNature(event, "event_nature")}
                >
                  <FormControlLabel
                    value="Death"
                    control={<Radio />}
                    label="Death"
                  />
                  <FormControlLabel
                    value="Life-threatening"
                    control={<Radio />}
                    label="Life-threatening"
                  />
                  <FormControlLabel
                    value="Required in-patient hospitalization"
                    control={<Radio />}
                    label="Required in-patient hospitalization"
                  />
                  <FormControlLabel
                    value="Resulted in prolongation of current hospitalization"
                    control={<Radio />}
                    label="Resulted in prolongation of current hospitalization"
                  />
                  <FormControlLabel
                    value="Resulted in disability (acute or chronic)"
                    control={<Radio />}
                    label="Resulted in disability (acute or chronic)"
                  />
                  <FormControlLabel
                    value="Resulted in a birth defect"
                    control={<Radio />}
                    label="Resulted in a birth defect"
                  />
                  <FormControlLabel
                    value="An important medical event that required intervention"
                    control={<Radio />}
                    label="An important medical event that required intervention"
                  />
                  <FormControlLabel
                    value="Jeopardized/possibly jeopardized the health of the research participant"
                    control={<Radio />}
                    label="Jeopardized/possibly jeopardized the health of the research participant"
                  />
                  <FormControlLabel
                    value="Other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            {showEventNatureDateOfDeath === true && (
              <Form.Group
                as={Col}
                controlId="validationFormik03"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date of death *"
                      onChange={(newValue) =>
                        setFormData({
                          ...formData,
                          date_of_death: dayjs(newValue).format("YYYY-MM-DD"),
                        })
                      }
                      renderInput={(params) => <TextField {...params} />}
                      sx={{ width: "50%" }}
                    />
                  </LocalizationProvider>
                  {/* <TextField fullWidth label="Date of death *" id="date_of_death" name="date_of_death" onChange={handleChange} value={formData.date_of_death} /> */}
                </Box>
                {errors.date_of_death && (
                  <div className="error">{errors.date_of_death}</div>
                )}
              </Form.Group>
            )}
            {showEventNatureAdditionTextArea === true && (
              <Form.Group
                as={Col}
                controlId="validationFormik03"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Explain *"
                    name="event_nature_explain"
                    fullWidth
                    id="event_nature_explain"
                    rows={3}
                    multiline
                    onChange={handleChange}
                    value={formData.event_nature_explain}
                  />
                </Box>
                {errors.event_nature_explain && (
                  <div className="error">{errors.event_nature_explain}</div>
                )}
              </Form.Group>
            )}
            <Form.Group
              as={Col}
              controlId="validationFormik03"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Use the text box below to describe the event in as much detail
                  as is available
                </FormLabel>
                <TextField
                  variant="outlined"
                  placeholder="Explain *"
                  name="event_description"
                  fullWidth
                  id="event_description"
                  rows={5}
                  multiline
                  onChange={handleChange}
                  value={formData.event_description}
                />
              </Box>
              {errors.event_description && (
                <div className="error">{errors.event_description}</div>
              )}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik01"
              className="mt-mb-20"
            >
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Relationship of event to study
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="event_study_relationship"
                  onChange={(event) =>
                    handleEventStudyRelationship(
                      event,
                      "event_study_relationship"
                    )
                  }
                >
                  <FormControlLabel
                    value="Unrelated (event is clearly NOT related to the study)"
                    control={<Radio />}
                    label="Unrelated (event is clearly NOT related to the study)"
                  />
                  <FormControlLabel
                    value="Unlikely (it is doubtful the event is related to the study)"
                    control={<Radio />}
                    label="Unlikely (it is doubtful the event is related to the study)"
                  />
                  <FormControlLabel
                    value="Possible (there is a chance the event could be related to the study)"
                    control={<Radio />}
                    label="Possible (there is a chance the event could be related to the study)"
                  />
                  <FormControlLabel
                    value="Probable (it is likely the event is related to the study)"
                    control={<Radio />}
                    label="Probable (it is likely the event is related to the study)"
                  />
                  <FormControlLabel
                    value="Related (event is clearly related to the study)"
                    control={<Radio />}
                    label="Related (event is clearly related to the study)"
                  />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik04">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Was the study discontinued for this participant as a result of
                  the event?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="study_discontinued"
                  onChange={(event) =>
                    handleStudyDiscontinued(event, "study_discontinued")
                  }
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            {showStudyDiscontinuedAdditionTextArea === true && (
              <Form.Group
                as={Col}
                controlId="validationFormik05"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Explain *"
                    name="study_discontinued_explain"
                    fullWidth
                    id="explain"
                    rows={3}
                    multiline
                    onChange={handleChange}
                    value={formData.study_discontinued_explain}
                  />
                </Box>
                {errors.study_discontinued_explain && (
                  <div className="error">
                    {errors.study_discontinued_explain}
                  </div>
                )}
              </Form.Group>
            )}
            <Form.Group
              as={Col}
              controlId="validationFormik01"
              className="mt-mb-20"
            >
              <FormControl>
                <div className="highlight-text">
                  Please note that severity, category, and causality of adverse
                  event must be determined by the site’s principal investigator.
                  No other study personnel may determine the nature of the
                  event. This form must be approved of by the PI prior to
                  submission. Your electronic signature below guarantees that
                  all information provided in this form was reviewed and
                  completed by the PI prior to submission.
                </div>
              </FormControl>
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik08"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Person submitting this form *"
                  id="person_name"
                  name="person_name"
                  onChange={handleChange}
                  value={formData.person_name}
                />
              </Box>
              {errors.person_name && (
                <div className="error">{errors.person_name}</div>
              )}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik08"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Email *"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </Box>
              {errors.email && <div className="error">{errors.email}</div>}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik08"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Phone *"
                  id="phone"
                  name="phone"
                  onChange={handleChange}
                  value={formData.phone}
                />
              </Box>
              {errors.phone && <div className="error">{errors.phone}</div>}
            </Form.Group>
            <h3>Acknowledgement</h3>
            <Form.Group
              as={Col}
              controlId="validationFormik01"
              className="mt-mb-20"
            >
              <FormControl>
                <FormGroup>
                  <FormLabel>
                    - By submitting this form you confirm the following is true
                    and accurate to the best of your knowledge:
                  </FormLabel>
                  <FormLabel>
                    - The information in this form is accurate and complete
                  </FormLabel>
                  <FormLabel>
                    - You are an authorized designee to submit this information
                  </FormLabel>
                  <FormLabel>
                    - The principal investigator has full awareness of the
                    information submitted within this form
                  </FormLabel>
                </FormGroup>
              </FormControl>
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik06"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Type Name (Electronic Signature) *"
                  id="your_name"
                  name="your_name"
                  onChange={handleChange}
                  value={formData.your_name}
                />
              </Box>
              <div className="highlight-text">
                Note: Your name above is the equivalent of a hand-written
                signature and is legally binding. Your signature confirms that
                you are authorized to submit this document and you acknowledge
                that it is accurate.
              </div>
              {errors.your_name && (
                <div className="error">{errors.your_name}</div>
              )}
            </Form.Group>
            <Form.Group
              as={Col}
              controlId="validationFormik010"
              className="mt-mb-20"
              style={{ textAlign: "right" }}
            >
              <Button variant="contained" color="primary" type="Submit">
                SUBMIT
              </Button>
            </Form.Group>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default AdverseEventsDetails;
