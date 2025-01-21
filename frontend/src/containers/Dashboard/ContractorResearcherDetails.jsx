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
          textAlign: "center",
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
        }}
      >
        {protocolTypeDetails.researchType}&nbsp;(
        {protocolTypeDetails.protocolId})
      </Typography>

      {/* Button Tabs (Horizontal on larger screens, stacked on smaller screens) */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 2,
          borderColor: "divider",
          padding: { xs: "0 8px", sm: "0 24px" },
        }}
      >
        {[
          "Protocol Information",
          "Investigator Information",
          "Study Type",
          "Informed Consent",
          "Protocol Procedures",
          "Submission",
        ].map((label, index) => (
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
              minWidth: { xs: "100%", sm: "auto" },
              marginBottom: { xs: "10px", sm: "0px" },
            }}
          >
            {label}
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
