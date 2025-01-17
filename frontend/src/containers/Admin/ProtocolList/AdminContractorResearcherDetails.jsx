import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ProtocolInformationForm from "../ProtocolList/AdminProtocolType/ContractorResearcher/ProtocolInformationForm";
import InvestigatorInformationForm from "../ProtocolList/AdminProtocolType/ContractorResearcher/InvestigatorInformationForm";
import StudyInformationForm from "../ProtocolList/AdminProtocolType/ContractorResearcher/StudyInformationForm";
import InformedConsentForm from "../ProtocolList/AdminProtocolType/ContractorResearcher/InformedConsentForm";
import ProtocolProceduresForm from "../ProtocolList/AdminProtocolType/ContractorResearcher/ProtocolProceduresForm";
import SubmissionForm from "../ProtocolList/AdminProtocolType/ContractorResearcher/SubmissionForm";
import { votingMemberApprovalProtocol } from "../../../services/Admin/MembersService";
import { useDispatch, useSelector } from "react-redux";
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
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

const memberProtocolSchema = yup.object().shape({
  protocol: yup.string().required("This is required"),
  consent: yup.string().required("This is required"),
  supported_documents: yup.string().required("This is required"),
  electronic_signature: yup.string().required("This is required"),
});

const ContractorResearcherDetails = ({
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
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
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
            // setFormData({});
            // e.target.reset();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
            <Grid container>
              <Grid item xs={12} md={5} lg={5}>
                <Form.Group
                  as={Col}
                  controlId="validationFormik01"
                  className="mt-mb-10"
                >
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Protocol
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
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
                </Form.Group>
                <Form.Group
                  as={Col}
                  controlId="validationFormik02"
                  className="mt-mb-10"
                >
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Consent
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
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
                </Form.Group>
                <Form.Group
                  as={Col}
                  controlId="validationFormik03"
                  className="mt-mb-10"
                >
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Supported Documents
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
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
                </Form.Group>
              </Grid>
              <Grid item xs={12} md={7} lg={7} className="pr-25">
                <Form.Group
                  as={Col}
                  controlId="validationFormik04"
                  className="mt-mb-10"
                >
                  <TextField
                    fullWidth
                    placeholder="Enter your comment"
                    label="Comment"
                    id="comment"
                    name="comment"
                    onChange={handleInputChange}
                    defaultValue={formData.comment}
                    multiline
                    rows={4}
                    maxRows={10}
                  />
                  {errors.comment && (
                    <div className="error">{errors.comment}</div>
                  )}
                </Form.Group>
                <Form.Group
                  as={Col}
                  controlId="validationFormik05"
                  className="mt-mb-10"
                >
                  <TextField
                    fullWidth
                    placeholder="Enter your name"
                    label="Electronic Signature *"
                    id="electronic_signature"
                    name="electronic_signature"
                    onChange={handleInputChange}
                    defaultValue={formData.electronic_signature}
                  />
                  {errors.electronic_signature && (
                    <div className="error">{errors.electronic_signature}</div>
                  )}
                </Form.Group>
              </Grid>
            </Grid>
            <Form.Group
              as={Col}
              controlId="validationFormik010"
              className="mt-mb-20 pr-25"
              style={{ textAlign: "right" }}
            >
              <Button variant="contained" color="primary" type="Submit">
                SUBMIT
              </Button>
            </Form.Group>
          </form>
        </Row>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderColor: "divider",
        }}
        style={{ padding: "0px 0px 0px 24px" }}
      >
        <Button
          endIcon={<DoubleArrowIcon />}
          variant={value === 0 ? "contained" : "text"}
          onClick={() => handleButtonClick(0)}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            backgroundColor: value === 0 ? "primary.main" : "transparent", // Active color for active button
            backgroundImage:
              value === 0 ? "none" : "linear-gradient(45deg, #6e7dff, #00c6ff)", // Gradient background for inactive button
            color: value === 0 ? "white" : "white",
            "&:hover": {
              backgroundColor:
                value === 0
                  ? "primary.dark"
                  : "linear-gradient(45deg, #4f5db3, #0094c4)", // Hover effect for inactive gradient button
            },
          }}
        >
          Protocol Information
        </Button>
        <Button
          endIcon={<DoubleArrowIcon />}
          variant={value === 1 ? "contained" : "text"}
          onClick={() => handleButtonClick(1)}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            backgroundColor: value === 1 ? "primary.main" : "transparent", // Active color for active button
            backgroundImage:
              value === 1 ? "none" : "linear-gradient(45deg, #6e7dff, #00c6ff)", // Gradient background for inactive button
            color: value === 1 ? "white" : "white",
            "&:hover": {
              backgroundColor:
                value === 1
                  ? "primary.dark"
                  : "linear-gradient(45deg, #4f5db3, #0094c4)", // Hover effect for inactive gradient button
            },
          }}
        >
          Investigator Information
        </Button>
        <Button
          endIcon={<DoubleArrowIcon />}
          variant={value === 2 ? "contained" : "text"}
          onClick={() => handleButtonClick(2)}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            backgroundColor: value === 2 ? "primary.main" : "transparent", // Active color for active button
            backgroundImage:
              value === 2 ? "none" : "linear-gradient(45deg, #6e7dff, #00c6ff)", // Gradient background for inactive button
            color: value === 2 ? "white" : "white",
            "&:hover": {
              backgroundColor:
                value === 2
                  ? "primary.dark"
                  : "linear-gradient(45deg, #4f5db3, #0094c4)", // Hover effect for inactive gradient button
            },
          }}
        >
          Study Type
        </Button>
        <Button
          endIcon={<DoubleArrowIcon />}
          variant={value === 3 ? "contained" : "text"}
          onClick={() => handleButtonClick(3)}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            backgroundColor: value === 3 ? "primary.main" : "transparent", // Active color for active button
            backgroundImage:
              value === 3 ? "none" : "linear-gradient(45deg, #6e7dff, #00c6ff)", // Gradient background for inactive button
            color: value === 3 ? "white" : "white",
            "&:hover": {
              backgroundColor:
                value === 3
                  ? "primary.dark"
                  : "linear-gradient(45deg, #4f5db3, #0094c4)", // Hover effect for inactive gradient button
            },
          }}
        >
          Informed Consent
        </Button>
        <Button
          endIcon={<DoubleArrowIcon />}
          variant={value === 4 ? "contained" : "text"}
          onClick={() => handleButtonClick(4)}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            backgroundColor: value === 4 ? "primary.main" : "transparent", // Active color for active button
            backgroundImage:
              value === 4 ? "none" : "linear-gradient(45deg, #6e7dff, #00c6ff)", // Gradient background for inactive button
            color: value === 4 ? "white" : "white",
            "&:hover": {
              backgroundColor:
                value === 4
                  ? "primary.dark"
                  : "linear-gradient(45deg, #4f5db3, #0094c4)", // Hover effect for inactive gradient button
            },
          }}
        >
          Protocol Procedures
        </Button>
        <Button
          variant={value === 5 ? "contained" : "text"}
          onClick={() => handleButtonClick(5)}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            backgroundColor: value === 5 ? "primary.main" : "transparent", // Active color for active button
            backgroundImage:
              value === 5 ? "none" : "linear-gradient(45deg, #6e7dff, #00c6ff)", // Gradient background for inactive button
            color: value === 5 ? "white" : "white",
            "&:hover": {
              backgroundColor:
                value === 5
                  ? "primary.dark"
                  : "linear-gradient(45deg, #4f5db3, #0094c4)", // Hover effect for inactive gradient button
            },
          }}
        >
          Submission
        </Button>
      </Box>
      {/* here */}
      <CustomTabPanel value={value} index={0}>
        <ProtocolInformationForm
          protocolTypeDetails={protocolTypeDetails}
          protocolInformation={protocolDetailsById?.protocol_information}
          type={type}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <InvestigatorInformationForm
          protocolTypeDetails={protocolTypeDetails}
          investigatorInformation={
            protocolDetailsById?.investigator_information
          }
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

export default ContractorResearcherDetails;
