import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { createInformedConsent } from "../../../../../services/ProtocolType/ClinicalResearcherService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

const consentType = [
  { label: "Pre study consent", value: "1" },
  { label: "Consent revision", value: "2" },
  { label: "Research study questionnaire review", value: "3" },
  { label: "Protocol revision", value: "4" },
  { label: "Post Study questionnaire", value: "5" },
  { label: "Post market questionnaire", value: "6" },
  { label: "HIPAA authorization agreement", value: "7" },
  { label: "Waiver of HIPAA agreement", value: "8" },
  { label: "Advertising documents review", value: "9" },
  { label: "Research subject compensation review ", value: "10" },
];

function InformedConsentForm({ protocolTypeDetails, informedConsent, type }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [termsSelected, setTermsSelected] = React.useState(false);
  const [formData, setFormData] = useState({
    consent_type: "",
    no_consent_explain: "",
    include_icf: "",
    participation_compensated: "",
    other_language_selection: "",
    professional_translator: "",
    professional_translator_explain: "",
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id,
  });
  const [errors, setErrors] = useState({});

  const handleTermsChecked = (event) => {
    const { checked } = event.target;
    if (checked === true) {
      setTermsSelected(true);
    } else if (checked === false) {
      setTermsSelected(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      let isValid = true;
      if (isValid === true) {
        dispatch(createInformedConsent(formData)).then((data) => {
          if (data.payload.status === 200) {
          } else {
          }
        });
      }
    } catch (error) {}
  };

  console.log("informedConsent", informedConsent);
  const consentTypeArr = informedConsent?.consent_type?.split(",");
  return (
    <Row>
      <form onSubmit={handleSubmitData}>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              What types of documents to be reviewed please select below
            </FormLabel>
            {consentType.map((consentList, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  label={consentList.label}
                  value={consentList.value}
                  checked={consentTypeArr?.find(
                    (id) => Number(id) === Number(consentList.value)
                  )}
                />
              );
            })}
          </FormControl>
        </Form.Group>
        {/* {consentTypeArr?.includes("1") && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain why no consent
            </FormLabel>
            <p className="explain_text">
              {informedConsent?.no_consent_explain}
            </p>
          </Form.Group>
        )} */}

        {/* {consentTypeArr?.includes("6") && (
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Will HIPAA authorization language be included in the ICF
                (informed consent form)?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="include_icf"
              >
                <FormControlLabel
                  value="Yes"
                  control={<Radio />}
                  label="Yes"
                  checked={informedConsent?.include_icf === "Yes"}
                />
                <FormControlLabel
                  value="No"
                  control={<Radio />}
                  label="No"
                  checked={informedConsent?.include_icf === "No"}
                />
              </RadioGroup>
            </FormControl>
          </Form.Group>
        )} */}
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              {" "}
              Will the participants be compensated for participation in the
              study?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="participation_compensated"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={informedConsent?.participation_compensated === "Yes"}
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={informedConsent?.participation_compensated === "No"}
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Will the consent forms be offered in languages other than English?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="other_language_selection"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={informedConsent?.other_language_selection === "Yes"}
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={informedConsent?.other_language_selection === "No"}
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {informedConsent?.other_language_selection === "Yes" && (
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Have the documents been translated by a professional translator?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="professional_translator"
              >
                <FormControlLabel
                  value="Yes"
                  control={<Radio />}
                  label="Yes"
                  checked={informedConsent?.professional_translator === "Yes"}
                />
                <FormControlLabel
                  value="No"
                  control={<Radio />}
                  label="No"
                  checked={informedConsent?.professional_translator === "No"}
                />
              </RadioGroup>
            </FormControl>
          </Form.Group>
        )}
        {informedConsent?.professional_translator === "No" && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {informedConsent?.professional_translator_explain}
            </p>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <InputLabel id="demo-simple-select-autowidth-label">
            Uploaded all consent documents, including translated consents, if
            applicable <br /> (if applying for waiver of consent, document
            explaining reasoning must be uploaded)
          </InputLabel>
          {informedConsent?.documents?.length > 0 &&
            informedConsent?.documents?.map((docList, index) => {
              if (docList.document_name === "consent_files") {
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
        <Form.Group as={Col} className="ul-list">
          <p>
            The informed consent process is a continuous process and the IRB
            expects that proper subject consent is ensured by the investigator
            throughout the research study. To comply with the terms set forth by
            this IRB, the investigator must ensure that:
          </p>
          <ul>
            <li>
              IRBHUB provides qualified reviewers with expertise in the relevant
              subject matter that is crucial for your research. Our experts
              review the document to meet your present or future research needs.
            </li>
            <li>
              The expert reviews of documents doesn't give an approval for
              research study, it only provides ethical and or research needs or
              guidance in the context of research.
            </li>
            <li>
              Providing us more detail on research protocol does help our
              experts to give you more relevant suggestions or guidance.
            </li>
            <li>
              If your request for documents review about informed Consent for a
              research subject please follow some required rules on consent as
              below.
            </li>
            <li>
              The informed consent discussion must be performed in a private
              setting free from other people who may overhear the discussion,
              such as a private exam room or other closed-door setting.
            </li>
            <li>
              The consent discussion must be in language understandable to the
              potential research participant’s comprehension level.
            </li>
            <li>
              Only the most current, IRB-approved consent forms may be used for
              enrollment.
            </li>
            <li>
              All efforts must be taken to ensure participant anonymity
              including:
            </li>
            <li>
              Safe storage of subject identifiers-all subject identifiers must
              be coded and de-identified
            </li>
            <li>
              All paper-based records will be stored in a double-locked area
              such as a locking filing cabinet inside of a locking door and only
              accessible to authorized staff.
            </li>
            <li>
              All electronic-based records will only be accessed by authorized
              staff using secure login credentials.
            </li>
            <li>
              Your initials below signify that you have read the terms and agree
              with them:
            </li>
          </ul>
        </Form.Group>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
            <FormGroup onChange={(event) => handleTermsChecked(event)}>
              <FormControlLabel
                control={<Checkbox />}
                label="You have read the term and agree with the above research compliance."
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

export default InformedConsentForm;
