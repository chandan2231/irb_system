import * as React from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import ProtocolInformationForm from "../Dashboard/ProtocolType/DocumentReview/ProtocolInformationForm";
import InvestigatorInformationForm from "../Dashboard/ProtocolType/DocumentReview/InvestigatorInformationForm";
import InformedConsentForm from "../Dashboard/ProtocolType/DocumentReview/InformedConsentForm";
import SubmissionForm from "../Dashboard/ProtocolType/DocumentReview/SubmissionForm";
import { useLocation } from "react-router-dom";

const DocumentReviewDetails = ({
  protocolTypeDetails,
  protocolDetailsById,
}) => {
  const [protocolDetailsByIdState, setProtocolDetailsByIdState] =
    React.useState(protocolDetailsById);
  const [apiCallIdentifier, setApiCallIdentifier] = React.useState(false);

  const location = useLocation();

  const [value, setValue] = React.useState(0); // Active tab state
  const handleButtonClick = (index) => {
    setValue(index);
  };

  React.useEffect(() => {
    if (protocolDetailsById) {
      setProtocolDetailsByIdState(protocolDetailsById);
    }
  }, [protocolDetailsById]);

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
        {[...Array(4).keys()].map((index) => (
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
                "Protocol Info",
                "Investigator Info",
                "Document Review",
                "Submission",
              ][index]
            }
          </Button>
        ))}
      </Box>

      {/* Content for each tab */}
      <CustomTabPanel value={value} index={0}>
        <ProtocolInformationForm
          protocolTypeDetails={protocolTypeDetails}
          protocolInformation={protocolDetailsByIdState?.protocol_information}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <InvestigatorInformationForm
          protocolTypeDetails={protocolTypeDetails}
          investigatorInformation={
            protocolDetailsByIdState?.investigator_information
          }
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <InformedConsentForm
          protocolTypeDetails={protocolTypeDetails}
          informedConsent={protocolDetailsByIdState?.informed_consent}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>

      <CustomTabPanel value={value} index={3}>
        <SubmissionForm
          protocolTypeDetails={protocolTypeDetails}
          protocolDetailsById={protocolDetailsByIdState}
          apiCallIdentifier={apiCallIdentifier}
          submissionForm={protocolDetailsByIdState?.submission_information}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
    </Box>
  );
};

export default DocumentReviewDetails;
