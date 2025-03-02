import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { createProtocolProcedures } from "../../../../../services/ProtocolType/MultiSiteSponsorService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

import { CustomMUITextFieldWrapper as TextField } from "../../../../../components/Mui/CustomTextField";
import { CustomMUIFormLabel as FormLabel } from "../../../../..components/Mui/CustomFormLabel";
import { CustomInputLabel as InputLabel } from "../../../../..components/Mui/CustomInputLabel";

const enrolledStudyType = [
  { label: "Adults", value: "1" },
  { label: "Children (17 years and under)", value: "2" },
  { label: "Blind/Visually Impaired", value: "3" },
  {
    label: "Deaf/Hard of Hearing (including sign language communicators)",
    value: "4",
  },
  {
    label:
      "Individuals with impaired decision-making (requiring a LAR, including those with impaired or diminished mental capacity, dementia, and those suffering from mental health disorders)",
    value: "5",
  },
  {
    label: "Educationally Disadvantaged/Impaired or no reading skills",
    value: "6",
  },
  { label: "Economically disadvantaged", value: "7" },
  { label: "Healthy individuals", value: "8" },
  { label: "Terminally ill individuals", value: "9" },
  { label: "HIV positive", value: "10" },
  { label: "Hospitalized", value: "11" },
  {
    label:
      "Institutionalized (including nursing home, LTAC, assisted living, residential facility, mental hospital)",
    value: "12",
  },
  { label: "Prisoners", value: "13" },
  { label: "Military Personnel", value: "14" },
  { label: "Pregnant women", value: "15" },
  { label: "Human fetuses/neonates", value: "16" },
  { label: "Non-English speakers", value: "17" },
  { label: "Women only", value: "18" },
  { label: "Men only", value: "19" },
  { label: "Other", value: "20" },
];

const enrolledGroup = [
  { label: "White, not of Hispanic origin", value: "1" },
  { label: "White, of Hispanic origin", value: "2" },
  { label: "Black, not of Hispanic origin", value: "3" },
  { label: "Black, of Hispanic origin", value: "4" },
  { label: "American Indian/Alaskan Native", value: "5" },
  { label: "Asian", value: "6" },
  { label: "Native Hawaiian/Pacific Islander", value: "7" },
  { label: "Multiracial", value: "8" },
  { label: "Other", value: "9" },
];

const recruitmentMethod = [
  { label: "In-person conversation during routine office visits", value: "1" },
  {
    label: "Recruiting participants from previous research studies",
    value: "2",
  },
  {
    label:
      "Mass print advertisements such as a newspaper, magazine, or billboard",
    value: "3",
  },
  { label: "Flyer, poster, or bulletin board in office", value: "4" },
  { label: "Radio or television ads", value: "5" },
  { label: "Direct mail to potential subjects", value: "6" },
  { label: "Internet including social media recruiting", value: "7" },
  { label: "Chart review", value: "8" },
  { label: "Telephone screening", value: "9" },
  { label: "Other", value: "10" },
];

const protocolProcedureInfoSchema = yup.object().shape({
  enrolled_subject: yup.string().required("This is required"),
  research_place_name_address: yup.string().required("This is required"),
});

function ProtocolProceduresForm({
  protocolTypeDetails,
  protocolProcedures,
  type,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [
    showFutureResearchAdditionTextArea,
    setShowFutureResearchAdditionTextArea,
  ] = React.useState(false);
  const [termsSelected, setTermsSelected] = React.useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    enrolled_study_type: "",
    enrolled_type_explain: "",
    enrolled_group: "",
    enrolled_group_explain: "",
    study_excluded: "",
    study_excluded_explain: "",
    enrolled_subject: "",
    recurement_method: "",
    recurement_method_explain: "",
    research_place_name_address: "",
    future_research: "",
    future_research_explain: "",
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      const getValidatedform = await protocolProcedureInfoSchema.validate(
        formData,
        { abortEarly: false }
      );
      const isValid =
        await protocolProcedureInfoSchema.isValid(getValidatedform);
      if (isValid === true) {
        dispatch(createProtocolProcedures(formData)).then((data) => {
          if (data.payload.status === 200) {
          } else {
          }
        });
      }
    } catch (error) {}
  };

  const handleRadioButtonSelectFutureResearch = (event, radio_name) => {
    if (radio_name === "future_research" && event.target.value === "Yes") {
      setShowFutureResearchAdditionTextArea(true);
    } else if (
      radio_name === "future_research" &&
      event.target.value === "No"
    ) {
      setShowFutureResearchAdditionTextArea(false);
    }
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTearmChecked = (event) => {
    const { checked } = event.target;
    if (checked === true) {
      setTermsSelected(true);
    } else if (checked === false) {
      setTermsSelected(false);
    }
  };
  console.log("protocolProcedures", protocolProcedures);
  const studyTypeArr = protocolProcedures?.enrolled_study_type?.split(",");
  const groupTypeArr = protocolProcedures?.enrolled_group?.split(",");
  const recurementMethodArr = protocolProcedures?.recurement_method?.split(",");
  return (
    <Row>
      <form onSubmit={handleSubmitData}>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Which subject populations will be enrolled in the study?
            </FormLabel>
            {enrolledStudyType.map((studyTypeList, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  label={studyTypeList.label}
                  value={studyTypeList.value}
                  checked={studyTypeArr?.find(
                    (id) => Number(id) === Number(studyTypeList.value)
                  )}
                />
              );
            })}
          </FormControl>
        </Form.Group>
        {studyTypeArr?.includes("20") && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {protocolProcedures?.enrolled_type_explain}
            </p>
          </Form.Group>
        )}

        <Form.Group
          as={Col}
          controlId="validationFormik01"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Which race and ethnic groups will be enrolled in the study?
            </FormLabel>
            {enrolledGroup.map((groupList, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  label={groupList.label}
                  value={groupList.value}
                  checked={groupTypeArr?.find(
                    (id) => Number(id) === Number(groupList.value)
                  )}
                />
              );
            })}
          </FormControl>
        </Form.Group>
        {groupTypeArr?.includes("9") === true && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {protocolProcedures?.enrolled_group_explain}
            </p>
          </Form.Group>
        )}
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Will any subject populations be excluded from the study?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="study_excluded"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={protocolProcedures?.study_excluded === "Yes"}
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={protocolProcedures?.study_excluded === "No"}
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {protocolProcedures?.study_excluded === "Yes" && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {protocolProcedures?.study_excluded_explain}
            </p>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik06"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="How many subjects will be enrolled in the study? *"
              id="enrolled_subject"
              name="enrolled_subject"
              value={protocolProcedures?.enrolled_subject}
            />
          </Box>
        </Form.Group>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              What recruitment methods will be used in the study?
            </FormLabel>
            {recruitmentMethod.map((recruitmentMethodList, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  label={recruitmentMethodList.label}
                  value={recruitmentMethodList.value}
                  checked={recurementMethodArr?.find(
                    (id) => Number(id) === Number(recruitmentMethodList.value)
                  )}
                />
              );
            })}
          </FormControl>
        </Form.Group>
        {recurementMethodArr?.includes("10") === true && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {protocolProcedures?.recurement_method_explain}
            </p>
          </Form.Group>
        )}
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Will the sponsor require IRB approval of site-specific templates
              prior to use?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="irb_approval"
              onChange={(event) =>
                handleRadioButtonIrbApproval(event, "irb_approval")
              }
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik03"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <FormLabel id="demo-row-radio-buttons-group-label">
              What is the expected number of sites to participate in this study
              that will be submitted to this IRB *
            </FormLabel>
            <TextField
              variant="outlined"
              placeholder=""
              fullWidth
              name="changes_explain"
              id="explain"
              onChange={handleChange}
            />
          </Box>
        </Form.Group>

        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Will any samples or data collected in this study be retained for
              future research?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="future_research"
              onChange={(event) =>
                handleRadioButtonSelectFutureResearch(event, "future_research")
              }
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Form.Group>

        {showFutureResearchAdditionTextArea === true && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Please explain how the data and/or samples will be stored,
                secured, and de-identified. Include information on how the data
                and/or samples might be used for future research: *
              </FormLabel>
              <TextField
                variant="outlined"
                placeholder=""
                fullWidth
                name="changes_explain"
                id="explain"
                rows={3}
                multiline
                onChange={handleChange}
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
            Uploaded all recruitment templates and subject-facing materials
            here:
          </InputLabel>
          {protocolProcedures?.documents?.length > 0 &&
            protocolProcedures?.documents?.map((docList, index) => {
              if (docList.document_name === "subject_facing_materials") {
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
            <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
            <FormGroup onChange={(event) => handleTearmChecked(event)}>
              <FormControlLabel
                control={<Checkbox />}
                label="You acknowledge that you read the term and agree with them"
              />
            </FormGroup>
          </FormControl>
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

export default ProtocolProceduresForm;
