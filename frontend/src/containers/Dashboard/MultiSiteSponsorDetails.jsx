import * as React from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import ProtocolInformationForm from "../Dashboard/ProtocolType/MultiSiteSponsor/ProtocolInformationForm";
import ContactInformationForm from "../Dashboard/ProtocolType/MultiSiteSponsor/ContactInformationForm";
import StudyInformationForm from "../Dashboard/ProtocolType/MultiSiteSponsor/StudyInformationForm";
import InformedConsentForm from "../Dashboard/ProtocolType/MultiSiteSponsor/InformedConsentForm";
import ProtocolProceduresForm from "../Dashboard/ProtocolType/MultiSiteSponsor/ProtocolProceduresForm";
import SubmissionForm from "../Dashboard/ProtocolType/MultiSiteSponsor/SubmissionForm";
import { useLocation } from "react-router-dom";

const MultiSiteSponsorDetails = ({
  protocolTypeDetails,
  protocolDetailsById,
}) => {
  const [protocolDetailsByIdState, setProtocolDetailsByIdState] =
    React.useState(protocolDetailsById);
  const [apiCallIdentifier, setApiCallIdentifier] = React.useState(false);

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    if (value === 5) {
      setApiCallIdentifier(true);
    }
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
  const [value, setValue] = React.useState(0);

  const handleButtonClick = (index) => {
    setValue(index);
  };

  React.useEffect(() => {
    if (protocolDetailsById) {
      setProtocolDetailsByIdState(protocolDetailsById);
    }
  }, [protocolDetailsById]);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Title Section */}
      <Typography
        variant="h2"
        sx={{
          mb: 3,
          mt: 3,
          textAlign: "left",
          fontSize: { xs: "1.2rem", sm: "1.2rem", md: "1.5rem" },
          padding: { xs: "0 8px", sm: "0 24px", md: "0 24px" },
          fontWeight: "bold",
        }}
      >
        {protocolTypeDetails.researchType} Details&nbsp;(
        {protocolTypeDetails.protocolId})
      </Typography>

      {/* Buttons for Tab Navigation */}
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
            onClick={() => handleButtonClick(index)}
            endIcon={<DoubleArrowIcon />}
            variant={value === index ? "contained" : "text"}
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
                "Protocol Information",
                "Contact Information",
                "Study Type",
                "Informed Consent",
                "Protocol Subject",
                "Submission",
              ][index]
            }
          </Button>
        ))}
      </Box>
      {/* <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 2,
          padding: { xs: "0 8px", sm: "0 24px" },
        }}
      >
        {[...Array(6).keys()].map((index) => (
          <Button
            key={index}
            endIcon={<DoubleArrowIcon />}
            variant={value === index ? "contained" : "text"}
            onClick={() => handleButtonClick(index)}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              backgroundColor: value === index ? "primary.main" : "transparent",
              backgroundImage:
                value === index
                  ? "none"
                  : "linear-gradient(45deg, #6e7dff, #00c6ff)",
              color: value === index ? "white" : "white",
              "&:hover": {
                backgroundColor:
                  value === index
                    ? "primary.dark"
                    : "linear-gradient(45deg, #4f5db3, #0094c4)",
              },
              flex: 1,
              minWidth: { xs: "100%", sm: "48%", md: "33%", lg: "25%" },
              marginBottom: { xs: "10px", sm: "0px" },
              fontSize: {
                xs: "0.8rem",
                sm: "0.85rem",
                md: "0.9rem",
                lg: "1rem",
              },
            }}
          >
            {
              [
                "Protocol Information",
                "Contact Information",
                "Study Type",
                "Informed Consent",
                "Protocol Subject",
                "Submission",
              ][index]
            }
          </Button>
        ))}
      </Box> */}

      {/* Content for each tab */}
      <CustomTabPanel value={value} index={0}>
        <ProtocolInformationForm
          protocolTypeDetails={protocolTypeDetails}
          protocolInformation={protocolDetailsByIdState?.protocol_information}
          submissionForm={protocolDetailsByIdState?.submission_information}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ContactInformationForm
          protocolTypeDetails={protocolTypeDetails}
          contactInformation={protocolDetailsByIdState?.contact_information}
          submissionForm={protocolDetailsByIdState?.submission_information}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <StudyInformationForm
          protocolTypeDetails={protocolTypeDetails}
          studyInformation={protocolDetailsByIdState?.study_information}
          submissionForm={protocolDetailsByIdState?.submission_information}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <InformedConsentForm
          protocolTypeDetails={protocolTypeDetails}
          informedConsent={protocolDetailsByIdState?.informed_consent}
          submissionForm={protocolDetailsByIdState?.submission_information}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <ProtocolProceduresForm
          protocolTypeDetails={protocolTypeDetails}
          protocolProcedures={protocolDetailsByIdState?.protocol_procedure}
          submissionForm={protocolDetailsByIdState?.submission_information}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <SubmissionForm
          protocolTypeDetails={protocolTypeDetails}
          protocolDetailsById={protocolDetailsByIdState}
          apiCallIdentifier={apiCallIdentifier}
          submissionForm={protocolDetailsByIdState?.submission_information}
          monitorInformation={protocolDetailsByIdState?.clinical_trail_monitor_information}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
    </Box>
  );
};

export default MultiSiteSponsorDetails;
