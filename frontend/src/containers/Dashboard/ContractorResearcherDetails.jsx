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
      <h2 className="ml-20">
        {protocolTypeDetails.researchType}&nbsp;(
        {protocolTypeDetails.protocolId})
      </h2>

      {/* Buttons as tabs with icons */}
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
