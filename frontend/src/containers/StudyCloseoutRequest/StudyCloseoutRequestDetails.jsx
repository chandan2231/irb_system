import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import {
  createStudyCloseoutRequest,
  fetchEventAndRequestById,
} from "../../services/EventAndRequest/EventAndRequestService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Loader from "../../components/Loader";
import { CustomMUIFormLabel as FormLabel } from "../../components/Mui/CustomFormLabel";
import { CustomMUITextFieldWrapper as TextField } from "../../components/Mui/CustomTextField";
import { CustomDatePickerWrapper as DatePicker } from "../../components/Mui/CustomDatePickerWrapper";

const studyCloseSchema = yup.object().shape({
  protocol_number: yup.string().required("This is required"),
  pi_name: yup.string().required("This is required"),
  study_closeout_reason: yup.string().required("This is required"),
  study_closeout_reason_other: yup.string().when("study_closeout_reason", {
    is: "Other",
    then: (schema) => schema.required("This is required"),
    otherwise: (schema) => schema,
  }),
  subject_enrolled_number: yup.string().required("This is required"),
  subject_withdrew_number: yup.string().required("This is required"),
  subject_withdrew_by_other: yup.string().required("This is required"),
  subject_fails: yup.string().required("This is required"),
  subject_lost_followup: yup.string().required("This is required"),
  subject_completed: yup.string().required("This is required"),
  subject_complaints_review_explain: yup.string().when("subject_complaints_review", {
    is: "Yes",
    then: (schema) => schema.required("This is required"),
    otherwise: (schema) => schema,
  }),
  not_reported_irb_explain: yup.string().when("not_reported_irb", {
    is: "Yes",
    then: (schema) => schema.required("This is required"),
    otherwise: (schema) => schema,
  }),
  promptly_reportable_info: yup.string().required("This is required"),
  adverse_event_info: yup.string().required("This is required"),
  your_name: yup.string().required("This is required"),
});

function StudyCloseoutRequestDetails() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const protocolDetails = location.state.details;
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(false)

  // Local state for extra UI flags
  const [showStudyCloseoutReason, setShowStudyCloseoutReason] = useState(false);
  const [showSubjectComplaintsReviewTextbox, setShowSubjectComplaintsReviewTextbox] = useState(false);
  const [showChangesNotReportedToIRBTextbox, setShowChangesNotReportedToIRBTextbox] = useState(false);
  const [showErrorMsgPromptlyReportableNotSubmitted, setShowErrorMsgPromptlyReportableNotSubmitted] = useState("");
  const [showErrorMsgAdverseEventNotSubmitted, setShowErrorMsgAdverseEventNotSubmitted] = useState("");
  const [termsSelected, setTermsSelected] = useState(false);

  // Initial form state
  const [formData, setFormData] = useState({
    protocol_number: "",
    pi_name: "",
    study_completion_date: null,
    study_closeout_reason: "",
    study_closeout_reason_other: "",
    subject_enrolled_number: "",
    subject_withdrew_number: "",
    subject_withdrew_by_other: "",
    subject_fails: "",
    subject_lost_followup: "",
    subject_completed: "",
    subject_complaints_review: "",
    subject_complaints_review_explain: "",
    not_reported_irb: "",
    not_reported_irb_explain: "",
    promptly_reportable_info: "",
    adverse_event_info: "",
    your_name: "",
    protocol_id: protocolDetails.protocolId,
    created_by: userDetails.id,
    protocol_type: protocolDetails.researchType,
  });
  const [errors, setErrors] = useState({});

  // Fetch study closeout details on mount
  useEffect(() => {
    const data = {
      protocol_id: protocolDetails.protocolId,
      type: "closeout",
    };
    dispatch(fetchEventAndRequestById(data));
  }, [dispatch, protocolDetails.protocolId, userDetails.id]);

  const { studyCloseoutRequestDetails, loading, error } = useSelector((state) => ({
    error: state.eventAndRequest.error,
    studyCloseoutRequestDetails: state.eventAndRequest.eventAndRequestDetails,
    loading: state.eventAndRequest.loading,
  }));

  console.log("studyCloseoutRequestDetails", studyCloseoutRequestDetails);

  // Prefill the form when fetched details are available
  useEffect(() => {
    if (
      studyCloseoutRequestDetails &&
      studyCloseoutRequestDetails.data &&
      studyCloseoutRequestDetails.data.data &&
      studyCloseoutRequestDetails.data.data.length > 0
    ) {
      const fetchedData = studyCloseoutRequestDetails.data.data[0];
      setFormData((prev) => ({
        ...prev,
        protocol_number: fetchedData?.protocol_number || "",
        pi_name: fetchedData?.pi_name || "",
        study_completion_date: fetchedData?.study_completion_date
          ? dayjs(fetchedData.study_completion_date).format("YYYY-MM-DD")
          : null,
        study_closeout_reason: fetchedData?.study_closeout_reason || "",
        study_closeout_reason_other: fetchedData?.study_closeout_reason_other || "",
        subject_enrolled_number: fetchedData?.subject_enrolled_number || "",
        subject_withdrew_number: fetchedData?.subject_withdrew_number || "",
        subject_withdrew_by_other: fetchedData?.subject_withdrew_by_other || "",
        subject_fails: fetchedData?.subject_fails || "",
        subject_lost_followup: fetchedData?.subject_lost_followup || "",
        subject_completed: fetchedData?.subject_completed || "",
        subject_complaints_review: fetchedData?.subject_complaints_review || "",
        subject_complaints_review_explain: fetchedData?.subject_complaints_review_explain || "",
        not_reported_irb: fetchedData?.not_reported_irb || "",
        not_reported_irb_explain: fetchedData?.not_reported_irb_explain || "",
        promptly_reportable_info: fetchedData?.promptly_reportable_info || "",
        adverse_event_info: fetchedData?.adverse_event_info || "",
        your_name: fetchedData?.your_name || "",
      }));

      // Set flags based on fetched values
      setShowStudyCloseoutReason(fetchedData?.study_closeout_reason === "Other");
      setShowSubjectComplaintsReviewTextbox(fetchedData?.subject_complaints_review === "Yes");
      setShowChangesNotReportedToIRBTextbox(fetchedData?.not_reported_irb === "Yes");
    }
  }, [studyCloseoutRequestDetails]);

  // Handlers for updating state
  const handleStudyCloseoutReason = (event, radio_name) => {
    if (radio_name === "study_closeout_reason" && event.target.value === "Other") {
      setShowStudyCloseoutReason(true);
    } else if (radio_name === "study_closeout_reason" && event.target.value !== "Other") {
      setShowStudyCloseoutReason(false);
    }
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectComplainsReview = (event, radio_name) => {
    if (radio_name === "subject_complaints_review" && event.target.value === "Yes") {
      setShowSubjectComplaintsReviewTextbox(true);
    } else if (radio_name === "subject_complaints_review" && event.target.value === "No") {
      setShowSubjectComplaintsReviewTextbox(false);
    }
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangesNotReportedToIRB = (event, radio_name) => {
    if (radio_name === "not_reported_irb" && event.target.value === "Yes") {
      setShowChangesNotReportedToIRBTextbox(true);
    } else if (radio_name === "not_reported_irb" && event.target.value === "No") {
      setShowChangesNotReportedToIRBTextbox(false);
    }
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePromptlyReportableInfo = (event, radio_name) => {
    if (radio_name === "promptly_reportable_info" && event.target.value === "Yes") {
      setShowErrorMsgPromptlyReportableNotSubmitted(
        "You must complete a Promptly Reportable Information submission"
      );
    } else if (radio_name === "promptly_reportable_info" && event.target.value === "No") {
      setShowErrorMsgPromptlyReportableNotSubmitted("");
    }
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdverseEventInfo = (event, radio_name) => {
    if (radio_name === "adverse_event_info" && event.target.value === "Yes") {
      setShowErrorMsgAdverseEventNotSubmitted(
        "You must complete and submit an Adverse Event report"
      );
    } else if (radio_name === "adverse_event_info" && event.target.value === "No") {
      setShowErrorMsgAdverseEventNotSubmitted("");
    }
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      if (formData.study_completion_date === null) {
        return setErrors({
          ...errors,
          ["study_completion_date"]: "This is required",
        });
      }
      const validatedForm = await studyCloseSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await studyCloseSchema.isValid(validatedForm);
      if (isValid === true) {
        dispatch(createStudyCloseoutRequest({ ...formData })).then((data) => {
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
            // Optionally clear the form (or keep the data) and refetch the details
            // Here we refetch to update with the latest data
            const payload = {
              protocol_id: protocolDetails.protocolId,
              type: "closeout",
            };
            setIsLoading(false)
            dispatch(fetchEventAndRequestById(payload));
          } else {
            setIsLoading(false)
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
      setIsLoading(false)
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

  if (isLoading) {
    return <Loader />
  }

  return (
    <Box sx={{ width: "100%" }} style={{ padding: "1rem" }}>
      <h2 className="ml-20">
        Study Closeout Request Details ({protocolDetails.protocolId})
      </h2>
      <Box
        sx={{
          border: "1px solid #d3d3d3",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          justifyContent: { xs: "center", sm: "flex-start" },
          flexWrap: "wrap",
          margin: { xs: "0 8px", sm: "0 24px", md: "0 24px" },
          overflow: "hidden",
        }}
      >
        <Box sx={{ padding: "25px" }}>
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
            <Form.Group as={Col} controlId="validationFormik06" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Protocol Number *"
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
            <Form.Group as={Col} controlId="validationFormik07" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="PI Name *"
                  id="pi_name"
                  name="pi_name"
                  onChange={handleChange}
                  value={formData.pi_name}
                />
              </Box>
              {errors.pi_name && <div className="error">{errors.pi_name}</div>}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik08" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Study Completion *"
                    onChange={(newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        study_completion_date: dayjs(newValue).format("YYYY-MM-DD"),
                      }))
                    }
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ width: "50%" }}
                    value={
                      formData.study_completion_date
                        ? dayjs(formData.study_completion_date)
                        : null
                    }
                  />
                </LocalizationProvider>
              </Box>
              {errors.study_completion_date && (
                <div className="error">{errors.study_completion_date}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik01" className="mt-mb-20">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Reason for Study Closeout *
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="study_closeout_reason"
                  onChange={(event) =>
                    handleStudyCloseoutReason(event, "study_closeout_reason")
                  }
                  value={formData.study_closeout_reason}
                >
                  <FormControlLabel
                    value="Completed study per protocol including completing enrollment and collection/analysis of all data"
                    control={<Radio />}
                    label="Completed study per protocol including completing enrollment and collection/analysis of all data"
                  />
                  <FormControlLabel
                    value="Early closure due to PI, sponsor, or other agency decision"
                    control={<Radio />}
                    label="Early closure due to PI, sponsor, or other agency decision"
                  />
                  <FormControlLabel
                    value="Early closure due to enrollment challenges"
                    control={<Radio />}
                    label="Early closure due to enrollment challenges"
                  />
                  <FormControlLabel
                    value="Other"
                    control={<Radio />}
                    label="Other"
                  />
                </RadioGroup>
              </FormControl>
              {errors.study_closeout_reason && (
                <div className="error">{errors.study_closeout_reason}</div>
              )}
            </Form.Group>
            {showStudyCloseoutReason && (
              <Form.Group as={Col} controlId="validationFormik03" className="mt-mb-20">
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Explain *"
                    name="study_closeout_reason_other"
                    fullWidth
                    id="study_closeout_reason_other"
                    rows={3}
                    multiline
                    onChange={handleChange}
                    value={formData.study_closeout_reason_other}
                  />
                </Box>
                {errors.study_closeout_reason_other && (
                  <div className="error">{errors.study_closeout_reason_other}</div>
                )}
              </Form.Group>
            )}
            <Form.Group as={Col} controlId="validationFormik08" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Number of subjects enrolled since study start-up *"
                  id="subject_enrolled_number"
                  name="subject_enrolled_number"
                  onChange={handleChange}
                  value={formData.subject_enrolled_number}
                />
              </Box>
              {errors.subject_enrolled_number && (
                <div className="error">{errors.subject_enrolled_number}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik08" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="How many subjects withdrew on their own *"
                  id="subject_withdrew_number"
                  name="subject_withdrew_number"
                  onChange={handleChange}
                  value={formData.subject_withdrew_number}
                />
              </Box>
              {errors.subject_withdrew_number && (
                <div className="error">{errors.subject_withdrew_number}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik08" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="How many subjects were withdrawn by the sponsor, PI, or other study personnel *"
                  id="subject_withdrew_by_other"
                  name="subject_withdrew_by_other"
                  onChange={handleChange}
                  value={formData.subject_withdrew_by_other}
                />
              </Box>
              {errors.subject_withdrew_by_other && (
                <div className="error">{errors.subject_withdrew_by_other}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik08" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="How many subjects were screen fails *"
                  id="subject_fails"
                  name="subject_fails"
                  onChange={handleChange}
                  value={formData.subject_fails}
                />
              </Box>
              {errors.subject_fails && (
                <div className="error">{errors.subject_fails}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik08" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="How many subjects are lost to follow up *"
                  id="subject_lost_followup"
                  name="subject_lost_followup"
                  onChange={handleChange}
                  value={formData.subject_lost_followup}
                />
              </Box>
              {errors.subject_lost_followup && (
                <div className="error">{errors.subject_lost_followup}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik08" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="How many subjects have completed the research *"
                  id="subject_completed"
                  name="subject_completed"
                  onChange={handleChange}
                  value={formData.subject_completed}
                />
              </Box>
              <div className="highlight-text">
                Note: There should be no remaining subjects in order to close the study
              </div>
              {errors.subject_completed && (
                <div className="error">{errors.subject_completed}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik01" className="mt-mb-20">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Have you received any subject complaints since last review?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="subject_complaints_review"
                  onChange={(event) =>
                    handleSubjectComplainsReview(event, "subject_complaints_review")
                  }
                  value={formData.subject_complaints_review}
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            {showSubjectComplaintsReviewTextbox && (
              <Form.Group as={Col} controlId="validationFormik03" className="mt-mb-20">
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Explain *"
                    name="subject_complaints_review_explain"
                    fullWidth
                    id="subject_complaints_review_explain"
                    rows={3}
                    multiline
                    onChange={handleChange}
                    value={formData.subject_complaints_review_explain}
                  />
                </Box>
                {errors.subject_complaints_review_explain && (
                  <div className="error">{errors.subject_complaints_review_explain}</div>
                )}
              </Form.Group>
            )}
            <Form.Group as={Col} controlId="validationFormik01" className="mt-mb-20">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Were there any changes to the protocol, consent form, or other subject materials not yet reported to IRB?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="not_reported_irb"
                  onChange={(event) =>
                    handleChangesNotReportedToIRB(event, "not_reported_irb")
                  }
                  value={formData.not_reported_irb}
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            {showChangesNotReportedToIRBTextbox && (
              <Form.Group as={Col} controlId="validationFormik03" className="mt-mb-20">
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Please explain the changes, what document(s) were changed, the reason for the change(s), and why they were not reported to the IRB *
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    placeholder="Explain"
                    name="not_reported_irb_explain"
                    fullWidth
                    id="not_reported_irb_explain"
                    rows={3}
                    multiline
                    onChange={handleChange}
                    value={formData.not_reported_irb_explain}
                  />
                </Box>
                {errors.not_reported_irb_explain && (
                  <div className="error">{errors.not_reported_irb_explain}</div>
                )}
              </Form.Group>
            )}
            <Form.Group as={Col} controlId="validationFormik01" className="mt-mb-20">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Is there any promptly reportable information that has not been reported to the IRB?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="promptly_reportable_info"
                  onChange={(event) =>
                    handlePromptlyReportableInfo(event, "promptly_reportable_info")
                  }
                  value={formData.promptly_reportable_info}
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
                {errors.promptly_reportable_info && (
                  <div className="error">{errors.promptly_reportable_info}</div>
                )}
              </FormControl>
            </Form.Group>
            {showErrorMsgPromptlyReportableNotSubmitted !== "" && (
              <Form.Group as={Col} controlId="validationFormik03" className="mt-mb-20">
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    <div className="error">{showErrorMsgPromptlyReportableNotSubmitted}</div>
                  </FormLabel>
                </Box>
              </Form.Group>
            )}
            <Form.Group as={Col} controlId="validationFormik01" className="mt-mb-20">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Is there any adverse events that have not been reported to the IRB?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="adverse_event_info"
                  onChange={(event) =>
                    handleAdverseEventInfo(event, "adverse_event_info")
                  }
                  value={formData.adverse_event_info}
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
                {errors.adverse_event_info && (
                  <div className="error">{errors.adverse_event_info}</div>
                )}
              </FormControl>
            </Form.Group>
            {showErrorMsgAdverseEventNotSubmitted !== "" && (
              <Form.Group as={Col} controlId="validationFormik03" className="mt-mb-20">
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    <div className="error">{showErrorMsgAdverseEventNotSubmitted}</div>
                  </FormLabel>
                </Box>
              </Form.Group>
            )}
            <h3>Acknowledgement</h3>
            <Form.Group as={Col} controlId="validationFormik01" className="mt-mb-20">
              <FormControl>
                <FormGroup>
                  <FormLabel>
                    - By submitting this form, you guarantee that all research has completed and no new study procedures or enrollments will occur.
                  </FormLabel>
                  <FormLabel>
                    - You certify that all data collection has completed and no new data will be collected.
                  </FormLabel>
                  <FormLabel>
                    - You also certify that any biological samples related to the study have been destroyed and no new samples will be collected.
                  </FormLabel>
                </FormGroup>
              </FormControl>
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik06" className="mt-mb-20">
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
                Note: Your name above is the equivalent of a hand-written signature and is legally binding. Your signature confirms that you are authorized to submit this document and you acknowledge that it is accurate.
              </div>
              {errors.your_name && (
                <div className="error">{errors.your_name}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik010" className="mt-mb-20" style={{ textAlign: "right" }}>
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

export default StudyCloseoutRequestDetails;
