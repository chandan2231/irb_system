
    import * as React from 'react';
    import PropTypes from 'prop-types';
    import Tabs from '@mui/material/Tabs';
    import Tab from '@mui/material/Tab';
    import Typography from '@mui/material/Typography';
    import Box from '@mui/material/Box';
    import InformedConsentProcess from '../ContinuingReview/ContinuingReviewPages/InformedConsentProcess';
    import InvestigatorInstitutionInfo from '../ContinuingReview/ContinuingReviewPages/InvestigatorInstitutionInfo';
    import ResearchProgress from '../ContinuingReview/ContinuingReviewPages/ResearchProgress';
    import RiskAssessment from '../ContinuingReview/ContinuingReviewPages/RiskAssessment';
    import { useLocation } from "react-router-dom";

    const ContinuingReviewDetails = () => {
        const location = useLocation();
        const continuinReviewDetails = location.state.details
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
                'aria-controls': `simple-tabpanel-${index}`,
            };
        }

        const [value, setValue] = React.useState(0);
        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
        return (
            <Box sx={{ width: '100%' }}>
            <h2 className='ml-20'>Continuin Review ({continuinReviewDetails.protocolId})</h2>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable" scrollButtons="auto">
                <Tab label="Risk Assessment" {...a11yProps(0)} style={{maxWidth: '400px'}} />
                <Tab label="Informed Consent Process" {...a11yProps(1)} style={{maxWidth: '400px'}} />
                <Tab label="Investigator and Institution Information" {...a11yProps(2)} style={{maxWidth: '400px'}} />
                <Tab label="Research Progress" {...a11yProps(3)} style={{maxWidth: '400px'}} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <RiskAssessment continuinReviewDetails={continuinReviewDetails} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <InformedConsentProcess continuinReviewDetails={continuinReviewDetails} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <InvestigatorInstitutionInfo  continuinReviewDetails={continuinReviewDetails} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <ResearchProgress continuinReviewDetails={continuinReviewDetails} />
            </CustomTabPanel>
            </Box>
        )
    }

    export default ContinuingReviewDetails