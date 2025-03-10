import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ProtocolInformationForm from "../ProtocolList/AdminProtocolType/MultiSiteSponsor/ProtocolInformationForm";
import ContactInformationForm from "../ProtocolList/AdminProtocolType/MultiSiteSponsor/ContactInformationForm";
import StudyInformationForm from "../ProtocolList/AdminProtocolType/MultiSiteSponsor/StudyInformationForm";
import InformedConsentForm from "../ProtocolList/AdminProtocolType/MultiSiteSponsor/InformedConsentForm";
import SubmissionForm from "../ProtocolList/AdminProtocolType/MultiSiteSponsor/SubmissionForm";
import ProtocolProceduresForm from "../ProtocolList/AdminProtocolType/MultiSiteSponsor/ProtocolProceduresForm";
import { votingMemberApprovalProtocol } from "../../../services/Admin/MembersService";
import { useLocation } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

// Validation schema
const memberProtocolSchema = yup.object().shape({
  protocol: yup.string().required("This is required"),
  consent: yup.string().required("This is required"),
  supported_documents: yup.string().required("This is required"),
  electronic_signature: yup.string().required("This is required"),
});

const MultiSiteSponsorDetails = ({
  protocolTypeDetails,
  protocolDetailsById,
  type,
}) => {
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography
              sx={{
                mx: { xs: 1, sm: 3, md: 3 },
                p: 3,
                backgroundColor: "#ffffff",
                border: "1px solid #cccccc",
              }}
            >
              {children}
            </Typography>
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  const location = useLocation();
  const dispatch = useDispatch();
  const [value, setValue] = React.useState(0);
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    protocol: "",
    consent: "",
    supported_documents: "",
    comment: "",
    electronic_signature: "",
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id,
    id: protocolTypeDetails.id,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioButtonProtocol = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioButtonConsent = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioButtonSupportedDocument = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      const getValidatedform = await memberProtocolSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await memberProtocolSchema.isValid(getValidatedform);
      if (isValid === true) {
        dispatch(votingMemberApprovalProtocol(formData)).then((data) => {
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
          }
        });
      }
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
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

  const handleButtonClick = (index) => {
    setValue(index);
  };

  return (
    <Box sx={{ width: "100%" }}>
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
      <h2 className="ml-20">
        {protocolTypeDetails.researchType} Details(
        {protocolTypeDetails.protocolId})
      </h2>

      {type === "member" && (
        <Row className="ml-20">
          <h3>Protocol Approval Voting</h3>
          <form onSubmit={handleSubmitData}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={5} lg={5}>
                <FormControl fullWidth>
                  <FormLabel>Protocol</FormLabel>
                  <RadioGroup
                    row
                    name="protocol"
                    value={formData.protocol}
                    onChange={handleRadioButtonProtocol}
                  >
                    <FormControlLabel
                      value="Approve"
                      control={<Radio />}
                      label="Approve"
                    />
                    <FormControlLabel
                      value="Not Approve"
                      control={<Radio />}
                      label="Not Approve"
                    />
                  </RadioGroup>
                </FormControl>
                {errors.protocol && (
                  <div className="error">{errors.protocol}</div>
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={5} lg={5}>
                <FormControl fullWidth>
                  <FormLabel>Consent</FormLabel>
                  <RadioGroup
                    row
                    name="consent"
                    value={formData.consent}
                    onChange={handleRadioButtonConsent}
                  >
                    <FormControlLabel
                      value="Approve"
                      control={<Radio />}
                      label="Approve"
                    />
                    <FormControlLabel
                      value="Not Approve"
                      control={<Radio />}
                      label="Not Approve"
                    />
                  </RadioGroup>
                </FormControl>
                {errors.consent && (
                  <div className="error">{errors.consent}</div>
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={5} lg={5}>
                <FormControl fullWidth>
                  <FormLabel>Supported Documents</FormLabel>
                  <RadioGroup
                    row
                    name="supported_documents"
                    value={formData.supported_documents}
                    onChange={handleRadioButtonSupportedDocument}
                  >
                    <FormControlLabel
                      value="Approve"
                      control={<Radio />}
                      label="Approve"
                    />
                    <FormControlLabel
                      value="Not Approve"
                      control={<Radio />}
                      label="Not Approve"
                    />
                  </RadioGroup>
                </FormControl>
                {errors.supported_documents && (
                  <div className="error">{errors.supported_documents}</div>
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={7} lg={7}>
                <TextField
                  fullWidth
                  placeholder="Enter your comment"
                  label="Comment"
                  id="comment"
                  name="comment"
                  onChange={handleInputChange}
                  value={formData.comment}
                  multiline
                  rows={4}
                  maxRows={10}
                />
                {errors.comment && (
                  <div className="error">{errors.comment}</div>
                )}
              </Grid>

              <Grid item xs={12} sm={6} md={7} lg={7}>
                <TextField
                  fullWidth
                  placeholder="Enter your name"
                  label="Electronic Signature *"
                  id="electronic_signature"
                  name="electronic_signature"
                  onChange={handleInputChange}
                  value={formData.electronic_signature}
                />
                {errors.electronic_signature && (
                  <div className="error">{errors.electronic_signature}</div>
                )}
              </Grid>

              <Grid item xs={12} style={{ textAlign: "right" }}>
                <Button variant="contained" color="primary" type="Submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Row>
      )}

      <Box
        sx={{
          borderColor: "#d3d3d3",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack on smaller screens
          gap: 1,
          justifyContent: { xs: "center", sm: "flex-start" }, // Center on small screens
          flexWrap: "wrap", // Allow wrapping for smaller screens
          margin: { xs: "0 8px", sm: "0 24px", md: "0 24px" },
          overflow: "hidden", // Prevent any overflow from buttons
        }}
      >
        {[...Array(6).keys()].map((index) => (
          <Button
            key={index}
            endIcon={<DoubleArrowIcon />}
            variant={value === index ? "contained" : "text"}
            onClick={() => handleButtonClick(index)}
            sx={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottom: 0, // No bottom border by default
              backgroundColor: value === index ? "#325ca8" : "#d3d3d3", // Gray by default, White when selected
              color: value === index ? "white" : "rgba(0, 0, 0, 0.6)",
              flex: 1,
              minWidth: { xs: "100%", sm: "auto" }, // Full width on small screens
              letterSpacing: 0,
              whiteSpace: "nowrap", // Prevents text from breaking into two lines
            }}
          >
            {
              [
                "Protocol Info",
                "Contact Info",
                "Study Type",
                "Informed Consent",
                "Protocol Subject",
                "Submission",
              ][index]
            }
          </Button>
        ))}
      </Box>

      <CustomTabPanel value={value} index={0}>
        <ProtocolInformationForm
          protocolTypeDetails={protocolTypeDetails}
          protocolInformation={protocolDetailsById?.protocol_information}
          type={type}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ContactInformationForm
          protocolTypeDetails={protocolTypeDetails}
          contactInformation={protocolDetailsById?.contact_information}
          type={type}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <StudyInformationForm
          protocolTypeDetails={protocolTypeDetails}
          studyInformation={protocolDetailsById?.study_information}
          type={type}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <InformedConsentForm
          protocolTypeDetails={protocolTypeDetails}
          informedConsent={protocolDetailsById?.informed_consent}
          type={type}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <ProtocolProceduresForm
          protocolTypeDetails={protocolTypeDetails}
          protocolProcedures={protocolDetailsById?.protocol_procedure}
          type={type}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <SubmissionForm protocolTypeDetails={protocolTypeDetails} type={type} />
      </CustomTabPanel>
    </Box>
  );
};

export default MultiSiteSponsorDetails;
