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
import { fetchAdverseEventById } from "../../../services/Admin/EventAndRequestService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { uploadFile } from "../../../services/UserManagement/UserService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormGroup from "@mui/material/FormGroup";
import moment from "moment";

import { CustomMUITextFieldWrapper as TextField } from "../../../components/Mui/CustomTextField";
import { CustomMUIFormLabel as FormLabel } from "../../../components/Mui/CustomFormLabel";
import { CustomInputLabel as InputLabel } from "../../../components/Mui/CustomInputLabel";
import { CustomMUISelectWrapper as Select } from "../../../components/Mui/CustomSelectWrapper"
import { CustomDatePickerWrapper as DatePicker } from "../../../components/Mui/CustomDatePickerWrapper";

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

function AdminAdverseEventsDetails() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const protocolDetails = location.state.details;
  const userDetails = JSON.parse(localStorage.getItem("user"));
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      // const getValidatedform = await adverseEventSchema.validate(formData, { abortEarly: false });
      // const isValid = await adverseEventSchema.isValid(getValidatedform)
      const isValid = true;
      if (isValid === true) {
        dispatch(createProtocolInformation({ ...formData })).then((data) => {
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
          }
        });
      }
    } catch (error) { }
  };
  const { adverseEventById, loading, error } = useSelector((state) => ({
    error: state.admin.error,
    adverseEventById: state.admin.adverseEventById,
    loading: state.admin.loading,
  }));
  useEffect(() => {
    let data = { protocolId: protocolDetails.protocolId };
    dispatch(fetchAdverseEventById(data));
  }, [dispatch, userDetails.id]);

  return (
    <Box sx={{ width: "100%" }}>
      <h2 className="ml-20">
        Adverse Events Details ({protocolDetails.protocolId})
      </h2>
      <Box className="pd-25">
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
          {adverseEventById && (
            <>
              <Form.Group
                as={Col}
                controlId="validationFormik07"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    fullWidth
                    disabled
                    label="Protocol number *"
                    id="protocol_number"
                    name="protocol_number"
                    defaultValue={adverseEventById[0]?.protocol_number}
                  />
                </Box>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="validationFormik01"
                className="mt-mb-20"
              >
                <FormControl>
                  <div className="highlight-text">
                    An adverse event is any untoward medical occurrence that
                    includes one or more of the following regardless of
                    causality: death, is life-threatening, requires in-patient
                    hospitalization, results in prolongation of current
                    hospitalization, results in disability (acute or chronic),
                    results in a birth defect, is an important medical event
                    that requires intervention, and/or may jeopardize the health
                    of the research participant
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
                    Does the adverse event meet the criteria above? *
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="adverse_event_criteria"
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                      checked={
                        adverseEventById[0]?.adverse_event_criteria === "Yes"
                      }
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                      checked={
                        adverseEventById[0]?.adverse_event_criteria === "No"
                      }
                    />
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
                    disabled
                    label="Participant ID Number *"
                    id="participant_id_number"
                    name="participant_id_number"
                    defaultValue={adverseEventById[0]?.participant_id_number}
                  />
                </Box>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="validationFormik08"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    fullWidth
                    disabled
                    label="Event occur start date *"
                    id="event_start_date"
                    name="event_start_date"
                    defaultValue={moment(
                      adverseEventById[0]?.event_start_date,
                    ).format("DD-MM-YYYY")}
                  />
                </Box>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="validationFormik08"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    fullWidth
                    disabled
                    label="Event occur end date *"
                    id="event_end_date"
                    name="event_end_date"
                    defaultValue={moment(
                      adverseEventById[0]?.event_end_date,
                    ).format("DD-MM-YYYY")}
                  />
                </Box>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="validationFormik08"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    fullWidth
                    disabled
                    label="When did you become aware of this event *"
                    id="event_aware_date"
                    name="event_aware_date"
                    defaultValue={moment(
                      adverseEventById[0]?.event_aware_date,
                    ).format("DD-MM-YYYY")}
                  />
                </Box>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="validationFormik08"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    fullWidth
                    disabled
                    label="Date of report to IRB *"
                    id="irb_report_date"
                    name="irb_report_date"
                    defaultValue={moment(
                      adverseEventById[0]?.irb_report_date,
                    ).format("DD-MM-YYYY")}
                  />
                </Box>
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
                  >
                    <FormControlLabel
                      value="Mild (asymptomatic or mild symptoms not requiring intervention, clinical or diagnostic observations only)"
                      control={<Radio />}
                      label="Mild (asymptomatic or mild symptoms not requiring intervention, clinical or diagnostic observations only)"
                      checked={
                        adverseEventById[0]?.severity_level ===
                        "Mild (asymptomatic or mild symptoms not requiring intervention, clinical or diagnostic observations only)"
                      }
                    />
                    <FormControlLabel
                      value="Moderate (minimal or non-invasive intervention required, limiting age-appropriate activities)"
                      control={<Radio />}
                      label="Moderate (minimal or non-invasive intervention required, limiting age-appropriate activities)"
                      checked={
                        adverseEventById[0]?.severity_level ===
                        "Moderate (minimal or non-invasive intervention required, limiting age-appropriate activities)"
                      }
                    />
                    <FormControlLabel
                      value="Severe/medically significant (not immediately life-threatening, requires hospitalization/ prolongation of current hospitalization, disabling"
                      control={<Radio />}
                      label="Severe/medically significant (not immediately life-threatening, requires hospitalization/ prolongation of current hospitalization, disabling)"
                      checked={
                        adverseEventById[0]?.severity_level ===
                        "Severe/medically significant (not immediately life-threatening, requires hospitalization/ prolongation of current hospitalization, disabling)"
                      }
                    />
                    <FormControlLabel
                      value="Life-threatening (urgent intervention required to prevent death or other serious outcome including significant disability whether acute or long-term)"
                      control={<Radio />}
                      label="Life-threatening (urgent intervention required to prevent death or other serious outcome including significant disability whether acute or long-term)"
                      checked={
                        adverseEventById[0]?.severity_level ===
                        "Life-threatening (urgent intervention required to prevent death or other serious outcome including significant disability whether acute or long-term)"
                      }
                    />
                    <FormControlLabel
                      value="Death related to adverse event"
                      control={<Radio />}
                      label="Death related to adverse event"
                      checked={
                        adverseEventById[0]?.severity_level ===
                        "Death related to adverse event"
                      }
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
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                      checked={adverseEventById[0]?.unexpected_event === "Yes"}
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                      checked={adverseEventById[0]?.unexpected_event === "No"}
                    />
                  </RadioGroup>
                </FormControl>
              </Form.Group>
              {adverseEventById[0]?.unexpected_event === "Yes" && (
                <Form.Group
                  as={Col}
                  controlId="validationFormik03"
                  className="mt-mb-20"
                >
                  <Box sx={{ width: "100%", maxWidth: "100%" }}>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Explain *
                    </FormLabel>
                    <p className="explain_text">
                      {adverseEventById[0]?.unexpected_event_explain}
                    </p>
                  </Box>
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
                  >
                    <FormControlLabel
                      value="Death"
                      control={<Radio />}
                      label="Death"
                      checked={adverseEventById[0]?.event_nature === "Death"}
                    />
                    <FormControlLabel
                      value="Life-threatening"
                      control={<Radio />}
                      label="Life-threatening"
                      checked={
                        adverseEventById[0]?.event_nature === "Life-threatening"
                      }
                    />
                    <FormControlLabel
                      value="Required in-patient hospitalization"
                      control={<Radio />}
                      label="Required in-patient hospitalization"
                      checked={
                        adverseEventById[0]?.event_nature ===
                        "Required in-patient hospitalization"
                      }
                    />
                    <FormControlLabel
                      value="Resulted in prolongation of current hospitalization"
                      control={<Radio />}
                      label="Resulted in prolongation of current hospitalization"
                      checked={
                        adverseEventById[0]?.event_nature ===
                        "Resulted in prolongation of current hospitalization"
                      }
                    />
                    <FormControlLabel
                      value="Resulted in disability (acute or chronic)"
                      control={<Radio />}
                      label="Resulted in disability (acute or chronic)"
                      checked={
                        adverseEventById[0]?.event_nature ===
                        "Resulted in disability (acute or chronic)"
                      }
                    />
                    <FormControlLabel
                      value="Resulted in a birth defect"
                      control={<Radio />}
                      label="Resulted in a birth defect"
                      checked={
                        adverseEventById[0]?.event_nature ===
                        "Resulted in a birth defect"
                      }
                    />
                    <FormControlLabel
                      value="An important medical event that required intervention"
                      control={<Radio />}
                      label="An important medical event that required intervention"
                      checked={
                        adverseEventById[0]?.event_nature ===
                        "An important medical event that required intervention"
                      }
                    />
                    <FormControlLabel
                      value="Jeopardized/possibly jeopardized the health of the research participant"
                      control={<Radio />}
                      label="Jeopardized/possibly jeopardized the health of the research participant"
                      checked={
                        adverseEventById[0]?.event_nature ===
                        "Jeopardized/possibly jeopardized the health of the research participant"
                      }
                    />
                    <FormControlLabel
                      value="Other"
                      control={<Radio />}
                      label="Other"
                      checked={adverseEventById[0]?.event_nature === "Other"}
                    />
                  </RadioGroup>
                </FormControl>
              </Form.Group>
              {adverseEventById[0]?.event_nature === "Death" && (
                <Form.Group
                  as={Col}
                  controlId="validationFormik03"
                  className="mt-mb-20"
                >
                  <Box sx={{ width: "100%", maxWidth: "100%" }}>
                    <TextField
                      fullWidth
                      disabled
                      label="Date of death *"
                      id="date_of_death"
                      name="date_of_death"
                      defaultValue={moment(
                        adverseEventById[0]?.date_of_death,
                      ).format("DD-MM-YYYY")}
                    />
                  </Box>
                </Form.Group>
              )}
              {adverseEventById[0]?.event_nature === "Other" && (
                <Form.Group
                  as={Col}
                  controlId="validationFormik03"
                  className="mt-mb-20"
                >
                  <Box sx={{ width: "100%", maxWidth: "100%" }}>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Explain *
                    </FormLabel>
                    <p className="explain_text">
                      {adverseEventById[0]?.event_nature_explain}
                    </p>
                  </Box>
                </Form.Group>
              )}
              <Form.Group
                as={Col}
                controlId="validationFormik03"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Use the text box below to describe the event in as much
                    detail as is available
                  </FormLabel>
                  <p className="explain_text">
                    {adverseEventById[0]?.event_description}
                  </p>
                </Box>
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
                  >
                    <FormControlLabel
                      value="Unrelated (event is clearly NOT related to the study)"
                      control={<Radio />}
                      label="Unrelated (event is clearly NOT related to the study)"
                      checked={
                        adverseEventById[0]?.event_study_relationship ===
                        "Unrelated (event is clearly NOT related to the study)"
                      }
                    />
                    <FormControlLabel
                      value="Unlikely (it is doubtful the event is related to the study)"
                      control={<Radio />}
                      label="Unlikely (it is doubtful the event is related to the study)"
                      checked={
                        adverseEventById[0]?.event_study_relationship ===
                        "Unlikely (it is doubtful the event is related to the study)"
                      }
                    />
                    <FormControlLabel
                      value="Possible (there is a chance the event could be related to the study)"
                      control={<Radio />}
                      label="Possible (there is a chance the event could be related to the study)"
                      checked={
                        adverseEventById[0]?.event_study_relationship ===
                        "Possible (there is a chance the event could be related to the study)"
                      }
                    />
                    <FormControlLabel
                      value="Probable (it is likely the event is related to the study)"
                      control={<Radio />}
                      label="Probable (it is likely the event is related to the study)"
                      checked={
                        adverseEventById[0]?.event_study_relationship ===
                        "Probable (it is likely the event is related to the study)"
                      }
                    />
                    <FormControlLabel
                      value="Related (event is clearly related to the study)"
                      control={<Radio />}
                      label="Related (event is clearly related to the study)"
                      checked={
                        adverseEventById[0]?.event_study_relationship ===
                        "Related (event is clearly related to the study)"
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Form.Group>
              <Form.Group as={Col} controlId="validationFormik04">
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Was the study discontinued for this participant as a result
                    of the event?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="study_discontinued"
                  >
                    <FormControlLabel
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                      checked={
                        adverseEventById[0]?.study_discontinued === "Yes"
                      }
                    />
                    <FormControlLabel
                      value="No"
                      control={<Radio />}
                      label="No"
                      checked={
                        adverseEventById[0]?.study_discontinued === "Yes"
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Form.Group>
              {adverseEventById[0]?.study_discontinued === "Yes" && (
                <Form.Group
                  as={Col}
                  controlId="validationFormik05"
                  className="mt-mb-20"
                >
                  <Box sx={{ width: "100%", maxWidth: "100%" }}>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Explain *
                    </FormLabel>
                    <p className="explain_text">
                      {adverseEventById[0]?.study_discontinued_explain}
                    </p>
                  </Box>
                </Form.Group>
              )}
              <Form.Group
                as={Col}
                controlId="validationFormik01"
                className="mt-mb-20"
              >
                <FormControl>
                  <div className="highlight-text">
                    Please note that severity, category, and causality of
                    adverse event must be determined by the site’s principal
                    investigator. No other study personnel may determine the
                    nature of the event. This form must be approved of by the PI
                    prior to submission. Your electronic signature below
                    guarantees that all information provided in this form was
                    reviewed and completed by the PI prior to submission.
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
                    disabled
                    label="Person submitting this form *"
                    id="person_name"
                    name="person_name"
                    defaultValue={adverseEventById[0]?.person_name}
                  />
                </Box>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="validationFormik08"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    fullWidth
                    disabled
                    label="Email *"
                    id="email"
                    name="email"
                    defaultValue={adverseEventById[0]?.email}
                  />
                </Box>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="validationFormik08"
                className="mt-mb-20"
              >
                <Box sx={{ width: "100%", maxWidth: "100%" }}>
                  <TextField
                    fullWidth
                    disabled
                    label="Phone *"
                    id="phone"
                    name="phone"
                    defaultValue={adverseEventById[0]?.phone}
                  />
                </Box>
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
                      - By submitting this form you confirm the following is
                      true and accurate to the best of your knowledge:
                    </FormLabel>
                    <FormLabel>
                      - The information in this form is accurate and complete
                    </FormLabel>
                    <FormLabel>
                      - You are an authorized designee to submit this
                      information
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
                    disabled
                    label="Your Name *"
                    id="your_name"
                    name="your_name"
                    defaultValue={adverseEventById[0]?.your_name}
                  />
                </Box>
                <div className="highlight-text">
                  Note: Your name above is the equivalent of a hand-written
                  signature and is legally binding. Your signature confirms that
                  you are authorized to submit this document and you acknowledge
                  that it is accurate.
                </div>
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="validationFormik010"
                className="mt-mb-20"
                style={{ textAlign: "right" }}
              >
                <Button
                  // disabled={!dirty || !isValid}
                  variant="contained"
                  color="primary"
                  type="Submit"
                  disabled
                >
                  SAVE AND CONTINUE
                </Button>
              </Form.Group>
            </>
          )}
        </form>
      </Box>
    </Box>
  );
}

export default AdminAdverseEventsDetails;
