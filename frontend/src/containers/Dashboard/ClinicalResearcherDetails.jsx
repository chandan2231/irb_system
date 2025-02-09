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
        variant="h4"
        sx={{
          mb: 2,
          textAlign: "center",
          fontSize: { xs: "1.2rem", sm: "2rem" },
        }}
      >
        {protocolTypeDetails.researchType}&nbsp;(
        {protocolTypeDetails.protocolId})
      </Typography>

      {/* Buttons as tabs with icons */}
      <Box
        sx={{
          borderBottom: 1,
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
            sx={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottom: 0, // No bottom border by default
              "&:hover": {
                borderBottom: "none", // Ensures no bottom border on hover
                backgroundColor: value === index ? "white" : "#b0b0b0", // Light gray on hover
              },
              backgroundColor: value === index ? "white" : "#d3d3d3", // Gray by default, White when selected
              color: value === index ? "black" : "rgba(0, 0, 0, 0.6)",
              borderTop: value === index ? "1px solid #d3d3d3" : "none",
              borderLeft: value === index ? "1px solid #d3d3d3" : "none",
              borderRight: value === index ? "1px solid #d3d3d3" : "none",
              borderBottom: { xs: "1px solid #d3d3d3", sm: "none" }, // Bottom border on small screens
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
      {/* <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 2,
          padding: { xs: "0 8px", sm: "0 24px" },
        }}
      >
        {[...Array(3).keys()].map((index) => (
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
                "Investigator and Protocol Info",
                "Informed Consent Document info",
                "Submission",
              ][index]
            }
          </Button>
        ))}
      </Box> */}

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
