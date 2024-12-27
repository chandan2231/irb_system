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
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { Box, useTheme } from "@mui/material";
import { useDispatch } from "react-redux";
import { createInformedConsent } from "../../../../services/ProtocolType/ClinicalResearcherService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../../components/Loader";

const informedConsentInfoSchema = yup.object().shape({
  principal_investigator_name: yup.string().required("This is required"),
  site_address: yup.string().required("This is required"),
  primary_phone: yup.string().required("This is required"),
  always_primary_phone: yup.string().required("This is required"),
});

function InformedConsentForm({ protocolTypeDetails, informedConsent }) {
  const [loader, setLoader] = useState(false)

  const theme = useTheme();
  const dispatch = useDispatch();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [termsSelected, setTermsSelected] = React.useState(false);
  const [showElectronicConsentField, setShowElectronicConsentField] =
    React.useState(false);
  const [formData, setFormData] = useState({
    principal_investigator_name: "",
    site_address: "",
    additional_site_address: "",
    primary_phone: "",
    always_primary_phone: "",
    site_electronic_consent: "",
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (informedConsent) {
      setFormData({
        principal_investigator_name:
          informedConsent?.principal_investigator_name || "",
        site_address: informedConsent?.site_address || "",
        additional_site_address: informedConsent?.additional_site_address || "",
        primary_phone: informedConsent?.primary_phone || "",
        always_primary_phone: informedConsent?.always_primary_phone || "",
        site_electronic_consent: informedConsent?.site_electronic_consent || "",
        protocol_id: protocolTypeDetails.protocolId,
        created_by: userDetails.id,
      });

      setShowElectronicConsentField(
        informedConsent?.site_electronic_consent === "Yes",
      );
    }
  }, [informedConsent, protocolTypeDetails.protocolId]);

  const handleTermsChecked = (event) => {
    setTermsSelected(event.target.checked);
  };

  const handleRadioButtonElectronicConsent = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setShowElectronicConsentField(value === "Yes"); // Toggle additional fields if electronic consent is 'Yes'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    setLoader(true)
    e.preventDefault();
    try {
      const getValidatedform = await informedConsentInfoSchema.validate(
        formData,
        { abortEarly: false },
      );
      const isValid = await informedConsentInfoSchema.isValid(getValidatedform);
      if (isValid === true) {
        dispatch(createInformedConsent(formData)).then((data) => {
          if (data.payload.status === 200) {
            setLoader(false)
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
            e.target.reset();
          }
        });
      }
    } catch (error) {
      setLoader(false)
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        const firstErrorField = document.querySelector(
          `[name="${Object.keys(newErrors)[0]}"]`,
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

  console.log("informedConsentFormData", {
    informedConsent,
    formData,
    errors,
  });

  console.log("informed consent form ======>", loader)

  if (loader) {
    return (
      <Loader />
    );
  }

  return (
    <>
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
      <Row>
        <form onSubmit={handleSubmitData}>
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                The IRB will provide your site with an informed consent form
                formatted with your information. Please answer the questions
                below so that we may include it in the document
              </FormLabel>
            </Box>
          </Form.Group>
          <Form.Group
            as={Col}
            controlId="validationFormik06"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Principal Investigator name *"
                id="principal_investigator_name"
                name="principal_investigator_name"
                onChange={handleChange}
                value={formData.principal_investigator_name}
              />
            </Box>
            {errors.principal_investigator_name && (
              <div className="error">{errors.principal_investigator_name}</div>
            )}
          </Form.Group>
          <Form.Group
            as={Col}
            controlId="validationFormik06"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Site Address *"
                id="site_address"
                name="site_address"
                onChange={handleChange}
                value={formData.site_address}
              />
            </Box>
            {errors.site_address && (
              <div className="error">{errors.site_address}</div>
            )}
          </Form.Group>
          <Form.Group
            as={Col}
            controlId="validationFormik06"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Additional Site Address"
                id="additional_site_address"
                name="additional_site_address"
                onChange={handleChange}
                value={formData.additional_site_address}
              />
            </Box>
          </Form.Group>
          <Form.Group
            as={Col}
            controlId="validationFormik06"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Primary phone number to be listed on the ICF (include the area code) *"
                id="primary_phone"
                name="primary_phone"
                onChange={handleChange}
                value={formData.primary_phone}
              />
            </Box>
            {errors.primary_phone && (
              <div className="error">{errors.primary_phone}</div>
            )}
          </Form.Group>
          <Form.Group
            as={Col}
            controlId="validationFormik06"
            className="mt-mb-20"
          >
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="24-hour phone number to be listed on the ICF (include the area code) *"
                id="always_primary_phone"
                name="always_primary_phone"
                onChange={handleChange}
                value={formData.always_primary_phone}
              />
            </Box>
            {errors.always_primary_phone && (
              <div className="error">{errors.always_primary_phone}</div>
            )}
          </Form.Group>
          <Form.Group
            as={Col}
            controlId="validationFormik01"
            className="mt-mb-20"
          >
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Will your site(s) use electronic consent?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="site_electronic_consent"
                value={formData.site_electronic_consent}
                onChange={handleRadioButtonElectronicConsent}
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
          {showElectronicConsentField && (
            <Form.Group
              as={Col}
              controlId="validationFormik06"
              className="mt-mb-20"
            >
              <Box sx={{ width: "100%", maxWidth: "100%" }}>
                <TextField
                  fullWidth
                  label="Electronic Consent Field (Example)"
                  id="electronic_consent_field"
                  name="electronic_consent_field"
                  value={formData.electronic_consent_field}
                  onChange={handleChange}
                />
              </Box>
            </Form.Group>
          )}
          <Form.Group as={Col} className="ul-list">
            <p>
              Mandatory message to end users, must be initialed before moving on
              to the next step:
            </p>
            <p>
              The informed consent process is a continuous process and the IRB
              expects that proper subject consent is ensured by the investigator
              throughout the research study. To comply with the terms set forth
              by this IRB, the investigator must ensure that:
            </p>
            <ul>
              <li>
                No study procedures shall be conducted prior to completion of
                the informed consent forms which include subject or legally
                authorized representative (LAR) signatures and date,
                investigator or person obtaining consent signature and date, and
                providing a copy of the signed consent to the study participant.
              </li>
              <li>
                The identified research participant is given plenty of time to
                consider their participation in the study and all questions are
                answered. The identified research participant must be told that
                their participation in the study is voluntary and that they are
                under no obligation to participate. The potential participant
                must voice understanding before proceeding.
              </li>
              <li>
                The consent discussion must be in language understandable to the
                potential research participant’s comprehension level.
              </li>
              <li>
                The informed consent discussion must be performed in a private
                setting free from other people who may overhear the discussion,
                such as a private exam room or other closed-door setting.
              </li>
              <li>
                Only the most current, IRB-approved consent forms may be used
                for enrollment.
              </li>
              <li>
                All efforts must be taken to ensure participant anonymity
                including:
                <ul style={{ marginTop: 0 }}>
                  <li>
                    Safe storage of subject identifiers-all subject identifiers
                    must be coded and de-identified
                  </li>
                  <li>
                    All paper-based records will be stored in a double-locked
                    area such as a locking filing cabinet inside of a locking
                    door and only accessible to authorized staff.
                  </li>
                  <li>
                    All electronic-based records will only be accessed by
                    authorized staff using secure login credentials.
                  </li>
                </ul>
              </li>
            </ul>
          </Form.Group>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
              <FormGroup onChange={(event) => handleTermsChecked(event)}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Your initials below signify that you have read the terms and agree with them:"
                />
              </FormGroup>
            </FormControl>
          </Form.Group>
          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
            style={{ textAlign: "right" }}
          >
            <Button
              variant="contained"
              color="primary"
              type="Submit"
              disabled={!termsSelected}
            >
              SAVE AND CONTINUE
            </Button>
          </Form.Group>
        </form>
      </Row>
    </>
  );
}

export default InformedConsentForm;
