import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import InvestigatorInformationForm from '../ProtocolList/AdminProtocolType/ClinicalResearcher/InvestigatorInformationForm'
import InformedConsentForm from '../ProtocolList/AdminProtocolType/ClinicalResearcher/InformedConsentForm'
import SubmissionForm from '../ProtocolList/AdminProtocolType/ClinicalResearcher/SubmissionForm'
import { useLocation } from 'react-router-dom'

const ClinicalResearcherDetails = ({
  protocolTypeDetails,
  protocolDetailsById
}) => {
  const [value, setValue] = React.useState(0)

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props
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
    )
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    }
  }

  const location = useLocation()
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  // console.log('protocolDetailsById', protocolDetailsById)

  return (
    <Box sx={{ width: '100%' }}>
      <h2 className="ml-20">
        {protocolTypeDetails.researchType} Details(
        {protocolTypeDetails.protocolId})
      </h2>
      <Box className="ml-20" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label="Investigator and Protocol Information"
            {...a11yProps(0)}
          />
          <Tab
            label="Informed Consent Document Information"
            {...a11yProps(1)}
          />
          <Tab label="Submission" {...a11yProps(5)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <InvestigatorInformationForm
          protocolTypeDetails={protocolTypeDetails}
          investicatorProtocolInformation={
            protocolDetailsById?.investigator_protocol_information
          }
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <InformedConsentForm
          protocolTypeDetails={protocolTypeDetails}
          consentInformation={protocolDetailsById?.consent_information}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <SubmissionForm protocolTypeDetails={protocolTypeDetails} />
      </CustomTabPanel>
    </Box>
  )
}

export default ClinicalResearcherDetails
