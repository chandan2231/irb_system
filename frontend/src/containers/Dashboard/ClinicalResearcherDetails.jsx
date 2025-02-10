import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import InvestigatorInformationForm from "../Dashboard/ProtocolType/ClinicalResearcher/InvestigatorInformationForm";
import InformedConsentForm from "../Dashboard/ProtocolType/ClinicalResearcher/InformedConsentForm";
import SubmissionForm from "../Dashboard/ProtocolType/ClinicalResearcher/SubmissionForm";
import { useLocation } from "react-router-dom";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { Box, Button, Typography } from "@mui/material";

const ClinicalResearcherDetails = ({
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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const location = useLocation();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    if (protocolDetailsById) {
      setProtocolDetailsByIdState(protocolDetailsById);
    }
  }, [protocolDetailsById]);

  const handleButtonClick = (index) => {
    setValue(index);
  };
  return (
    <Box sx={{ width: "100%" }}>
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

      {/* Buttons as tabs with icons */}
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
        {[...Array(3).keys()].map((index) => (
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
                "Investigator and Protocol Info",
                "Informed Consent Document info",
                "Submission",
              ][index]
            }
          </Button>
        ))}
      </Box>

      {/* Tab Content */}
      <CustomTabPanel value={value} index={0}>
        <InvestigatorInformationForm
          protocolTypeDetails={protocolTypeDetails}
          investigatorInformation={
            protocolDetailsById?.investigator_protocol_information
          }
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <InformedConsentForm
          protocolTypeDetails={protocolTypeDetails}
          informedConsent={protocolDetailsById?.consent_information}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <SubmissionForm
          protocolTypeDetails={protocolTypeDetails}
          protocolDetailsById={protocolDetailsById}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
    </Box>
  );
};

export default ClinicalResearcherDetails;
