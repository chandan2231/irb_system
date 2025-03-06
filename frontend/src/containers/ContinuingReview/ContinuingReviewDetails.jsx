import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, Typography, Button } from "@mui/material";
import InformedConsentProcess from "../ContinuingReview/ContinuingReviewPages/InformedConsentProcess";
import InvestigatorInstitutionInfo from "../ContinuingReview/ContinuingReviewPages/InvestigatorInstitutionInfo";
import ResearchProgress from "../ContinuingReview/ContinuingReviewPages/ResearchProgress";
import RiskAssessment from "../ContinuingReview/ContinuingReviewPages/RiskAssessment";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchContinuinReviewDetailsById } from "../../services/Admin/ContinuinReviewListService";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

const ContinuingReviewDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const continuinReviewDetails = location.state.details;
  const [user, setUser] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [apiCallIdentifier, setApiCallIdentifier] = React.useState(false);

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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (userDetails) {
      setUser(userDetails);
    }
  }, []);

  React.useEffect(() => {
    let data = {
      protocolId: continuinReviewDetails?.protocolId,
      protocolType: continuinReviewDetails?.researchType,
    };
    dispatch(fetchContinuinReviewDetailsById(data));
  }, [dispatch, user.id]);

  const { continuinReviewDetailsById, loading, error } = useSelector(
    (state) => ({
      error: state.continuinReview.error,
      continuinReviewDetailsById:
        state.continuinReview.continuinReviewDetailsById,
      loading: state.continuinReview.loading,
    })
  );

  const handleButtonClick = (index) => {
    setValue(index);
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
        Continuin Review Details&nbsp;({continuinReviewDetails.researchType}) (
        {continuinReviewDetails.protocolId})
      </Typography>
      {/* Button Tabs (Horizontal on larger screens, stacked on smaller screens) */}
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
                "Risk Assessment",
                "Informed Consent Process",
                "Investigator and Institution Info",
                "Research Progress",
              ][index]
            }
          </Button>
        ))}
      </Box>

      <CustomTabPanel value={value} index={0}>
        <RiskAssessment
          continuinReviewDetails={continuinReviewDetails}
          riskAssessment={continuinReviewDetailsById?.risk_assessment}
          apiCallIdentifier={apiCallIdentifier}
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <InformedConsentProcess
          continuinReviewDetails={continuinReviewDetails}
          apiCallIdentifier={apiCallIdentifier}
          informedConsentProcess={
            continuinReviewDetailsById?.informed_consent_process
          }
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <InvestigatorInstitutionInfo
          continuinReviewDetails={continuinReviewDetails}
          apiCallIdentifier={apiCallIdentifier}
          investigatorInstitutionInfo={
            continuinReviewDetailsById?.investigator_instuation_info
          }
          handleNextTab={handleButtonClick}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ResearchProgress
          continuinReviewDetails={continuinReviewDetails}
          apiCallIdentifier={apiCallIdentifier}
          researchProgress={continuinReviewDetailsById?.research_progress_info}
        />
      </CustomTabPanel>
    </Box>
  );
};

export default ContinuingReviewDetails;
