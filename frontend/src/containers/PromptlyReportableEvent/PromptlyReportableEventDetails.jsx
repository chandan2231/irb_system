import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import Form from "react-bootstrap/Form";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createPromptlyReportableEvent,
  fetchEventAndRequestById,
} from "../../services/EventAndRequest/EventAndRequestService";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import Loader from "../../components/Loader";

import { CustomMUIFormLabel as FormLabel } from "../../components/Mui/CustomFormLabel";
import { CustomMUITextFieldWrapper as TextField } from "../../components/Mui/CustomTextField";
import { CustomDatePickerWrapper as DatePicker } from "../../components/Mui/CustomDatePickerWrapper";
import { CustomInputLabel as InputLabel } from "../../components/Mui/CustomInputLabel";
import { CustomMUISelectWrapper as Select } from "../../components/Mui/CustomSelectWrapper";

const promptlyReportableSchema = yup.object().shape({
  submitter_type: yup.string().required("This is required"),
  irb_protocol_number: yup.string().required("This is required"),
  sponsor_name: yup.string().required("This is required"),
  described_category_explain: yup.string().when("described_category", {
    is: "Other",
    then: (schema) => schema.required("This is required"),
    otherwise: (schema) => schema,
  }),
  describe_problem: yup.string().required("This is required"),
  date_problem_discovered: yup.string().required("This is required"),
  date_of_occurrence: yup.string().required("This is required"),
  action_taken: yup.string().required("This is required"),
  plan_action_taken: yup.string().required("This is required"),
  question_not_covered: yup.string().required("This is required"),
  person_name: yup.string().required("This is required"),
  email: yup.string().required("This is required"),
  phone: yup.string().required("This is required"),
  your_name: yup.string().required("This is required"),
});

function PromptlyReportableEventDetails() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const protocolDetails = location.state.details;
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [isLoading, setIsLoading] = useState(false)

  const [showOtherCategoryAdditionTextArea, setShowOtherCategoryAdditionTextArea] =
    useState(false);
  const [termsSelected, setTermsSelected] = useState(false);
  const [formData, setFormData] = useState({
    submitter_type: "",
    irb_protocol_number: "",
    sponsor_name: "",
    described_category: "",
    described_category_explain: "",
    involved_subject: "",
    date_problem_discovered: "",
    date_of_occurrence: "",
    date_reported_to_sponsor: "",
    describe_problem: "",
    action_taken: "",
    plan_action_taken: "",
    subject_harmed: "",
    protocol_change: "",
    question_not_covered: "",
    person_name: "",
    email: "",
    phone: "",
    your_name: "",
    protocol_id: protocolDetails.protocolId,
    created_by: userDetails.id,
    protocol_type: protocolDetails.researchType,
  });
  const [errors, setErrors] = useState({});

  // Fetch details on component mount
  useEffect(() => {
    const data = {
      protocol_id: protocolDetails.protocolId,
      type: "reportable",
    };
    dispatch(fetchEventAndRequestById(data));
  }, [dispatch, protocolDetails.protocolId, userDetails.id]);

  const { promptlyReportableEventDetails, loading, error } = useSelector(
    (state) => ({
      error: state.eventAndRequest.error,
      promptlyReportableEventDetails: state.eventAndRequest.eventAndRequestDetails,
      loading: state.eventAndRequest.loading,
    })
  );

  console.log("promptlyReportableEventDetails", promptlyReportableEventDetails);

  // Prefill formData from fetched details
  useEffect(() => {
    if (
      promptlyReportableEventDetails &&
      promptlyReportableEventDetails.data &&
      promptlyReportableEventDetails.data.data &&
      promptlyReportableEventDetails.data.data.length > 0
    ) {
      const fetchedData = promptlyReportableEventDetails.data.data[0];

      setFormData((prevData) => ({
        ...prevData,
        submitter_type: fetchedData?.submitter_type || "",
        irb_protocol_number: fetchedData?.irb_protocol_number || "",
        sponsor_name: fetchedData?.sponsor_name || "",
        described_category: fetchedData?.described_category || "",
        described_category_explain: fetchedData?.described_category_explain || "",
        involved_subject: fetchedData?.involved_subject || "",
        date_problem_discovered: fetchedData?.date_problem_discovered
          ? dayjs(fetchedData.date_problem_discovered).format("YYYY-MM-DD")
          : "",
        date_of_occurrence: fetchedData?.date_of_occurrence
          ? dayjs(fetchedData.date_of_occurrence).format("YYYY-MM-DD")
          : "",
        date_reported_to_sponsor: fetchedData?.date_reported_to_sponsor
          ? dayjs(fetchedData.date_reported_to_sponsor).format("YYYY-MM-DD")
          : "",
        describe_problem: fetchedData?.describe_problem || "",
        action_taken: fetchedData?.action_taken || "",
        plan_action_taken: fetchedData?.plan_action_taken || "",
        subject_harmed: fetchedData?.subject_harmed || "",
        protocol_change: fetchedData?.protocol_change || "",
        question_not_covered: fetchedData?.question_not_covered || "",
        person_name: fetchedData?.person_name || "",
        email: fetchedData?.email || "",
        phone: fetchedData?.phone || "",
        your_name: fetchedData?.your_name || "",
      }));

      // Set flag if described_category is Other
      if (fetchedData?.described_category === "Other") {
        setShowOtherCategoryAdditionTextArea(true);
      } else {
        setShowOtherCategoryAdditionTextArea(false);
      }
    }
  }, [promptlyReportableEventDetails]);

  const handleSubmitterType = (event, radio_name) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescribedCategory = (event, radio_name) => {
    if (radio_name === "described_category" && event.target.value === "Other") {
      setShowOtherCategoryAdditionTextArea(true);
    } else if (radio_name === "described_category" && event.target.value !== "Other") {
      setShowOtherCategoryAdditionTextArea(false);
    }
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvolvedSubject = (event, radio_name) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectHarmed = (event, radio_name) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProtocolChange = (event, radio_name) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinalSubmissionTearmChecked = (event) => {
    const { checked } = event.target;
    setTermsSelected(checked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const validatedForm = await promptlyReportableSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await promptlyReportableSchema.isValid(validatedForm);
      if (isValid === true) {
        dispatch(createPromptlyReportableEvent({ ...formData })).then((data) => {
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
            // Refetch details after successful submission
            const payload = {
              protocol_id: protocolDetails.protocolId,
              type: "reportable",
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
    } catch (err) {
      setIsLoading(false)
      const newErrors = {};
      err.inner.forEach((errorItem) => {
        newErrors[errorItem.path] = errorItem.message;
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
        Promptly Reportable Event Details ({protocolDetails.protocolId})
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
            <Form.Group as={Col} controlId="validationFormik01">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Submitter Type
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="submitter_type"
                  onChange={(event) =>
                    handleSubmitterType(event, "submitter_type")
                  }
                  value={formData.submitter_type}
                >
                  <FormControlLabel
                    value="Sponsor or CRO (Contract Research Organization)"
                    control={<Radio />}
                    label="Sponsor or CRO (Contract Research Organization)"
                  />
                  <FormControlLabel
                    value="Site Management Organization (SMO)"
                    control={<Radio />}
                    label="Site Management Organization (SMO)"
                  />
                  <FormControlLabel
                    value="Site"
                    control={<Radio />}
                    label="Site"
                  />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            <h4>PROTOCOL INFORMATION:</h4>
            <Form.Group as={Col} controlId="validationFormik06" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="IRB Protocol Number *"
                  id="irb_protocol_number"
                  name="irb_protocol_number"
                  onChange={handleChange}
                  value={formData.irb_protocol_number}
                />
              </Box>
              {errors.irb_protocol_number && (
                <div className="error">{errors.irb_protocol_number}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik07" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Sponsor Name *"
                  id="sponsor_name"
                  name="sponsor_name"
                  onChange={handleChange}
                  value={formData.sponsor_name}
                />
              </Box>
              {errors.sponsor_name && (
                <div className="error">{errors.sponsor_name}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik01">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Select the category below that best describes the PRI *
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="described_category"
                  onChange={(event) =>
                    handleDescribedCategory(event, "described_category")
                  }
                  value={formData.described_category}
                >
                  <FormControlLabel
                    value="Audit, Inspection, or inquiry by a federal agency"
                    control={<Radio />}
                    label="Audit, Inspection, or inquiry by a federal agency"
                  />
                  <FormControlLabel
                    value="Written report from federal agency (ie: FDA 483)"
                    control={<Radio />}
                    label="Written report from federal agency (ie: FDA 483)"
                  />
                  <FormControlLabel
                    value="State medical board action"
                    control={<Radio />}
                    label="State medical board action"
                  />
                  <FormControlLabel
                    value="Hospital medical staff action"
                    control={<Radio />}
                    label="Hospital medical staff action"
                  />
                  <FormControlLabel
                    value="Allegation or finding of non-compliance"
                    control={<Radio />}
                    label="Allegation or finding of non-compliance"
                  />
                  <FormControlLabel
                    value="Suspension or early termination by the sponsor, investigator, or institution"
                    control={<Radio />}
                    label="Suspension or early termination by the sponsor, investigator, or institution"
                  />
                  <FormControlLabel
                    value="Incarceration of a subject in a study not approved to involve prisoners"
                    control={<Radio />}
                    label="Incarceration of a subject in a study not approved to involve prisoners"
                  />
                  <FormControlLabel
                    value="New or increased risk"
                    control={<Radio />}
                    label="New or increased risk"
                  />
                  <FormControlLabel
                    value="Change in financial interest disclosure"
                    control={<Radio />}
                    label="Change in financial interest disclosure"
                  />
                  <FormControlLabel
                    value="Protocol deviation that harmed a subject or placed subject at risk of harm"
                    control={<Radio />}
                    label="Protocol deviation that harmed a subject or placed subject at risk of harm"
                  />
                  <FormControlLabel
                    value="Protocol deviation made without prior IRB approval to eliminate immediate harm to subject"
                    control={<Radio />}
                    label="Protocol deviation made without prior IRB approval to eliminate immediate harm to subject"
                  />
                  <FormControlLabel
                    value="Breach of confidentiality"
                    control={<Radio />}
                    label="Breach of confidentiality"
                  />
                  <FormControlLabel
                    value="Subject complaint"
                    control={<Radio />}
                    label="Subject complaint"
                  />
                  <FormControlLabel
                    value="Unanticipated adverse device effect"
                    control={<Radio />}
                    label="Unanticipated adverse device effect"
                  />
                  <FormControlLabel
                    value="Adverse event that requires change to the protocol or consent"
                    control={<Radio />}
                    label="Adverse event that requires change to the protocol or consent"
                  />
                  <FormControlLabel
                    value="Adverse event that does NOT require change to the protocol or consent"
                    control={<Radio />}
                    label="Adverse event that does NOT require change to the protocol or consent"
                  />
                  <FormControlLabel
                    value="Sponsor/CRO/monitor requests report to IRB"
                    control={<Radio />}
                    label="Sponsor/CRO/monitor requests report to IRB"
                  />
                  <FormControlLabel value="Other" control={<Radio />} label="Other" />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            {showOtherCategoryAdditionTextArea && (
              <Form.Group as={Col} controlId="validationFormik03" className="mt-mb-20">
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    variant="outlined"
                    placeholder="Explain *"
                    name="described_category_explain"
                    fullWidth
                    id="described_category_explain"
                    rows={3}
                    multiline
                    onChange={handleChange}
                    value={formData.described_category_explain}
                  />
                </Box>
                {errors.described_category_explain && (
                  <div className="error">{errors.described_category_explain}</div>
                )}
              </Form.Group>
            )}
            <Form.Group as={Col} controlId="validationFormik02" className="mt-mb-20">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Does this report involve one or more subjects
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="involved_subject"
                  onChange={(event) =>
                    handleInvolvedSubject(event, "involved_subject")
                  }
                  value={formData.involved_subject}
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik08" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date problem discovered *"
                    onChange={(newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        date_problem_discovered: dayjs(newValue).format("YYYY-MM-DD"),
                      }))
                    }
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ width: "50%" }}
                    value={formData.date_problem_discovered ? dayjs(formData.date_problem_discovered) : null}
                  />
                </LocalizationProvider>
              </Box>
              {errors.date_problem_discovered && (
                <div className="error">{errors.date_problem_discovered}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik08" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of occurrence *"
                    onChange={(newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        date_of_occurrence: dayjs(newValue).format("YYYY-MM-DD"),
                      }))
                    }
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ width: "50%" }}
                    value={formData.date_of_occurrence ? dayjs(formData.date_of_occurrence) : null}
                  />
                </LocalizationProvider>
              </Box>
              {errors.date_of_occurrence && (
                <div className="error">{errors.date_of_occurrence}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik08" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date reported to sponsor (if applicable)"
                    onChange={(newValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        date_reported_to_sponsor: dayjs(newValue).format("YYYY-MM-DD"),
                      }))
                    }
                    renderInput={(params) => <TextField {...params} />}
                    sx={{ width: "50%" }}
                    value={formData.date_reported_to_sponsor ? dayjs(formData.date_reported_to_sponsor) : null}
                  />
                </LocalizationProvider>
              </Box>
              {errors.date_reported_to_sponsor && (
                <div className="error">{errors.date_reported_to_sponsor}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik03" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Describe the problem *
                </FormLabel>
                <TextField
                  variant="outlined"
                  placeholder="Explain"
                  name="describe_problem"
                  fullWidth
                  id="describe_problem"
                  rows={3}
                  multiline
                  onChange={handleChange}
                  value={formData.describe_problem}
                />
              </Box>
              {errors.describe_problem && (
                <div className="error">{errors.describe_problem}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik03" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Describe the actions already taken to correct the problem *
                </FormLabel>
                <TextField
                  variant="outlined"
                  placeholder="Explain"
                  name="action_taken"
                  fullWidth
                  id="action_taken"
                  rows={3}
                  multiline
                  onChange={handleChange}
                  value={formData.action_taken}
                />
              </Box>
              {errors.action_taken && (
                <div className="error">{errors.action_taken}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik03" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Describe the actions you plan to take to correct the problem and prevent recurrence *
                </FormLabel>
                <TextField
                  variant="outlined"
                  placeholder="Explain"
                  name="plan_action_taken"
                  fullWidth
                  id="plan_action_taken"
                  rows={3}
                  multiline
                  onChange={handleChange}
                  value={formData.plan_action_taken}
                />
              </Box>
              {errors.plan_action_taken && (
                <div className="error">{errors.plan_action_taken}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik02" className="mt-mb-20">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Were subject(s) harmed because of this problem
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="subject_harmed"
                  onChange={(event) =>
                    handleSubjectHarmed(event, "subject_harmed")
                  }
                  value={formData.subject_harmed}
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik02" className="mt-mb-20">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Will the protocol be changed because of this problem?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="protocol_change"
                  onChange={(event) =>
                    handleProtocolChange(event, "protocol_change")
                  }
                  value={formData.protocol_change}
                >
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik03" className="mt-mb-20">
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Provide any additional relevant information that was not covered by the above questions *
                </FormLabel>
                <TextField
                  variant="outlined"
                  placeholder="Explain"
                  name="question_not_covered"
                  fullWidth
                  id="question_not_covered"
                  rows={3}
                  multiline
                  onChange={handleChange}
                  value={formData.question_not_covered}
                />
              </Box>
              {errors.question_not_covered && (
                <div className="error">{errors.question_not_covered}</div>
              )}
            </Form.Group>
            <Form.Group as={Col} controlId="validationFormik08" className="mt-mb-20">
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
            <Form.Group as={Col} controlId="validationFormik08" className="mt-mb-20">
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
            <Form.Group as={Col} controlId="validationFormik08" className="mt-mb-20">
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
            <Form.Group as={Col} controlId="validationFormik01" className="mt-mb-20">
              <FormControl>
                <FormGroup>
                  <FormLabel>
                    - By submitting this form you confirm the following is true and accurate to the best of your knowledge:
                  </FormLabel>
                  <FormLabel>
                    - The information in this form is accurate and complete
                  </FormLabel>
                  <FormLabel>
                    - You are an authorized designee to submit this information
                  </FormLabel>
                  <FormLabel>
                    - The principal investigator has full awareness of the information submitted within this form
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

export default PromptlyReportableEventDetails;
