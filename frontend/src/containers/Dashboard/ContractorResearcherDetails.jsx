import * as React from "react";
import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import ProtocolInformationForm from "../Dashboard/ProtocolType/ContractorResearcher/ProtocolInformationForm";
import InvestigatorInformationForm from "../Dashboard/ProtocolType/ContractorResearcher/InvestigatorInformationForm";
import StudyInformationForm from "../Dashboard/ProtocolType/ContractorResearcher/StudyInformationForm";
import InformedConsentForm from "../Dashboard/ProtocolType/ContractorResearcher/InformedConsentForm";
import ProtocolProceduresForm from "../Dashboard/ProtocolType/ContractorResearcher/ProtocolProceduresForm";
import SubmissionForm from "../Dashboard/ProtocolType/ContractorResearcher/SubmissionForm";
import { useLocation } from "react-router-dom";

const ContractorResearcherDetails = ({
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

  return (
    <Box sx={{ width: "100%" }}>
      {/* Title Section */}
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          textAlign: { xs: "center", sm: "center", md: "left" },
          fontSize: { xs: "1.5rem", sm: "1.5rem", md: "2rem" },
          padding: { xs: "0 8px", sm: "0 24px", md: "0 24px" },
        }}
      >
        {protocolTypeDetails.researchType}&nbsp;(
        {protocolTypeDetails.protocolId})
      </Typography>

      {/* Button Tabs (Horizontal on larger screens, stacked on smaller screens) */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "#3f51b5",
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
            sx={{
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderBottom: 0, // No bottom border by default
              "&:hover": {
                borderBottom: "none", // Ensures no bottom border on hover
                backgroundColor:
                  value === index
                    ? "primary.dark"
                    : "linear-gradient(45deg, #4f5db3, #0094c4)",
              },
              backgroundColor: value === index ? "primary.main" : "transparent",
              backgroundImage:
                value === index
                  ? "none"
                  : "linear-gradient(45deg, #6e7dff, #00c6ff)",
              color: value === index ? "white" : "white",
              flex: 1,
              minWidth: { xs: "100%", sm: "auto" }, // Full width on small screens
              letterSpacing: 0,
            }}
          >
            {
              [
                "Protocol Information",
                "Investigator Information",
                "Study Type",
                "Informed Consent",
                "Protocol Procedures",
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
        <StudyInformationForm
          protocolTypeDetails={protocolTypeDetails}
          studyInformation={protocolDetailsByIdState?.study_information}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <InformedConsentForm
          protocolTypeDetails={protocolTypeDetails}
          informedConsent={protocolDetailsByIdState?.informed_consent}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <ProtocolProceduresForm
          protocolTypeDetails={protocolTypeDetails}
          protocolProcedure={protocolDetailsByIdState?.protocol_procedure}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <SubmissionForm
          protocolTypeDetails={protocolTypeDetails}
          protocolDetailsById={protocolDetailsByIdState}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
    </Box>
  );
};

export default ContractorResearcherDetails;
