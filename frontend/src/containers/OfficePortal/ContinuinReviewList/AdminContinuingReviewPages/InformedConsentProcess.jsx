import React, { useEffect, useState } from "react";
import * as yup from "yup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { informedConsentSave } from "../../../../services/ContinuinReview/ContinuinReviewService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

function InformedConsentProcess({
  continuinReviewDetails,
  informedConsentProcessDetails,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [errors, setErrors] = useState({});

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      const getValidatedform = await investigatorInfoSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await investigatorInfoSchema.isValid(getValidatedform);
      console.log("formData", formData);
      if (isValid === true) {
        dispatch(informedConsentSave(formData)).then((data) => {
          if (data.payload.status === 200) {
          } else {
          }
        });
      }
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };
  //console.log('informedConsentProcessDetails', informedConsentProcessDetails)
  return (
    <Row>
      <form onSubmit={handleSubmitData}>
        <h4>Question 1</h4>
        <Form.Group
          as={Col}
          controlId="validationFormik06"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Which version of the ICF are you currently using? *"
              id="icf_version"
              name="icf_version"
              defaultValue={informedConsentProcessDetails?.performing_consent}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <InputLabel
            id="demo-simple-select-autowidth-label"
            className="mt-mb-10"
          >
            Uploaded the most recent ICF
          </InputLabel>
          {informedConsentProcessDetails?.documents?.length > 0 &&
            informedConsentProcessDetails?.documents?.map((docList, index) => {
              if (docList.document_name === "icf_file") {
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
        <h4>Question 2</h4>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Who is performing the informed consent at your site? *"
              id="performing_consent"
              name="performing_consent"
              defaultValue={informedConsentProcessDetails?.performing_consent}
            />
          </Box>
        </Form.Group>
        <h4>Question 3</h4>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Have there been any challenges faced to the consenting process?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="challenges_faced"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  informedConsentProcessDetails?.challenges_faced === "Yes"
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  informedConsentProcessDetails?.challenges_faced === "No"
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {informedConsentProcessDetails?.challenges_faced === "Yes" && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {informedConsentProcessDetails?.challenges_faced_explain}
            </p>
          </Form.Group>
        )}
        <h4>Question 4</h4>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Have there been any changes to the consent form that have not been
              reported to the IRB?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="changes_consent"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  informedConsentProcessDetails?.changes_consent === "Yes"
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  informedConsentProcessDetails?.changes_consent === "No"
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {informedConsentProcessDetails?.changes_consent === "Yes" && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {informedConsentProcessDetails?.changes_consent_explain}
            </p>
          </Form.Group>
        )}
        <h4>Question 5</h4>
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <InputLabel
            id="demo-simple-select-autowidth-label"
            className="mt-mb-10"
          >
            Uploaded new informed consent form
          </InputLabel>
          {informedConsentProcessDetails?.documents?.length > 0 &&
            informedConsentProcessDetails?.documents?.map((docList, index) => {
              if (docList.document_name === "consent_form") {
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
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Are you ensuring that:
            </FormLabel>
            <FormLabel
              id="demo-row-radio-buttons-group-label"
              style={{ marginTop: "15px" }}
            >
              1. The participants are made aware that their participation is
              voluntary and that they may choose to withdraw at any time?
            </FormLabel>
            <FormLabel
              id="demo-row-radio-buttons-group-label"
              style={{ marginTop: "15px" }}
            >
              2. The participants are provided with a copy of the informed
              consent form to take home?
            </FormLabel>
            <FormLabel
              id="demo-row-radio-buttons-group-label"
              style={{ marginTop: "15px" }}
            >
              3. The participants are provided with the most up-to-date contact
              information for study staff?
            </FormLabel>
            <FormLabel
              id="demo-row-radio-buttons-group-label"
              style={{ marginTop: "15px" }}
            >
              4. The investigator is providing the most current information
              regarding the study that may affect the participants’ willingness
              to participate in the study?{" "}
            </FormLabel>
            <FormLabel
              id="demo-row-radio-buttons-group-label"
              style={{ marginTop: "15px" }}
            >
              5. All participants have been consented or re-consented, where
              necessary, with the most current approved informed consent form?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="ensuring_list"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={informedConsentProcessDetails?.ensuring_list === "Yes"}
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={informedConsentProcessDetails?.ensuring_list === "No"}
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {informedConsentProcessDetails?.ensuring_list === "Yes" && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {informedConsentProcessDetails?.ensuring_list_explain}
            </p>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
          style={{ textAlign: "right" }}
        >
          <Button variant="contained" color="primary" type="Submit" disabled>
            SAVE AND CONTINUE
          </Button>
        </Form.Group>
      </form>
    </Row>
  );
}

export default InformedConsentProcess;
