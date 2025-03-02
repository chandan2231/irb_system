import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { createInvestigatorInformation } from "../../../../../services/ProtocolType/ContractorResearcherService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import { CustomMUITextFieldWrapper as TextField } from "../../../../../components/Mui/CustomTextField";
import { CustomMUIFormLabel as FormLabel } from "../../../../../components/Mui/CustomFormLabel";
import { CustomInputLabel as InputLabel } from "../../../../../components/Mui/CustomInputLabel";

const completedTraining = [
  { label: "OHRP Human Subject Assurance Training", value: "1" },
  { label: "CITI Program Training", value: "2" },
  { label: "Certified Physician Investigator Training", value: "3" },
  { label: "ACRP training (CCRC, CCRA)", value: "4" },
  { label: "SOCRA (CCRP)", value: "5" },
  {
    label: "Graduate or undergraduate research studies or degrees",
    value: "6",
  },
  { label: "Academy of Physicians in Clinical Research", value: "7" },
  { label: "Other", value: "8" },
];

const investigatorInfoSchema = yup.object().shape({
  investigator_name: yup.string().required("This is required"),
  investigator_email: yup.string().required("This is required"),
  sub_investigator_name: yup.string().required("This is required"),
});

function InvestigatorInformationForm({
  protocolTypeDetails,
  investigatorInformation,
  type,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [showAdditionalQuestion, setShowAdditionalQuestion] =
    React.useState(false);
  const [
    showAdditionalQuestionPendingOrActive,
    setShowAdditionalQuestionPendingOrActive,
  ] = React.useState(false);
  const [showAdditionalQuestionSiteFWP, setShowAdditionalQuestionSiteFWP] =
    React.useState(false);
  const [otherQuestionSelection, setOtherQuestionSelection] =
    React.useState("");
  const [showOtherQuestion, setShowOtherQuestion] = React.useState(false);
  const [formData, setFormData] = useState({
    investigator_name: "",
    investigator_email: "",
    sub_investigator_name: "",
    sub_investigator_email: "",
    primary_contact: "",
    primary_contact_email: "",
    fda_audit: "",
    fda_audit_explain: "",
    involved_years: "",
    investigators_npi: "",
    training_completed: "",
    training_completed_explain: "",
    investigator_research_number: "",
    pending_or_active_research: "",
    pending_or_active_research_explain: "",
    site_fwp: "",
    fwa_number: "",
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id,
  });
  const [errors, setErrors] = useState({});

  const handleRadioButtonFdaAudit = (event, radio_name) => {
    if (radio_name === "fda_audit" && event.target.value === "Yes") {
      setShowAdditionalQuestion(true);
    } else if (radio_name === "fda_audit" && event.target.value === "No") {
      setShowAdditionalQuestion(false);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePendingOrInactiveresearch = (event, radio_name) => {
    if (
      radio_name === "pending_or_active_research" &&
      event.target.value === "Yes"
    ) {
      setShowAdditionalQuestionPendingOrActive(true);
    } else if (
      radio_name === "pending_or_active_research" &&
      event.target.value === "No"
    ) {
      setShowAdditionalQuestionPendingOrActive(false);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSiteFWP = (event, radio_name) => {
    if (radio_name === "site_fwp" && event.target.value === "Yes") {
      setShowAdditionalQuestionSiteFWP(true);
    } else if (radio_name === "site_fwp" && event.target.value === "No") {
      setShowAdditionalQuestionSiteFWP(false);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInvestigatorsInvolvedYears = (event, radio_name) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTrainingCompletedChecked = (event) => {
    const { value, checked } = event.target;
    if (checked === true && value === "8") {
      setShowOtherQuestion(true);
      setOtherQuestionSelection(8);
    } else if (checked === false && value === "8") {
      setShowOtherQuestion(false);
      setOtherQuestionSelection("");
    }
    let updatedTrainingCompleted = [...formData.training_completed];
    if (checked) {
      updatedTrainingCompleted.push(value);
    } else {
      updatedTrainingCompleted = updatedTrainingCompleted.filter(
        (training) => training !== value
      );
    }
    setFormData({ ...formData, training_completed: updatedTrainingCompleted });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      const getValidatedform = await investigatorInfoSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await investigatorInfoSchema.isValid(getValidatedform);
      console.log("formData", formData);
      console.log("isValid", isValid);
      if (isValid === true) {
        dispatch(createInvestigatorInformation(formData)).then((data) => {
          if (data.payload.status === 200) {
          } else {
          }
        });
      }
    } catch (error) {}
  };
  const trainingCompletedArr =
    investigatorInformation?.training_completed?.split(",");
  return (
    <Row>
      <form onSubmit={handleSubmitData}>
        <Form.Group
          as={Col}
          controlId="validationFormik06"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Investigator Name *"
              id="investigator_name"
              name="investigator_name"
              value={investigatorInformation?.investigator_name}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Investigator Email *"
              id="investigator_email"
              name="investigator_email"
              value={investigatorInformation?.investigator_email}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Sub-Investigator Name *"
              id="sub_investigator_name"
              name="sub_investigator_name"
              value={investigatorInformation?.sub_investigator_name}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Sub-Investigator Email"
              id="sub_investigator_email"
              name="sub_investigator_email"
              value={investigatorInformation?.sub_investigator_email}
            />
          </Box>
        </Form.Group>

        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Primary point of contact if different from above"
              id="primary_contact"
              name="primary_contact"
              value={investigatorInformation?.primary_contact}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Primary point of contact email address"
              id="primary_contact_email"
              name="primary_contact_email"
              value={investigatorInformation?.primary_contact_email}
            />
          </Box>
        </Form.Group>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Has the investigator ever had an FDA audit?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="fda_audit"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={investigatorInformation?.fda_audit === "Yes"}
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={investigatorInformation?.fda_audit === "No"}
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investigatorInformation?.fda_audit === "Yes" && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {investigatorInformation?.fda_audit_explain}
            </p>
          </Form.Group>
        )}

        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              How long has the investigator been involved in research?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="involved_years"
            >
              <FormControlLabel
                value="New to research-1 year"
                control={<Radio />}
                label="New to research-&lt;1 year"
                checked={
                  investigatorInformation?.involved_years ===
                  "New to research-1 year"
                }
              />
              <FormControlLabel
                value="1-5 years"
                control={<Radio />}
                label="1-5 years"
                checked={
                  investigatorInformation?.involved_years === "1-5 years"
                }
              />
              <FormControlLabel
                value="6 years or more"
                control={<Radio />}
                label="6 years or more"
                checked={
                  investigatorInformation?.involved_years === "6 years or more"
                }
              />
            </RadioGroup>
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
              label="What is the investigator's NPI if applicable"
              id="investigators_npi"
              name="investigators_npi"
              value={investigatorInformation?.investigators_npi}
            />
          </Box>
        </Form.Group>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              What training in the field of human subjects protection has the
              investigator completed?
            </FormLabel>
            {completedTraining.map((trainingList, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  label={trainingList.label}
                  value={trainingList.value}
                  checked={trainingCompletedArr?.find(
                    (id) => Number(id) === Number(trainingList.value)
                  )}
                />
              );
            })}
          </FormControl>
        </Form.Group>
        {trainingCompletedArr?.includes("8") && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {investigatorInformation?.training_completed_explain}
            </p>
          </Form.Group>
        )}

        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="What is the current number of research studies supervised by the investigator?"
              id="investigator_research_number"
              name="investigator_research_number"
              value={investigatorInformation?.investigator_research_number}
            />
          </Box>
        </Form.Group>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Do you have any pending or active restrictions related to research
              or the practice of medicine?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="pending_or_active_research"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investigatorInformation?.pending_or_active_research === "Yes"
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investigatorInformation?.pending_or_active_research === "No"
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investigatorInformation?.pending_or_active_research === "Yes" && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {investigatorInformation?.pending_or_active_research_explain}
            </p>
          </Form.Group>
        )}
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Does your site have an FWA?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="site_fwp"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={investigatorInformation?.site_fwp === "Yes"}
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={investigatorInformation?.site_fwp === "No"}
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investigatorInformation?.site_fwp === "Yes" && (
          <Form.Group
            as={Col}
            controlId="validationFormik07"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Please provide FWA number *"
                id="fwa_number"
                name="fwa_number"
                value={investigatorInformation?.fwa_number}
              />
            </Box>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <InputLabel id="demo-simple-select-autowidth-label">
            Uploaded investigator and sub-investigator CV
          </InputLabel>
          {investigatorInformation?.documents?.length > 0 &&
            investigatorInformation?.documents?.map((docList, index) => {
              if (docList.document_name === "investigator_cv") {
                return (
                  <div>
                    <a
                      href={docList.file_url}
                      target="_blank"
                      className="no_underline"
                    >
                      {docList.file_name}
                    </a>
                  </div>
                );
              }
            })}
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <InputLabel id="demo-simple-select-autowidth-label">
            Uploaded copy of medical license
          </InputLabel>
          {investigatorInformation?.documents?.length > 0 &&
            investigatorInformation?.documents?.map((docList, index) => {
              if (docList.document_name === "medical_license") {
                return (
                  <div>
                    <a
                      href={docList.file_url}
                      target="_blank"
                      className="no_underline"
                    >
                      {docList.file_name}
                    </a>
                  </div>
                );
              }
            })}
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <InputLabel id="demo-simple-select-autowidth-label">
            Uploaded copies of training certificates
          </InputLabel>
          {investigatorInformation?.documents?.length > 0 &&
            investigatorInformation?.documents?.map((docList, index) => {
              if (docList.document_name === "training_certificates") {
                return (
                  <div>
                    <a
                      href={docList.file_url}
                      target="_blank"
                      className="no_underline"
                    >
                      {docList.file_name}
                    </a>
                  </div>
                );
              }
            })}
        </Form.Group>
        {type !== "member" && (
          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
            style={{ textAlign: "right" }}
          >
            {/* <Button
                variant="contained"
                color="primary"
                type="Submit"
              >
                SAVE AND CONTINUE
              </Button> */}
          </Form.Group>
        )}
      </form>
    </Row>
  );
}

export default InvestigatorInformationForm;
