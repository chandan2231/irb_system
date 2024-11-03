import * as React from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ProtocolInformationForm from '../Dashboard/ProtocolType/ContractorResearcher/ProtocolInformationForm'
import InvestigatorInformationForm from '../Dashboard/ProtocolType/ContractorResearcher/InvestigatorInformationForm'
import StudyInformationForm from '../Dashboard/ProtocolType/ContractorResearcher/StudyInformationForm'
import InformedConsentForm from '../Dashboard/ProtocolType/ContractorResearcher/InformedConsentForm'
import ProtocolProceduresForm from '../Dashboard/ProtocolType/ContractorResearcher/ProtocolProceduresForm'
import SubmissionForm from '../Dashboard/ProtocolType/ContractorResearcher/SubmissionForm'
import { useLocation } from 'react-router-dom'

const ContractorResearcherDetails = ({
  protocolTypeDetails,
  protocolDetailsById
}) => {
  const [protocolDetailsByIdState, setProtocolDetailsByIdState] =
    React.useState(protocolDetailsById)

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
  // console.log('location', location)
  const [value, setValue] = React.useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  React.useEffect(() => {
    if (protocolDetailsById) {
      setProtocolDetailsByIdState(protocolDetailsById)
    }
  }, [protocolDetailsById])

  console.log('protocolTypeDetails', {
    protocolTypeDetails,
    protocolDetailsById,
    protocolDetailsByIdState
  })

  return (
    <Box sx={{ width: '100%' }}>
      <h2 className="ml-20">
        {protocolTypeDetails.researchType}&nbsp;(
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
          <Tab label="Protocol Information" {...a11yProps(0)} />
          <Tab label="Investigator Information" {...a11yProps(1)} />
          <Tab label="Study Type" {...a11yProps(2)} />
          <Tab label="Informed Consent" {...a11yProps(3)} />
          <Tab label="Protocol Procedures" {...a11yProps(4)} />
          <Tab label="Submission" {...a11yProps(5)} />
        </Tabs>
      </Box>
      {/* here client */}
      <CustomTabPanel value={value} index={0}>
        <ProtocolInformationForm
          protocolTypeDetails={protocolTypeDetails}
          protocolInformation={protocolDetailsByIdState?.protocol_information}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <InvestigatorInformationForm
          protocolTypeDetails={protocolTypeDetails}
          investigatorInformation={
            protocolDetailsByIdState?.investigator_information
          }
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <StudyInformationForm
          protocolTypeDetails={protocolTypeDetails}
          studyInformation={protocolDetailsByIdState?.study_information}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <InformedConsentForm
          protocolTypeDetails={protocolTypeDetails}
          informedConsent={protocolDetailsByIdState?.informed_consent}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <ProtocolProceduresForm
          protocolTypeDetails={protocolTypeDetails}
          protocolProcedure={protocolDetailsByIdState?.protocol_procedure}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <SubmissionForm
          protocolTypeDetails={protocolTypeDetails}
          protocolDetailsById={protocolDetailsByIdState}
        />
      </CustomTabPanel>
    </Box>
  )
}

export default ContractorResearcherDetails
