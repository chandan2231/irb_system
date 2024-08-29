
import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProtocolInformationForm from '../ProtocolList/AdminProtocolType/MultiSiteSponsor/ProtocolInformationForm'
import ContactInformationForm from '../ProtocolList/AdminProtocolType/MultiSiteSponsor/ContactInformationForm'
import StudyInformationForm from '../ProtocolList/AdminProtocolType/MultiSiteSponsor/StudyInformationForm'
import InformedConsentForm from '../ProtocolList/AdminProtocolType/MultiSiteSponsor/InformedConsentForm'
import SubmissionForm from '../ProtocolList/AdminProtocolType/MultiSiteSponsor/SubmissionForm'
import ProtocolProceduresForm from '../ProtocolList/AdminProtocolType/MultiSiteSponsor/ProtocolProceduresForm'
import { useLocation } from "react-router-dom";

const MultiSiteSponsorDetails = ({protocolTypeDetails, protocolDetailsById}) => {
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
    const location = useLocation();
    console.log('location', location)
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Box sx={{ width: '100%' }}>
        <h2 className='ml-20'>{protocolTypeDetails.researchType} Details({protocolTypeDetails.protocolId})</h2>
        <Box className='ml-20' sx={{ borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable" scrollButtons="auto">
            <Tab label="Protocol Information" {...a11yProps(0)} />
            <Tab label="Contact Information" {...a11yProps(1)} />
            <Tab label="Study Type" {...a11yProps(2)} />
            <Tab label="Informed Consent" {...a11yProps(3)} />
            <Tab label="Protocol Procedures" {...a11yProps(4)} />
            <Tab label="Submission" {...a11yProps(5)} />
            </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
            <ProtocolInformationForm protocolTypeDetails={protocolTypeDetails} protocolInformation = {protocolDetailsById?.protocol_information} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
            <ContactInformationForm protocolTypeDetails={protocolTypeDetails} contactInformation = {protocolDetailsById?.contact_information} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
            <StudyInformationForm protocolTypeDetails={protocolTypeDetails} studyInformation = {protocolDetailsById?.study_information} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
            <InformedConsentForm protocolTypeDetails={protocolTypeDetails} informedConsent = {protocolDetailsById?.informed_consent} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={4}>
            <ProtocolProceduresForm protocolTypeDetails={protocolTypeDetails} protocolProcedures = {protocolDetailsById?.protocol_procedure} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={5}>
            <SubmissionForm protocolTypeDetails={protocolTypeDetails} />
        </CustomTabPanel>
        </Box>
    )
}

export default MultiSiteSponsorDetails