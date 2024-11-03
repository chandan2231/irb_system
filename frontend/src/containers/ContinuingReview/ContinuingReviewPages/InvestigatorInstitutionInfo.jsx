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
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import Checkbox from '@mui/material/Checkbox'
import * as yup from 'yup'
import { investigatorAndinstuationSave } from '../../../services/ContinuinReview/ContinuinReviewService'
import { Box, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { uploadFile } from '../../../services/UserManagement/UserService'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const investigatorInfoSchema = yup.object().shape({
  inv_sit_quali: yup.string().required('This is required'),
  inv_or_comp_explain: yup.string().when('inv_or_comp', {
    is: () => 'Yes',
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema
  }),
  changes_explain: yup.string().required('This is required'),
  changes_reported_explain: yup.string().when('changes_reported', {
    is: () => 'No',
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema
  }),
  facility_any_changes_explain: yup.string().when('facility_any_changes', {
    is: () => 'Yes',
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema
  }),
  changes_law_explain: yup.string().when('changes_law', {
    is: () => 'Yes',
    then: (schema) => schema.required('This is required'),
    otherwise: (schema) => schema
  })
})

function InvestigatorInstitutionInfo({
  continuinReviewDetails,
  investigatorInstitutionInfo
}) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userDetails = JSON.parse(localStorage.getItem('user'))
  const [showAdditionalSelectionList, setShowAdditionalSelectionList] =
    React.useState(false)
  const [showAdditionalQuestionInvOrComp, setShowAdditionalQuestionInvOrComp] =
    React.useState(false)
  const [
    showAdditionalQuestionFacilityChanges,
    setShowAdditionalQuestionFacilityChanges
  ] = React.useState(false)
  const [
    showAdditionalQuestionChangesReported,
    setShowAdditionalQuestionChangesReported
  ] = React.useState(false)
  const [
    showAdditionalQuestionFacilityAnyChanges,
    setShowAdditionalQuestionFacilityAnyChanges
  ] = React.useState(false)
  const [
    showAdditionalQuestionChangesLaw,
    setShowAdditionalQuestionChangesLaw
  ] = React.useState(false)
  const [otherQuestionSelection, setOtherQuestionSelection] = React.useState('')
  const [formData, setFormData] = useState({
    inv_sit_quali: '',
    investigator_changes: '',
    inv_or_comp: '',
    inv_or_comp_explain: '',
    facility_changes: '',
    facility_change_item: '',
    changes_explain: '',
    changes_reported: '',
    changes_reported_explain: '',
    facility_any_changes: '',
    facility_any_changes_explain: '',
    changes_law: '',
    changes_law_explain: '',
    protocol_id: continuinReviewDetails.protocolId,
    created_by: userDetails.id,
    q4_supporting_documents: [],
    q1_supporting_documents: [],
    q2_supporting_documents: [],
    q3_supporting_documents: []
  })
  const [errors, setErrors] = useState({})

  const handleRadioButtonInvSitQuali = (event, radio_name) => {
    if (radio_name === 'inv_sit_quali' && event.target.value === 'Yes') {
      setShowAdditionalSelectionList(true)
    } else if (radio_name === 'inv_sit_quali' && event.target.value === 'No') {
      setShowAdditionalSelectionList(false)
    }
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRadioButtonInvOrComplain = (event, radio_name) => {
    if (radio_name === 'inv_or_comp' && event.target.value === 'Yes') {
      setShowAdditionalQuestionInvOrComp(true)
    } else if (radio_name === 'inv_or_comp' && event.target.value === 'No') {
      setShowAdditionalQuestionInvOrComp(false)
    }
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRadioButtonFacilityChanges = (event, radio_name) => {
    if (radio_name === 'facility_changes' && event.target.value === 'Yes') {
      setShowAdditionalQuestionFacilityChanges(true)
    } else if (
      radio_name === 'facility_changes' &&
      event.target.value === 'No'
    ) {
      setShowAdditionalQuestionFacilityChanges(false)
    }
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRadioButtonFacilityAnyChanges = (event, radio_name) => {
    if (radio_name === 'facility_any_changes' && event.target.value === 'Yes') {
      setShowAdditionalQuestionFacilityAnyChanges(true)
    } else if (
      radio_name === 'facility_any_changes' &&
      event.target.value === 'No'
    ) {
      setShowAdditionalQuestionFacilityAnyChanges(false)
    }
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRadioButtonChangesLaw = (event, radio_name) => {
    if (radio_name === 'changes_law' && event.target.value === 'Yes') {
      setShowAdditionalQuestionChangesLaw(true)
    } else if (radio_name === 'changes_law' && event.target.value === 'No') {
      setShowAdditionalQuestionChangesLaw(false)
    }
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRadioButtonChangesReported = (event, radio_name) => {
    if (radio_name === 'changes_reported' && event.target.value === 'No') {
      setShowAdditionalQuestionChangesReported(true)
    } else if (
      radio_name === 'changes_reported' &&
      event.target.value === 'Yes'
    ) {
      setShowAdditionalQuestionChangesReported(false)
    }
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckedInvestigatorChanges = (event) => {
    const { value, checked } = event.target
    let updatedCheckedItem = [...formData.investigator_changes]
    if (checked) {
      updatedCheckedItem.push(value)
    } else {
      updatedCheckedItem = updatedCheckedItem.filter((item) => item !== value)
    }
    setFormData({ ...formData, investigator_changes: updatedCheckedItem })
  }

  const handleCheckedFailityChanges = (event) => {
    const { value, checked } = event.target
    let updatedCheckedItem = [...formData.facility_change_item]
    if (checked) {
      updatedCheckedItem.push(value)
    } else {
      updatedCheckedItem = updatedCheckedItem.filter((item) => item !== value)
    }
    setFormData({ ...formData, facility_change_item: updatedCheckedItem })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmitData = async (e) => {
    e.preventDefault()
    try {
      const getValidatedform = await investigatorInfoSchema.validate(formData, {
        abortEarly: false
      })
      const isValid = await investigatorInfoSchema.isValid(getValidatedform)
      if (isValid === true) {
        let q1_supporting_documents = []
        let q2_supporting_documents = []
        let q3_supporting_documents = []
        let q4_supporting_documents = []
        if (!formData.q1_supporting_documents) {
          return setErrors({
            ...errors,
            ['q1_supporting_documents']: 'This is required'
          })
        }
        if (!formData.q2_supporting_documents) {
          return setErrors({
            ...errors,
            ['q2_supporting_documents']: 'This is required'
          })
        }
        if (!formData.q4_supporting_documents) {
          return setErrors({
            ...errors,
            ['q4_supporting_documents']: 'This is required'
          })
        } else {
          for (let file of formData.q1_supporting_documents) {
            let id = uploadFile(file, {
              protocolId: formData.protocol_id,
              createdBy: formData.created_by,
              protocolType: 'continuein_review',
              informationType: 'investigator_and_institution',
              documentName: 'q1_supporting_documents'
            })
            q1_supporting_documents.push(id)
          }
          for (let file of formData.q2_supporting_documents) {
            let id = uploadFile(file, {
              protocolId: formData.protocol_id,
              createdBy: formData.created_by,
              protocolType: 'continuein_review',
              informationType: 'investigator_and_institution',
              documentName: 'q2_supporting_documents'
            })
            q2_supporting_documents.push(id)
          }
          for (let file of formData.q4_supporting_documents) {
            let id = uploadFile(file, {
              protocolId: formData.protocol_id,
              createdBy: formData.created_by,
              protocolType: 'continuein_review',
              informationType: 'investigator_and_institution',
              documentName: 'q4_supporting_documents'
            })
            q4_supporting_documents.push(id)
          }
          if (formData.q3_supporting_documents) {
            for (let file of formData.q3_supporting_documents) {
              let id = uploadFile(file, {
                protocolId: formData.protocol_id,
                createdBy: formData.created_by,
                protocolType: 'continuein_review',
                informationType: 'investigator_and_institution',
                documentName: 'q3_supporting_documents'
              })
              q3_supporting_documents.push(id)
            }
          }
        }
        dispatch(
          investigatorAndinstuationSave({
            ...formData,
            q1_supporting_documents,
            q2_supporting_documents,
            q3_supporting_documents,
            q4_supporting_documents
          })
        ).then((data) => {
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
            e.target.reset()
          }
        })
      }
    } catch (error) {
      const newErrors = {}
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message
      })
      setErrors(newErrors)
      if (Object.keys(newErrors).length > 0) {
        const firstErrorField = document.querySelector(
          `[name="${Object.keys(newErrors)[0]}"]`
        )
        if (firstErrorField) {
          firstErrorField.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }
      }
    }
  }

  useEffect(() => {
    if (investigatorInstitutionInfo) {
      setFormData({
        changes_explain: investigatorInstitutionInfo.changes_explain,
        changes_law: investigatorInstitutionInfo.changes_law,
        changes_law_explain: investigatorInstitutionInfo.changes_law_explain,
        changes_reported: investigatorInstitutionInfo.changes_reported,
        changes_reported_explain:
          investigatorInstitutionInfo.changes_reported_explain,
        facility_any_changes: investigatorInstitutionInfo.facility_any_changes,
        facility_any_changes_explain:
          investigatorInstitutionInfo.facility_any_changes_explain,
        facility_change_item: investigatorInstitutionInfo.facility_change_item,
        facility_changes: investigatorInstitutionInfo.facility_changes,
        inv_or_comp: investigatorInstitutionInfo.inv_or_comp,
        inv_or_comp_explain: investigatorInstitutionInfo.inv_or_comp_explain,
        inv_sit_quali: investigatorInstitutionInfo.inv_sit_quali,
        investigator_changes: investigatorInstitutionInfo.investigator_changes,
        protocol_id: continuinReviewDetails.protocolId,
        created_by: userDetails.id,
        q4_supporting_documents:
          investigatorInstitutionInfo?.documents?.map((doc) => {
            if (doc.document_name === 'q4_supporting_documents') {
              return {
                name: doc.file_name,
                url: doc.file_url
              }
            }
          }) || [],
        q1_supporting_documents:
          investigatorInstitutionInfo?.documents?.map((doc) => {
            if (doc.document_name === 'q1_supporting_documents') {
              return {
                name: doc.file_name,
                url: doc.file_url
              }
            }
          }) || [],
        q2_supporting_documents:
          investigatorInstitutionInfo?.documents?.map((doc) => {
            if (doc.document_name === 'q2_supporting_documents') {
              return {
                name: doc.file_name,
                url: doc.file_url
              }
            }
          }) || [],
        q3_supporting_documents:
          investigatorInstitutionInfo?.documents?.map((doc) => {
            if (doc.document_name === 'q3_supporting_documents') {
              return {
                name: doc.file_name,
                url: doc.file_url
              }
            }
          }) || []
      })

      setShowAdditionalSelectionList(
        investigatorInstitutionInfo.inv_sit_quali === 'Yes' ? true : false
      )
      setShowAdditionalQuestionInvOrComp(
        investigatorInstitutionInfo.inv_or_comp === 'Yes' ? true : false
      )
      setShowAdditionalQuestionFacilityChanges(
        investigatorInstitutionInfo.facility_changes === 'Yes' ? true : false
      )
      setShowAdditionalQuestionChangesReported(
        investigatorInstitutionInfo.changes_reported === 'No' ? true : false
      )
      setShowAdditionalQuestionFacilityAnyChanges(
        investigatorInstitutionInfo.facility_any_changes === 'Yes'
          ? true
          : false
      )
      setShowAdditionalQuestionChangesLaw(
        investigatorInstitutionInfo.changes_law === 'Yes' ? true : false
      )
    }
  }, [investigatorInstitutionInfo, continuinReviewDetails])

  console.log('investigatorInstitutionInfo', {
    investigatorInstitutionInfo,
    formData
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
        <form onSubmit={handleSubmitData}>
          <h4>Question 1</h4>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Have there been any changes in the investigator’s situation or
                qualifications?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="inv_sit_quali"
                value={formData.inv_sit_quali}
                onChange={(event) =>
                  handleRadioButtonInvSitQuali(event, 'inv_sit_quali')
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.inv_sit_quali && (
                <div className="error">{errors.inv_sit_quali}</div>
              )}
            </FormControl>
          </Form.Group>
          {showAdditionalSelectionList === true && (
            <Form.Group as={Col} controlId="validationFormik01">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Mark all that apply
                </FormLabel>
                <FormGroup
                  onChange={(event) => handleCheckedInvestigatorChanges(event)}
                  name="investigator_changes"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.investigator_changes.includes('1')}
                      />
                    }
                    label="suspension of hospital privileges"
                    value="1"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.investigator_changes.includes('2')}
                      />
                    }
                    label="change in medical license status"
                    value="2"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.investigator_changes.includes('3')}
                      />
                    }
                    label="increase in number of research studies conducted by the investigator"
                    value="3"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.investigator_changes.includes('4')}
                      />
                    }
                    label="expired or updated human research protections training"
                    value="4"
                  />
                </FormGroup>
              </FormControl>
            </Form.Group>
          )}
          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
          >
            <InputLabel
              id="demo-simple-select-autowidth-label"
              className="mt-mb-10"
            >
              Upload supporting documents here *
            </InputLabel>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                name="q1_supporting_documents"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length) {
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.files
                    })
                  }
                }}
              />
            </Button>
            {formData?.q1_supporting_documents !== undefined &&
              Array.from(formData?.q1_supporting_documents)?.map((file, i) => (
                <div key={i}>{file?.name}</div>
              ))}
            {errors.q1_supporting_documents && (
              <div className="error">{errors.q1_supporting_documents}</div>
            )}
          </Form.Group>
          <h4>Question 2</h4>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Have there been any investigation of or complaints related to
                the investigator’s conduct of research?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="inv_or_comp"
                value={formData.inv_or_comp}
                onChange={(event) =>
                  handleRadioButtonInvOrComplain(event, 'inv_or_comp')
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
          {showAdditionalQuestionInvOrComp === true && (
            <Form.Group
              as={Col}
              controlId="validationFormik03"
              className="mt-mb-20"
            >
              <Box sx={{ width: '100%', maxWidth: '100%' }}>
                <TextField
                  variant="outlined"
                  placeholder="Explain *"
                  fullWidth
                  name="inv_or_comp_explain"
                  id="explain"
                  rows={3}
                  multiline
                  value={formData.inv_or_comp_explain}
                  onChange={handleChange}
                />
              </Box>
              {errors.inv_or_comp_explain && (
                <div className="error">{errors.inv_or_comp_explain}</div>
              )}
            </Form.Group>
          )}
          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
          >
            <InputLabel
              id="demo-simple-select-autowidth-label"
              className="mt-mb-10"
            >
              Upload supporting documents here *
            </InputLabel>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                name="q2_supporting_documents"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length) {
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.files
                    })
                  }
                }}
              />
            </Button>
            {formData?.q2_supporting_documents !== undefined &&
              Array.from(formData?.q2_supporting_documents)?.map((file, i) => (
                <div key={i}>{file?.name}</div>
              ))}
            {errors.q2_supporting_documents && (
              <div className="error">{errors.q2_supporting_documents}</div>
            )}
          </Form.Group>
          <h4>Question 3</h4>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Have there been any changes in the facility’s ability to
                adequately support the research protocol?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="facility_changes"
                value={formData.facility_changes}
                onChange={(event) =>
                  handleRadioButtonFacilityChanges(event, 'facility_changes')
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
          {showAdditionalQuestionFacilityChanges === true && (
            <Form.Group as={Col} controlId="validationFormik01">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Mark all that apply
                </FormLabel>
                <FormGroup
                  onChange={(event) => handleCheckedFailityChanges(event)}
                  name="facility_change_item"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.facility_change_item.includes('1')}
                      />
                    }
                    label="Personnel changes"
                    value="1"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.facility_change_item.includes('2')}
                      />
                    }
                    label="Financial resource changes"
                    value="2"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.facility_change_item.includes('3')}
                      />
                    }
                    label="Change in facility address"
                    value="3"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.facility_change_item.includes('4')}
                      />
                    }
                    label="Change in facility resources (ie: loss of laboratory space or licensure, loss of adequate storage space, structural damage or changes to the physical facility)"
                    value="4"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.facility_change_item.includes('5')}
                      />
                    }
                    label="Other"
                    value="5"
                  />
                </FormGroup>
              </FormControl>
            </Form.Group>
          )}

          <Form.Group
            as={Col}
            controlId="validationFormik03"
            className="mt-mb-20"
          >
            <Box sx={{ width: '100%', maxWidth: '100%' }}>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Please describe the changes and explain in as much detail as
                  possible. Please provide any solutions, whether temporary or
                  permanent, work-arounds, and/or protocol adjustments *
                </FormLabel>
                <TextField
                  variant="outlined"
                  placeholder=""
                  fullWidth
                  name="changes_explain"
                  id="explain"
                  rows={3}
                  multiline
                  value={formData.changes_explain}
                  onChange={handleChange}
                />
              </FormControl>
            </Box>
            {errors.changes_explain && (
              <div className="error">{errors.changes_explain}</div>
            )}
          </Form.Group>
          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
          >
            <InputLabel
              id="demo-simple-select-autowidth-label"
              className="mt-mb-10"
            >
              Upload supporting documents here if applicable <br /> (ie: new
              informed consent with facility address change, updated protocol to
              reflect facility changes, updated delegation of authority log,
              etc.)
            </InputLabel>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                name="q3_supporting_documents"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length) {
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.files
                    })
                  }
                }}
              />
            </Button>
            {formData?.q3_supporting_documents !== undefined &&
              Array.from(formData?.q3_supporting_documents)?.map((file, i) => (
                <div key={i}>{file?.name}</div>
              ))}
            {errors.q3_supporting_documents && (
              <div className="error">{errors.q3_supporting_documents}</div>
            )}
          </Form.Group>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Have these changes been reported to the IRB?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="changes_reported"
                value={formData.changes_reported}
                onChange={(event) =>
                  handleRadioButtonChangesReported(event, 'changes_reported')
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
          {showAdditionalQuestionChangesReported === true && (
            <Form.Group
              as={Col}
              controlId="validationFormik03"
              className="mt-mb-20"
            >
              <Box sx={{ width: '100%', maxWidth: '100%' }}>
                <TextField
                  variant="outlined"
                  placeholder="Explain *"
                  fullWidth
                  name="changes_reported_explain"
                  id="explain"
                  rows={3}
                  multiline
                  value={formData.changes_reported_explain}
                  onChange={handleChange}
                />
              </Box>
              {errors.changes_reported_explain && (
                <div className="error">{errors.changes_reported_explain}</div>
              )}
            </Form.Group>
          )}

          <h4>Question 4</h4>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Have there been any changes in facility regulations, standard
                operating procedures, or standards of professional conduct?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="facility_any_changes"
                value={formData.facility_any_changes}
                onChange={(event) =>
                  handleRadioButtonFacilityAnyChanges(
                    event,
                    'facility_any_changes'
                  )
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
          {showAdditionalQuestionFacilityAnyChanges === true && (
            <Form.Group
              as={Col}
              controlId="validationFormik03"
              className="mt-mb-20"
            >
              <Box sx={{ width: '100%', maxWidth: '100%' }}>
                <TextField
                  variant="outlined"
                  placeholder="Explain *"
                  fullWidth
                  name="facility_any_changes_explain"
                  id="explain"
                  rows={3}
                  multiline
                  value={formData.facility_any_changes_explain}
                  onChange={handleChange}
                />
              </Box>
              {errors.facility_any_changes_explain && (
                <div className="error">
                  {errors.facility_any_changes_explain}
                </div>
              )}
            </Form.Group>
          )}

          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
          >
            <InputLabel
              id="demo-simple-select-autowidth-label"
              className="mt-mb-10"
            >
              Upload supporting documents here *
            </InputLabel>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                name="q4_supporting_documents"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length) {
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.files
                    })
                  }
                }}
              />
            </Button>
            {formData?.q4_supporting_documents !== undefined &&
              Array.from(formData?.q4_supporting_documents)?.map((file, i) => (
                <div key={i}>{file?.name}</div>
              ))}
            {errors.q4_supporting_documents && (
              <div className="error">{errors.q4_supporting_documents}</div>
            )}
          </Form.Group>
          <h4>Question 5</h4>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Have there been any changes to state or local law regarding
                research that affects the conduct of research?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="changes_law"
                value={formData.changes_law}
                onChange={(event) =>
                  handleRadioButtonChangesLaw(event, 'changes_law')
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
          {showAdditionalQuestionChangesLaw === true && (
            <Form.Group
              as={Col}
              controlId="validationFormik03"
              className="mt-mb-20"
            >
              <Box sx={{ width: '100%', maxWidth: '100%' }}>
                <TextField
                  variant="outlined"
                  placeholder="Explain *"
                  fullWidth
                  name="changes_law_explain"
                  id="explain"
                  rows={3}
                  multiline
                  value={formData.changes_law_explain}
                  onChange={handleChange}
                />
              </Box>
              {errors.changes_law_explain && (
                <div className="error">{errors.changes_law_explain}</div>
              )}
            </Form.Group>
          )}
          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
            style={{ textAlign: 'right' }}
          >
            <Button variant="contained" color="primary" type="Submit">
              SAVE AND CONTINUE
            </Button>
          </Form.Group>
        </form>
      </Row>
    </>
  )
}

export default InvestigatorInstitutionInfo
