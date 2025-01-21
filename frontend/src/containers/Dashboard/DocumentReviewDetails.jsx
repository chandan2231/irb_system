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
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, // Adjust font size for responsiveness
        }}
      >
        {protocolTypeDetails.researchType}&nbsp;(
        {protocolTypeDetails.protocolId})
      </Typography>

      {/* Buttons as tabs with icons */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap", // Stack buttons on smaller screens
          justifyContent: "space-between",
          gap: 2,
          borderColor: "divider",
          padding: { xs: "0 8px", sm: "0 24px" }, // Adjust padding on smaller screens
        }}
      >
        {/* Button for Protocol Information */}
        <Button
          endIcon={<DoubleArrowIcon />}
          variant={value === 0 ? "contained" : "text"}
          onClick={() => handleButtonClick(0)}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            backgroundColor: value === 0 ? "primary.main" : "transparent",
            backgroundImage:
              value === 0 ? "none" : "linear-gradient(45deg, #6e7dff, #00c6ff)",
            color: value === 0 ? "white" : "white",
            "&:hover": {
              backgroundColor:
                value === 0
                  ? "primary.dark"
                  : "linear-gradient(45deg, #4f5db3, #0094c4)",
            },
            flex: 1,
            minWidth: { xs: "100%", sm: "auto" }, // Full width on small screens
            marginBottom: { xs: "10px", sm: "0px" }, // Adjust margin for small screens
          }}
        >
          Protocol Information
        </Button>

        {/* Button for Investigator Information */}
        <Button
          endIcon={<DoubleArrowIcon />}
          variant={value === 1 ? "contained" : "text"}
          onClick={() => handleButtonClick(1)}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            backgroundColor: value === 1 ? "primary.main" : "transparent",
            backgroundImage:
              value === 1 ? "none" : "linear-gradient(45deg, #6e7dff, #00c6ff)",
            color: value === 1 ? "white" : "white",
            "&:hover": {
              backgroundColor:
                value === 1
                  ? "primary.dark"
                  : "linear-gradient(45deg, #4f5db3, #0094c4)",
            },
            flex: 1,
            minWidth: { xs: "100%", sm: "auto" },
            marginBottom: { xs: "10px", sm: "0px" },
          }}
        >
          Investigator Information
        </Button>

        {/* Button for Document Review */}
        <Button
          endIcon={<DoubleArrowIcon />}
          variant={value === 2 ? "contained" : "text"}
          onClick={() => handleButtonClick(2)}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            backgroundColor: value === 2 ? "primary.main" : "transparent",
            backgroundImage:
              value === 2 ? "none" : "linear-gradient(45deg, #6e7dff, #00c6ff)",
            color: value === 2 ? "white" : "white",
            "&:hover": {
              backgroundColor:
                value === 2
                  ? "primary.dark"
                  : "linear-gradient(45deg, #4f5db3, #0094c4)",
            },
            flex: 1,
            minWidth: { xs: "100%", sm: "auto" },
            marginBottom: { xs: "10px", sm: "0px" },
          }}
        >
          Document Review
        </Button>

        {/* Button for Submission */}
        <Button
          variant={value === 3 ? "contained" : "text"}
          onClick={() => handleButtonClick(3)}
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            backgroundColor: value === 3 ? "primary.main" : "transparent",
            backgroundImage:
              value === 3 ? "none" : "linear-gradient(45deg, #6e7dff, #00c6ff)",
            color: value === 3 ? "white" : "white",
            "&:hover": {
              backgroundColor:
                value === 3
                  ? "primary.dark"
                  : "linear-gradient(45deg, #4f5db3, #0094c4)",
            },
            flex: 1,
            minWidth: { xs: "100%", sm: "auto" },
            marginBottom: { xs: "10px", sm: "0px" },
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
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
    </Box>
  );
};

export default DocumentReviewDetails;
