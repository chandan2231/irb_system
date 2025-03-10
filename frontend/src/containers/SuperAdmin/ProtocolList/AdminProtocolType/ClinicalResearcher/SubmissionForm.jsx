import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/material";

import { CustomMUITextFieldWrapper as TextField } from "../../../../../components/Mui/CustomTextField";
import { CustomMUIFormLabel as FormLabel } from "../../../../../components/Mui/CustomFormLabel";
import { CustomInputLabel as InputLabel } from "../../../../../components/Mui/CustomInputLabel";

function SubmissionForm({ type }) {
  const [termsSelected, setTermsSelected] = React.useState(false);
  const initialValues = {
    notificationName: "",
  };
  const [name, setName] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [checkForTerms, setCheckForTerms] = useState(false);

  const handleSubmitData = (values) => {
    let stopCall = false;
    console.log("stopCall", stopCall);
    // return;
    if (!stopCall) {
      setTimeout(() => {
        let isConfirmed = window.confirm(
          "Are you sure you want to submit the notification?"
        );
        if (isConfirmed && !stopCall) {
          //dispatch(submitNotificationDetails(formData))
        }
      }, 1000);
    }
  };

  const handleFinalSubmissionTearmChecked = (event) => {
    const { checked } = event.target;
    if (checked === true) {
      setTermsSelected(true);
    } else if (checked === false) {
      setTermsSelected(false);
    }
  };

  const handleCheckForTerms = (event) => {
    setCheckForTerms(event.target.checked);
  };

  // Validate form fields
  useEffect(() => {
    const isFormValid = termsSelected && checkForTerms && name.trim() !== "";

    setIsButtonDisabled(!isFormValid);
  }, [termsSelected, checkForTerms, name]);

  return (
    <>
      <Row>
        <form onSubmit={handleSubmitData}>
          <Form.Group
            as={Col}
            controlId="validationFormik01"
            className="ul-list"
          >
            <p>By submitting this application you attest to the following:</p>
            <ul>
              <li>
                Research will not commence prior to receiving the IRB approval
                letter
              </li>
              <li>
                The principal investigator will personally supervise and/or
                conduct the study
              </li>
              <li>
                The principal investigator ensures that all persons involved in
                conducting the study are trained and have proper credentialing
                for conducting research
              </li>
              <li>
                Only the most current IRB-approved consent form will be used to
                enroll subjects
              </li>
              <li>
                No changes will be made to the research protocol, consents
                forms, and all patient-facing materials without the approval of
                the IRB
              </li>
              <li>
                The study procedures will comply with all applicable laws and
                regulations regarding the conduct of research
              </li>
              <li>
                All findings from the study that directly affect subject safety
                will be communicated to subjects, the sponsor, and to this IRB
              </li>
              <li>
                All serious adverse events (SAEs), whether related to the study
                procedures or not, will be reported to this IRB within 2
                business days of the investigator becoming aware of the event
                for IRB safety review
              </li>
              <li>
                The investigator will submit annual review and reviews in
                compliance with sponsor
              </li>
            </ul>
          </Form.Group>

          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
              <FormGroup
                onChange={(event) => handleFinalSubmissionTearmChecked(event)}
              >
                <FormControlLabel
                  control={<Checkbox />}
                  label="Your initial below certifies that you have read and agree to the research compliance terms listed in above protocol application."
                />
              </FormGroup>
            </FormControl>
          </Form.Group>

          {/* Checkbox to confirm terms */}
          <Form.Group as={Col} controlId="validationFormik02">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
              <FormGroup onChange={handleCheckForTerms}>
                <FormControlLabel
                  control={<Checkbox />}
                  checked={checkForTerms}
                  label="I acknowledge that processed payment for protocol approval submission is non-refundable."
                />
              </FormGroup>
            </FormControl>
          </Form.Group>

          {/* Text box for enter name */}
          <Form.Group as={Col} controlId="validationFormik02">
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Type Name (Electronic Signature)"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
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
                disabled
              >
                SAVE AND CONTINUE
              </Button> */}
            </Form.Group>
          )}
        </form>
      </Row>
    </>
  );
}

export default SubmissionForm;
