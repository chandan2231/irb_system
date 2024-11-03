import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import { Box, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'

const completedTraining = [
  { label: 'OHRP Human Subject Assurance Training', value: '1' },
  { label: 'CITI Program Training', value: '2' },
  { label: 'Certified Physician Investigator Training', value: '3' },
  { label: 'ACRP training (CCRC, CCRA)', value: '4' },
  { label: 'SOCRA (CCRP)', value: '5' },
  {
    label: 'Graduate or undergraduate research studies or degrees',
    value: '6'
  },
  { label: 'Academy of Physicians in Clinical Research', value: '7' },
  { label: 'Other', value: '8' }
]

function InvestigatorInformationForm({
  protocolTypeDetails,
  investicatorProtocolInformation
}) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userDetails = JSON.parse(localStorage.getItem('user'))
  const [formData, setFormData] = useState({
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmitData = async (e) => {
    e.preventDefault()
    try {
      const getValidatedform = await investigatorAndProtocolInfoSchema.validate(
        formData,
        { abortEarly: false }
      )
      const isValid =
        await investigatorAndProtocolInfoSchema.isValid(getValidatedform)
      console.log('formData', formData)
      console.log('isValid', isValid)
      if (isValid === true) {
        dispatch(createInvestigatorAndProtocolInformation(formData)).then(
          (data) => {
            if (data.payload.status === 200) {
            } else {
            }
          }
        )
      }
    } catch (error) {
      const newErrors = {}
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message
      })
      setErrors(newErrors)
    }
  }
  console.log(
    'investicatorProtocolInformation',
    investicatorProtocolInformation
  )
  const trainingCompletedArr =
    investicatorProtocolInformation?.training_completed?.split(',')
  return (
    <Row>
      <form onSubmit={handleSubmitData}>
        <Form.Group
          as={Col}
          controlId="validationFormik06"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="Investigator Name "
              id="investigator_name"
              name="investigator_name"
              value={investicatorProtocolInformation?.investigator_name}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="Investigator Email "
              id="investigator_email"
              name="investigator_email"
              value={investicatorProtocolInformation?.investigator_email}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="Sub-Investigator Name"
              id="sub_investigator_name"
              name="sub_investigator_name"
              value={investicatorProtocolInformation?.sub_investigator_name}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="Sub-Investigator Email"
              id="sub_investigator_email"
              name="sub_investigator_email"
              value={investicatorProtocolInformation?.sub_investigator_email}
            />
          </Box>
        </Form.Group>

        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="Additional Study personnel name"
              id="additional_study_name"
              name="additional_study_name"
              value={investicatorProtocolInformation?.additional_study_name}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="Additional Study personnel email address"
              id="additional_study_email"
              name="additional_study_email"
              value={investicatorProtocolInformation?.additional_study_email}
            />
          </Box>
        </Form.Group>
        <h3>Investigational/Research Location:</h3>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="Name of site "
              id="site_name"
              name="site_name"
              value={investicatorProtocolInformation?.site_name}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="Address of site "
              id="site_address"
              name="site_address"
              value={investicatorProtocolInformation?.site_address}
            />
          </Box>
        </Form.Group>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Do you have more than one site where research will be conducted?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="more_site"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={investicatorProtocolInformation?.more_site === 'Yes'}
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={investicatorProtocolInformation?.more_site === 'No'}
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investicatorProtocolInformation?.more_site === 'Yes' && (
          <Form.Group
            as={Col}
            controlId="validationFormik07"
            className="mt-mb-20"
          >
            <Box sx={{ width: '100%', maxWidth: '100%' }}>
              <TextField
                fullWidth
                label="Name and address of site "
                id="site_name_address"
                name="site_name_address"
                value={investicatorProtocolInformation?.site_name_address}
              />
            </Box>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="Full protocol title "
              id="protocol_title"
              name="protocol_title"
              value={investicatorProtocolInformation?.protocol_title}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="Protocol Number "
              id="protocol_number"
              name="protocol_number"
              value={investicatorProtocolInformation?.protocol_number}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik03"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="Your initials below confirm that your site will only enroll subjects that meet criteria for inclusion in the study "
              name="study_criteria"
              id="study_criteria"
              value={investicatorProtocolInformation?.study_criteria}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik03"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="How many subjects do you expect to enroll at your site(s) "
              name="subject_number"
              id="subject_number"
              value={investicatorProtocolInformation?.subject_number}
            />
          </Box>
        </Form.Group>

        <Form.Group
          as={Col}
          controlId="validationFormik03"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="What is your site number assigned by the sponsor"
              name="site_number"
              id="site_number"
              value={investicatorProtocolInformation?.site_number}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik02"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              {' '}
              Has this study been disapproved or withdrawn from another IRB?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="disapproved_or_withdrawn"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investicatorProtocolInformation?.disapproved_or_withdrawn ===
                  'Yes'
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investicatorProtocolInformation?.disapproved_or_withdrawn ===
                  'No'
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investicatorProtocolInformation?.disapproved_or_withdrawn ===
          'Yes' && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {
                investicatorProtocolInformation?.disapproved_or_withdrawn_explain
              }
            </p>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik04"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              {' '}
              Are you transferring oversight from another IRB?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="oversite"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={investicatorProtocolInformation?.oversite === 'Yes'}
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={investicatorProtocolInformation?.oversite === 'No'}
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investicatorProtocolInformation?.oversite === 'Yes' && (
          <Form.Group
            as={Col}
            controlId="validationFormik05"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {investicatorProtocolInformation?.oversite_explain}
            </p>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik04"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Have any individuals or immediate family members at this site
              received compensation from the sponsor of this study in the past
              12 months that amounts to $5,000 or greater?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="immediate_family"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investicatorProtocolInformation?.immediate_family === 'Yes'
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investicatorProtocolInformation?.immediate_family === 'No'
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investicatorProtocolInformation?.immediate_family === 'Yes' && (
          <Form.Group
            as={Col}
            controlId="validationFormik05"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Please explain the compensation in great detail including amount
              received, services rendered, and name and title or relationship of
              the individual with the conflict
            </FormLabel>
            <p className="explain_text">
              {investicatorProtocolInformation?.immediate_family_explain}
            </p>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik04"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Do any individuals or immediate family members at this site own
              interest in the form of stock or other ownership in the sponsor
              company of this study in the last 12 months that amounts to $5,000
              or greater?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="stock_ownership"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investicatorProtocolInformation?.stock_ownership === 'Yes'
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investicatorProtocolInformation?.stock_ownership === 'No'
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investicatorProtocolInformation?.stock_ownership === 'Yes' && (
          <Form.Group
            as={Col}
            controlId="validationFormik05"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Please describe the monetary interest in detail including the
              estimated value, percentage of ownership, and name and role of the
              individual
            </FormLabel>
            <p className="explain_text">
              {investicatorProtocolInformation?.stock_ownership_explain}
            </p>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik04"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Do any individuals at this site have proprietary interests being
              investigated in this study such as, but not limited to, patents,
              investigational products, or licensing agreements?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="property_interest"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investicatorProtocolInformation?.property_interest === 'Yes'
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investicatorProtocolInformation?.property_interest === 'No'
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investicatorProtocolInformation?.property_interest === 'Yes' && (
          <Form.Group
            as={Col}
            controlId="validationFormik05"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Please describe the interest in detail including the estimated
              value, ownership, patent information/investigational product
              information (if applicable), and name and role of the individual
            </FormLabel>
            <p className="explain_text">
              {investicatorProtocolInformation?.property_interest_explain}
            </p>
          </Form.Group>
        )}

        <Form.Group
          as={Col}
          controlId="validationFormik04"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Do any individuals at this site have a financial agreement with
              the sponsor for which they will receive compensation that is
              linked to the outcome of the study?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="financial_agreement"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investicatorProtocolInformation?.financial_agreement === 'Yes'
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investicatorProtocolInformation?.financial_agreement === 'No'
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investicatorProtocolInformation?.financial_agreement === 'Yes' && (
          <Form.Group
            as={Col}
            controlId="validationFormik05"
            className="mt-mb-20"
          >
            <Box sx={{ width: '100%', maxWidth: '100%' }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Please describe the interest in detail including the estimated
                value, ownership, patent information/investigational product
                information (if applicable), and name and role of the individual
              </FormLabel>
              <p className="explain_text">
                {investicatorProtocolInformation?.financial_agreement_explain}
              </p>
            </Box>
          </Form.Group>
        )}

        <Form.Group
          as={Col}
          controlId="validationFormik04"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Do any individuals at this site serve in any executive position or
              on a board of directors for the sponsor of this study?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="server_position"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investicatorProtocolInformation?.server_position === 'Yes'
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investicatorProtocolInformation?.server_position === 'No'
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investicatorProtocolInformation?.server_position === 'Yes' && (
          <Form.Group
            as={Col}
            controlId="validationFormik05"
            className="mt-mb-20"
          >
            <Box sx={{ width: '100%', maxWidth: '100%' }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Please describe the position in detail including the estimated
                value of compensation, types of services rendered, duration that
                the individual has served in this capacity and name and role of
                the individual{' '}
              </FormLabel>
              <p className="explain_text">
                {investicatorProtocolInformation?.server_position_explain}
              </p>
            </Box>
            {errors.server_position_explain && (
              <div className="error">{errors.server_position_explain}</div>
            )}
          </Form.Group>
        )}

        <Form.Group
          as={Col}
          controlId="validationFormik04"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Do any individuals at this site have any interests that may
              influence the conduct, outcome, or safety of this study?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="influence_conduct"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investicatorProtocolInformation?.influence_conduct === 'Yes'
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investicatorProtocolInformation?.stock_ownership === 'No'
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investicatorProtocolInformation?.influence_conduct === 'Yes' && (
          <Form.Group
            as={Col}
            controlId="validationFormik05"
            className="mt-mb-20"
          >
            <Box sx={{ width: '100%', maxWidth: '100%' }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Please describe the interest in detail including the potential
                conflicts and how they may interfere with the study, and name
                and role of the individual{' '}
              </FormLabel>
              <p className="explain_text">
                {investicatorProtocolInformation?.influence_conduct_explain}
              </p>
            </Box>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik04"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Is there a Conflict of Interest Committee that has made any
              determinations related to the potential conflicts and is there a
              management plan in place?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="interest_conflict"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investicatorProtocolInformation?.interest_conflict === 'Yes'
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investicatorProtocolInformation?.interest_conflict === 'No'
                }
              />
              <FormControlLabel
                value="N/A"
                control={<Radio />}
                label="N/A"
                checked={
                  investicatorProtocolInformation?.interest_conflict === 'N/A'
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investicatorProtocolInformation?.interest_conflict === 'Yes' && (
          <Form.Group
            as={Col}
            controlId="validationFormik05"
            className="mt-mb-20"
          >
            <Box sx={{ width: '100%', maxWidth: '100%' }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Please describe the COI committee findings in detail including
                the name of the COI committee, the determinations, and describe
                the management plan{' '}
              </FormLabel>
              <p className="explain_text">
                {investicatorProtocolInformation?.interest_conflict_explain}
              </p>
            </Box>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik04"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Has the investigator ever had an FDA audit?{' '}
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="fda_audit"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={investicatorProtocolInformation?.fda_audit === 'Yes'}
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={investicatorProtocolInformation?.fda_audit === 'No'}
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investicatorProtocolInformation?.fda_audit === 'Yes' && (
          <Form.Group
            as={Col}
            controlId="validationFormik05"
            className="mt-mb-20"
          >
            <Box sx={{ width: '100%', maxWidth: '100%' }}>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Explain
              </FormLabel>
              <p className="explain_text">
                {investicatorProtocolInformation?.fda_audit_explain}
              </p>
            </Box>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik01"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              How long has the investigator been involved in research?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="involved_years"
            >
              <FormControlLabel
                value="New to research-1 year"
                control={<Radio />}
                label="New to research-&lt;1 year"
                checked={
                  investicatorProtocolInformation?.involved_years ===
                  'New to research-1 year'
                }
              />
              <FormControlLabel
                value="1-5 years"
                control={<Radio />}
                label="1-5 years"
                checked={
                  investicatorProtocolInformation?.involved_years ===
                  '1-5 years'
                }
              />
              <FormControlLabel
                value="6 years or more"
                control={<Radio />}
                label="6 years or more"
                checked={
                  investicatorProtocolInformation?.involved_years ===
                  '6 years or more'
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>

        <Form.Group
          as={Col}
          controlId="validationFormik08"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="What is the investigator's NPI if applicable"
              id="investigators_npi"
              name="investigators_npi"
              value={investicatorProtocolInformation?.investigators_npi}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik01"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              What training in the field of human subjects protection has the
              investigator completed?
            </FormLabel>
            {completedTraining.map((trainingList, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  label={trainingList.label}
                  value={trainingList.value}
                  checked={trainingCompletedArr?.find(
                    (id) => Number(id) === Number(trainingList.value)
                  )}
                />
              )
            })}
          </FormControl>
        </Form.Group>
        {trainingCompletedArr?.includes('8') && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {investicatorProtocolInformation?.training_completed_explain}
            </p>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="What is the current number of research studies supervised by the investigator?"
              id="investigator_research_number"
              name="investigator_research_number"
              value={
                investicatorProtocolInformation?.investigator_research_number
              }
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik01"
          className="mt-mb-20"
        >
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Do you have any pending or active restrictions related to research
              or the practice of medicine?
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="pending_or_active_research"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={
                  investicatorProtocolInformation?.pending_or_active_research ===
                  'Yes'
                }
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={
                  investicatorProtocolInformation?.pending_or_active_research ===
                  'No'
                }
              />
            </RadioGroup>
          </FormControl>
        </Form.Group>
        {investicatorProtocolInformation?.pending_or_active_research ===
          'Yes' && (
          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <FormLabel id="demo-row-radio-buttons-group-label">
              Explain
            </FormLabel>
            <p className="explain_text">
              {
                investicatorProtocolInformation?.pending_or_active_research_explain
              }
            </p>
          </Form.Group>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <InputLabel id="demo-simple-select-autowidth-label">
            Uploaded investigator and sub-investigator CV
          </InputLabel>
          {investicatorProtocolInformation?.documents?.length > 0 &&
            investicatorProtocolInformation?.documents?.map(
              (docList, index) => {
                if (docList.document_name === 'investigator_cv') {
                  return (
                    <div>
                      <a
                        href={docList.file_url}
                        target="_blank"
                        className="no_underline"
                      >
                        {docList.file_name}
                      </a>
                    </div>
                  )
                }
              }
            )}
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <InputLabel id="demo-simple-select-autowidth-label">
            Uploaded Copies of medical license{' '}
          </InputLabel>
          {investicatorProtocolInformation?.documents?.length > 0 &&
            investicatorProtocolInformation?.documents?.map(
              (docList, index) => {
                if (docList.document_name === 'medical_license') {
                  return (
                    <div>
                      <a
                        href={docList.file_url}
                        target="_blank"
                        className="no_underline"
                      >
                        {docList.file_name}
                      </a>
                    </div>
                  )
                }
              }
            )}
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
        >
          <InputLabel id="demo-simple-select-autowidth-label">
            Uploaded Copies of training certificates{' '}
          </InputLabel>
          {investicatorProtocolInformation?.documents?.length > 0 &&
            investicatorProtocolInformation?.documents?.map(
              (docList, index) => {
                if (docList.document_name === 'training_certificates') {
                  return (
                    <div>
                      <a
                        href={docList.file_url}
                        target="_blank"
                        className="no_underline"
                      >
                        {docList.file_name}
                      </a>
                    </div>
                  )
                }
              }
            )}
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik010"
          className="mt-mb-20"
          style={{ textAlign: 'right' }}
        >
          <Button variant="contained" color="primary" type="Submit" disabled>
            SAVE AND CONTINUE
          </Button>
        </Form.Group>
      </form>
    </Row>
  )
}

export default InvestigatorInformationForm
