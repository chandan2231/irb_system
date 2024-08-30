
    import * as React from 'react';
    import PropTypes from 'prop-types';
    import Tabs from '@mui/material/Tabs';
    import Tab from '@mui/material/Tab';
    import Typography from '@mui/material/Typography';
    import Box from '@mui/material/Box';
    import InformedConsentProcess from '../ContinuinReviewList/AdminContinuingReviewPages/InformedConsentProcess'
    import InvestigatorInstitutionInfo from '../ContinuinReviewList/AdminContinuingReviewPages/InvestigatorInstitutionInfo'
    import ResearchProgress from '../ContinuinReviewList/AdminContinuingReviewPages/ResearchProgress'
    import RiskAssessment from '../ContinuinReviewList/AdminContinuingReviewPages/RiskAssessment'
    import { useLocation } from "react-router-dom";
    import { fetchContinuinReviewDetailsById } from "../../../services/Admin/ContinuinReviewListService";
    import { useDispatch, useSelector } from "react-redux";
    import { useState, useEffect } from "react";

    const AdminContinuingReviewDetails = () => {
        const dispatch = useDispatch();
        const location = useLocation();
        const continuinReviewDetails = location.state.details
        const [value, setValue] = useState(0);
        const [user, setUser] = useState([]);
        useEffect(() => {
            const userDetails = JSON.parse(localStorage.getItem('user'));
            if (userDetails) {
                setUser(userDetails);
            }
        }, []);
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

        const handleChange = (event, newValue) => {
            setValue(newValue);
        };

        const { continuinReviewDetailsById, loading, error } = useSelector(
            state => ({
                error: state.admin.error,
                continuinReviewDetailsById: state.admin.continuinReviewDetailsById,
                loading: state.admin.loading,
            })
        );

        useEffect(() => {
            let data = {protocolId: continuinReviewDetails.protocolId}
            dispatch(fetchContinuinReviewDetailsById(data));
        }, [dispatch, user.id]);

        //console.log('continuinReviewDetailsById', continuinReviewDetailsById)

        return (
            <Box sx={{ width: '100%' }}>
            <h2 className='ml-20'>Continuin Review Details ({continuinReviewDetails.protocolId})</h2>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable" scrollButtons="auto">
                <Tab label="Risk Assessment" {...a11yProps(0)} style={{maxWidth: '400px'}} />
                <Tab label="Informed Consent Process" {...a11yProps(1)} style={{maxWidth: '400px'}} />
                <Tab label="Investigator and Institution Information" {...a11yProps(2)} style={{maxWidth: '400px'}} />
                <Tab label="Research Progress" {...a11yProps(3)} style={{maxWidth: '400px'}} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <RiskAssessment continuinReviewDetails={continuinReviewDetails} riskAssessmentDetails = {continuinReviewDetailsById?.risk_assessment} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <InformedConsentProcess continuinReviewDetails={continuinReviewDetails} informedConsentProcessDetails = {continuinReviewDetailsById?.informed_consent_process} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <InvestigatorInstitutionInfo  continuinReviewDetails={continuinReviewDetails} investigatorInstitutionInfoDetails = {continuinReviewDetailsById?.investigator_instuation_info} />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
                <ResearchProgress continuinReviewDetails={continuinReviewDetails} researchProgressDetails = {continuinReviewDetailsById?.research_progress_info} />
            </CustomTabPanel>
            </Box>
        )
    }

    export default AdminContinuingReviewDetails