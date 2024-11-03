import React, { useEffect, useState } from "react";
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
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { investigatorAndinstuationSave } from "../../../../services/ContinuinReview/ContinuinReviewService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const allAppliedChanges = [
  { label: "suspension of hospital privileges", value: "1" },
  { label: "change in medical license status", value: "2" },
  {
    label:
      "increase in number of research studies conducted by the investigator",
    value: "3",
  },
  {
    label: "expired or updated human research protections training",
    value: "4",
  },
];
const allAppliedChangesFacilityChanges = [
  { label: "Personnel changes", value: "1" },
  { label: "Financial resource changes", value: "2" },
  { label: "Change in facility address", value: "3" },
  {
    label:
      "Change in facility resources (ie: loss of laboratory space or licensure, loss of adequate storage space, structural damage or changes to the physical facility)",
    value: "4",
  },
  { label: "Other", value: "5" },
];

function InvestigatorInstitutionInfo({
  continuinReviewDetails,
  investigatorInstitutionInfoDetails,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    inv_sit_quali: "",
    investigator_changes: "",
    inv_or_comp: "",
    inv_or_comp_explain: "",
    facility_changes: "",
    facility_change_item: "",
    changes_explain: "",
    changes_reported: "",
    changes_reported_explain: "",
    facility_any_changes: "",
    facility_any_changes_explain: "",
    changes_law: "",
    changes_law_explain: "",
    protocol_id: continuinReviewDetails.protocolId,
    created_by: userDetails.id,
  });
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
        dispatch(investigatorAndinstuationSave(formData)).then((data) => {
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
  //console.log('investigatorInstitutionInfoDetails', investigatorInstitutionInfoDetails)
  const investigatorChangesArr =
    investigatorInstitutionInfoDetails?.investigator_changes?.split(",");
  const facilitiesChangesArr =
    investigatorInstitutionInfoDetails?.facility_change_item?.split(",");
  return (
    <Row>
      <form onSubmit={handleSubmitData}>
        <h4>Question 1</h4>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Have there been any changes in the investigator’s situation or
              qualifications?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="inv_sit_quali"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investigatorInstitutionInfoDetails?.inv_sit_quali === "Yes"
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investigatorInstitutionInfoDetails?.inv_sit_quali === "No"
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investigatorInstitutionInfoDetails?.inv_sit_quali === "Yes" && (
          <Form.Group
            as={Col}
            controlId="validationFormik01"
            className="mt-mb-20"
          >
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Mark all that apply
              </FormLabel>
              <FormGroup name="investigator_changes">
                {allAppliedChanges.map((appliedChanges, index) => {
                  return (
                    <FormControlLabel
                      key={index}
                      control={<Checkbox />}
                      label={appliedChanges.label}
                      value={appliedChanges.value}
                      checked={investigatorChangesArr?.find(
                        (id) => Number(id) === Number(appliedChanges.value),
                      )}
                    />
                  );
                })}
              </FormGroup>
            </FormControl>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <InputLabel
            id="demo-simple-select-autowidth-label"
            className="mt-mb-10"
          >
            Uploaded supporting documents here
          </InputLabel>
          {investigatorInstitutionInfoDetails?.documents?.length > 0 &&
            investigatorInstitutionInfoDetails?.documents?.map(
              (docList, index) => {
                if (docList.document_name === "q1_supporting_documents") {
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
              },
            )}
        </Form.Group>
        <h4>Question 2</h4>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Have there been any investigation of or complaints related to the
              investigator’s conduct of research?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="inv_or_comp"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investigatorInstitutionInfoDetails?.inv_or_comp === "Yes"
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investigatorInstitutionInfoDetails?.inv_or_comp === "No"
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investigatorInstitutionInfoDetails?.inv_or_comp === "Yes" && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Explain
              </FormLabel>
              <p className="explain_text">
                {investigatorInstitutionInfoDetails?.inv_or_comp_explain}
              </p>
            </Box>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <InputLabel
            id="demo-simple-select-autowidth-label"
            className="mt-mb-10"
          >
            Uploaded supporting documents here *
          </InputLabel>
          {investigatorInstitutionInfoDetails?.documents?.length > 0 &&
            investigatorInstitutionInfoDetails?.documents?.map(
              (docList, index) => {
                if (docList.document_name === "q2_supporting_documents") {
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
              },
            )}
        </Form.Group>
        <h4>Question 3</h4>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Have there been any changes in the facility’s ability to
              adequately support the research protocol?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="facility_changes"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investigatorInstitutionInfoDetails?.facility_changes === "Yes"
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investigatorInstitutionInfoDetails?.facility_changes === "No"
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investigatorInstitutionInfoDetails?.facility_changes === "Yes" && (
          <Form.Group
            as={Col}
            controlId="validationFormik01"
            className="mt-mb-20"
          >
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Mark all that apply
              </FormLabel>
              <FormGroup name="investigator_changes">
                {allAppliedChangesFacilityChanges.map(
                  (appliedChanges, index) => {
                    return (
                      <FormControlLabel
                        key={index}
                        control={<Checkbox />}
                        label={appliedChanges.label}
                        value={appliedChanges.value}
                        checked={facilitiesChangesArr?.find(
                          (id) => Number(id) === Number(appliedChanges.value),
                        )}
                      />
                    );
                  },
                )}
              </FormGroup>
            </FormControl>
          </Form.Group>
        )}

        <Form.Group
          as={Col}
          controlId="validationFormik03"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Please describe the changes and explain in as much detail as
                possible. Please provide any solutions, whether temporary or
                permanent, work-arounds, and/or protocol adjustments *
              </FormLabel>
              <p className="explain_text">
                {investigatorInstitutionInfoDetails?.changes_explain}
              </p>
            </FormControl>
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
            Uploaded supporting documents here if applicable <br /> (ie: new
            informed consent with facility address change, updated protocol to
            reflect facility changes, updated delegation of authority log, etc.)
          </InputLabel>
          {investigatorInstitutionInfoDetails?.documents?.length > 0 &&
            investigatorInstitutionInfoDetails?.documents?.map(
              (docList, index) => {
                if (docList.document_name === "q3_supporting_documents") {
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
              },
            )}
        </Form.Group>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Have these changes been reported to the IRB?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="changes_reported"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investigatorInstitutionInfoDetails?.changes_reported === "Yes"
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investigatorInstitutionInfoDetails?.changes_reported === "No"
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investigatorInstitutionInfoDetails?.changes_reported === "No" && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Explain
              </FormLabel>
              <p className="explain_text">
                {investigatorInstitutionInfoDetails?.changes_reported_explain}
              </p>
            </Box>
          </Form.Group>
        )}

        <h4>Question 4</h4>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Have there been any changes in facility regulations, standard
              operating procedures, or standards of professional conduct?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="facility_any_changes"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investigatorInstitutionInfoDetails?.facility_any_changes ===
                  "Yes"
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investigatorInstitutionInfoDetails?.facility_any_changes ===
                  "No"
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investigatorInstitutionInfoDetails?.facility_any_changes === "Yes" && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Explain
              </FormLabel>
              <p className="explain_text">
                {
                  investigatorInstitutionInfoDetails?.facility_any_changes_explain
                }
              </p>
            </Box>
          </Form.Group>
        )}

        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <InputLabel
            id="demo-simple-select-autowidth-label"
            className="mt-mb-10"
          >
            Uploaded supporting documents here *
          </InputLabel>
          {investigatorInstitutionInfoDetails?.documents?.length > 0 &&
            investigatorInstitutionInfoDetails?.documents?.map(
              (docList, index) => {
                if (docList.document_name === "q4_supporting_documents") {
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
              },
            )}
        </Form.Group>
        <h4>Question 5</h4>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Have there been any changes to state or local law regarding
              research that affects the conduct of research?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="changes_law"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investigatorInstitutionInfoDetails?.changes_law === "Yes"
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investigatorInstitutionInfoDetails?.changes_law === "Yes"
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investigatorInstitutionInfoDetails?.changes_law === "Yes" && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Explain
              </FormLabel>
              <p className="explain_text">
                {investigatorInstitutionInfoDetails?.changes_law_explain}
              </p>
            </Box>
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

export default InvestigatorInstitutionInfo;
