import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InformedConsentProcess from "../ContinuingReview/ContinuingReviewPages/InformedConsentProcess";
import InvestigatorInstitutionInfo from "../ContinuingReview/ContinuingReviewPages/InvestigatorInstitutionInfo";
import ResearchProgress from "../ContinuingReview/ContinuingReviewPages/ResearchProgress";
import RiskAssessment from "../ContinuingReview/ContinuingReviewPages/RiskAssessment";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchContinuinReviewDetailsById } from "../../services/Admin/ContinuinReviewListService";

const ContinuingReviewDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const continuinReviewDetails = location.state.details;
  const [user, setUser] = React.useState([]);
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

  const [value, setValue] = React.useState(0);
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

  console.log("continuinReviewDetails", {
    continuinReviewDetails,
    continuinReviewDetailsById,
  });

  return (
    <Box sx={{ width: "100%" }}>
      <h2 className="ml-20">
        Continuin Review ({continuinReviewDetails.protocolId})
      </h2>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label="Risk Assessment"
            {...a11yProps(0)}
            style={{ maxWidth: "400px" }}
          />
          <Tab
            label="Informed Consent Process"
            {...a11yProps(1)}
            style={{ maxWidth: "400px" }}
          />
          <Tab
            label="Investigator and Institution Information"
            {...a11yProps(2)}
            style={{ maxWidth: "400px" }}
          />
          <Tab
            label="Research Progress"
            {...a11yProps(3)}
            style={{ maxWidth: "400px" }}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <RiskAssessment
          continuinReviewDetails={continuinReviewDetails}
          riskAssessment={continuinReviewDetailsById?.risk_assessment}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <InformedConsentProcess
          continuinReviewDetails={continuinReviewDetails}
          informedConsentProcess={
            continuinReviewDetailsById?.informed_consent_process
          }
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <InvestigatorInstitutionInfo
          continuinReviewDetails={continuinReviewDetails}
          investigatorInstitutionInfo={
            continuinReviewDetailsById?.investigator_instuation_info
          }
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ResearchProgress
          continuinReviewDetails={continuinReviewDetails}
          researchProgress={continuinReviewDetailsById?.research_progress_info}
        />
      </CustomTabPanel>
    </Box>
  );
};

export default ContinuingReviewDetails;
