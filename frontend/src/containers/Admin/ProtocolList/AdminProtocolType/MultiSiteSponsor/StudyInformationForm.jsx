import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import * as yup from "yup";
import Grid from "@mui/material/Grid";
import { createStudyInformation } from "../../../../../services/ProtocolType/MultiSiteSponsorService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import { CustomMUITextFieldWrapper as TextField } from "../../../../../components/Mui/CustomTextField";
import { CustomMUIFormLabel as FormLabel } from "../../../../../components/Mui/CustomFormLabel";
import { CustomInputLabel as InputLabel } from "../../../../../components/Mui/CustomInputLabel";
import { CustomMUISelectWrapper as Select } from "../../../../../components/Mui/CustomSelectWrapper"

const studyInfoSchema = yup.object().shape({
  research_type: yup.string().required("This is required"),
});

function StudyInformationForm({ protocolTypeDetails, studyInformation, type }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [showOtherQuestion, setShowOtherQuestion] = React.useState(false);
  const [errors, setErrors] = useState({});
  const [explainErrors, setExplainErrors] = useState();

  const [formData, setFormData] = useState({
    research_type: "",
    research_type_explain: "",
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id,
  });

  const handleSelectResearchType = (event, select_name) => {
    if (event.target.value === "Other" && select_name === "research_type") {
      setShowOtherQuestion(true);
    } else {
      setShowOtherQuestion(false);
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
      if (
        formData.research_type !== "" &&
        formData.research_type === "Other" &&
        formData.research_type_explain === ""
      ) {
        setExplainErrors("This is required");
        return;
      } else {
        setExplainErrors("");
      }
      const getValidatedform = await studyInfoSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await studyInfoSchema.isValid(getValidatedform);
      if (isValid === true) {
        dispatch(createStudyInformation(formData)).then((data) => {
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
  console.log("studyInformation", studyInformation);
  return (
    <Row>
      <form onSubmit={handleSubmitData}>
        <Form.Group as={Col} controlId="validationFormik09">
          <FormControl fullWidth className="mt-mb-20">
            {/* <InputLabel id="demo-simple-select-label">
              What type of research study are you submitting *
            </InputLabel> */}
            <Select
              inputLabel={"What type of research study are you submitting *"}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={studyInformation?.research_type}
              onChange={(event) =>
                handleSelectResearchType(event, "research_type")
              }
              label="What type of research study are you submitting"
              name="research_type"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Drug/biologic">Drug/biologic</MenuItem>
              <MenuItem value="Device">Device</MenuItem>
              <MenuItem value="Social/behavioral">Social/behavioral</MenuItem>
              <MenuItem value="Food/dietary supplement">
                Food/dietary supplement
              </MenuItem>
              <MenuItem value="State or local Government">
                State or local Government
              </MenuItem>
              <MenuItem value="Cosmetic">Cosmetic</MenuItem>
              <MenuItem value="Retrospective/chart review">
                Retrospective/chart review
              </MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Form.Group>
        {studyInformation?.research_type === "Other" && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {studyInformation?.research_type_explain}
            </p>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <InputLabel id="demo-simple-select-autowidth-label">
            Uploaded drug/biologic profile, device profile, food/dietary
            supplement ingredient list, or cosmetic ingredient list
          </InputLabel>
          {studyInformation?.documents?.length > 0 &&
            studyInformation?.documents?.map((docList, index) => {
              if (docList.document_name === "ingredient_list") {
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

export default StudyInformationForm;
