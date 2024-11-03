import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import Checkbox from '@mui/material/Checkbox'
import { useDispatch, useSelector } from 'react-redux'
import {
  createClinicalSiteSubmission,
  getClinicalSiteSavedProtocolType
} from '../../../../services/ProtocolType/ContractorResearcherService'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ListSubheader from '@mui/material/ListSubheader'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import StarBorder from '@mui/icons-material/StarBorder'

function SubmissionForm({ protocolTypeDetails, protocolDetailsById }) {
  const dispatch = useDispatch()
  const userDetails = JSON.parse(localStorage.getItem('user'))
  const [termsSelected, setTermsSelected] = React.useState(false)
  const [formData, setFormData] = useState({
    protocol_id: protocolTypeDetails.protocolId,
    protocol_type: protocolTypeDetails.researchType,
    created_by: userDetails.id
  })

  const notSavedForm = []

  const getAllMultiSiteSavedProtocolType = Object.keys(protocolDetailsById).map(
    (key) => {
      const value = protocolDetailsById[key]
      const valueKeys = Object.keys(value)
      const isDocumentIncluded = valueKeys.includes('documents')
      return {
        form: key,
        filled: valueKeys.length - (isDocumentIncluded ? 1 : 0) !== 0,
        length: valueKeys.length,
        filledLength: valueKeys.length - (isDocumentIncluded ? 1 : 0)
      }
    }
  )

  getAllMultiSiteSavedProtocolType &&
    getAllMultiSiteSavedProtocolType.map((formList) => {
      if (formList.filled === false) {
        notSavedForm.push(formList.form)
      }
    })

  const handleFinalSubmissionTearmChecked = (event) => {
    const { checked } = event.target
    if (checked === true) {
      setTermsSelected(true)
    } else if (checked === false) {
      setTermsSelected(false)
    }
  }

  const handleSubmitData = async (e) => {
    e.preventDefault()
    try {
      console.log('notSavedForm', notSavedForm)
      if (notSavedForm.length > 0) {
        toast.error(
          'Befor final submission you have to fill protocol information',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark'
          }
        )
      } else if (notSavedForm.length <= 0) {
        const isValid = true
        if (isValid === true) {
          dispatch(createClinicalSiteSubmission({ ...formData })).then(
            (data) => {
              if (data.payload.status === 200) {
                toast.success(data.payload.data.msg, {
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: 'dark'
                })
                setFormData({})
              }
            }
          )
        }
      }
    } catch (error) { }
  }

  const titleCase = (str) => {
    var splitStr = str.toLowerCase().split(' ')
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1)
    }
    return splitStr.join(' ')
  }

  console.log('submissionFormData', {
    protocolDetailsById,
    formData,
    getAllMultiSiteSavedProtocolType
  })

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Row>
        {notSavedForm.length > 0 && (
          <List
            sx={{ width: '100%', maxWidth: '50%', bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                style={{ fontSize: '18px', color: 'red' }}
              >
                Befor final submission you have to fill the below forms
              </ListSubheader>
            }
          >
            {notSavedForm.map((showForm) => {
              return (
                <ListItemButton>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText
                    primary={titleCase(showForm.replaceAll('_', ' '))}
                  />
                </ListItemButton>
              )
            })}
          </List>
        )}
        <form onSubmit={handleSubmitData}>
          <Form.Group
            as={Col}
            controlId="validationFormik01"
            className="ul-list"
          >
            <p>By submitting this application you attest to the following:</p>
            <ul>
              <li>
                Research will not commence prior to receiving the IRB approval
                letter.
              </li>
              <li>
                The principal investigator will personally supervise and/or
                conduct the study.
              </li>
              <li>
                The principal investigator ensures that all persons involved in
                conducting the study are trained and have proper credentialing
                for conducting research.
              </li>
              <li>
                Only the most current IRB-approved consent form will be used to
                enroll subjects.
              </li>
              <li>
                No changes will be made to the research protocol, consents
                forms, and all patient-facing materials without the approval of
                the IRB{' '}
              </li>
              <li>
                The study procedures will comply with all applicable laws and
                regulations regarding the conduct of research
              </li>
              <li>
                All findings from the study that directly affect subject safety
                will be communicated to subjects and to this IRB
              </li>
              <li>
                All serious adverse events (SAEs), whether related to the study
                procedures or not, will be reported to this IRB within 2
                business days of the investigator becoming aware of the event
                for IRB safety review
              </li>
              <li>
                The sponsor agrees to submit and provide payment to this IRB for
                annual review yearly
              </li>
            </ul>
          </Form.Group>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
              <FormGroup
                onChange={(event) => handleFinalSubmissionTearmChecked(event)}
              >
                <FormControlLabel
                  control={<Checkbox />}
                  label="Your initials below signify that you have read and agree to the terms listed above"
                />
              </FormGroup>
            </FormControl>
          </Form.Group>
          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
            style={{ textAlign: 'right' }}
          >
            <Button
              variant="contained"
              color="primary"
              type="Submit"
              disabled={!termsSelected}
            >
              SUBMIT
            </Button>
          </Form.Group>
        </form>
      </Row>
    </>
  )
}

export default SubmissionForm
