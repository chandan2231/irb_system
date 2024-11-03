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
import { createInformedConsent } from '../../../../services/ProtocolType/MultiSiteSponsorService'
import { Box, useTheme } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { uploadFile } from '../../../../services/UserManagement/UserService'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const informedConsentSchema = yup.object().shape({
  consent_type: yup
    .array()
    .of(yup.string())
    .required('At least one consent type is required'),
  no_consent_explain: yup.string().when('consent_type', {
    is: (consent_type) => consent_type.includes('1'),
    then: () => yup.string().required('Explanation for no consent is required'),
    otherwise: () => yup.string().nullable()
  }),
  include_icf: yup.string().when('consent_type', {
    is: (consent_type) => consent_type.includes('6'),
    then: () =>
      yup
        .string()
        .required(
          'You must specify if HIPAA authorization language will be included in the ICF'
        ),
    otherwise: () => yup.string().nullable()
  }),
  participation_compensated: yup
    .string()
    .required('You must specify if participants will be compensated'),
  other_language_selection: yup
    .string()
    .required(
      'You must specify if the consent forms will be offered in other languages'
    ),
  professional_translator: yup.string().when('other_language_selection', {
    is: () => 'Yes',
    then: () =>
      yup
        .string()
        .required(
          'You must specify if the documents were translated by a professional translator'
        ),
    otherwise: () => yup.string().nullable()
  }),
  professional_translator_explain: yup
    .string()
    .when('professional_translator', {
      is: () => 'No',
      then: () =>
        yup
          .string()
          .required(
            'Explanation for not using a professional translator is required'
          ),
      otherwise: () => yup.string().nullable()
    }),
  consent_file: yup
    .mixed()
    .required('You must upload at least one consent document template')
})

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

function InformedConsentForm({ protocolTypeDetails, informedConsent }) {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userDetails = JSON.parse(localStorage.getItem('user'))
  const [showOtherQuestion, setShowOtherQuestion] = React.useState(false)
  const [showICF, setShowICF] = React.useState(false)
  const [
    showOtherLangauageAdditionalTextbox,
    setShowOtherLangauageAdditionalTextbox
  ] = React.useState(false)
  const [
    showOtherLangauageAdditionalQuestion,
    setShowOtherLangauageAdditionalQuestion
  ] = React.useState(false)
  const [termsSelected, setTermsSelected] = React.useState(false)
  const [formData, setFormData] = useState({
    consent_type: '',
    no_consent_explain: '',
    include_icf: '',
    participation_compensated: '',
    other_language_selection: '',
    professional_translator: '',
    professional_translator_explain: '',
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id
  })
  const [errors, setErrors] = useState({})

  const [explainNoConsentErrors, setExplainNoConsentErrors] = useState()
  const [explainTranslatorErrors, setExplainTranslatorErrors] = useState()

  const handleTermsChecked = (event) => {
    setTermsSelected(event.target.checked)
  }

  const handleConsentTypeChecked = (event) => {
    const { value, checked } = event.target
    if (value === '1') setShowOtherQuestion(checked)
    if (value === '6') setShowICF(checked)

    let updatedConsentTypeChecked = [...formData.consent_type]
    if (checked) {
      updatedConsentTypeChecked.push(value)
    } else {
      updatedConsentTypeChecked = updatedConsentTypeChecked.filter(
        (type) => type !== value
      )
    }
    setFormData({ ...formData, consent_type: updatedConsentTypeChecked })
  }

  const handleRadioButtonIncludedIcf = (event, radio_name) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRadioButtonCompensated = (event, radio_name) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRadioButtonOtherLanguageSelection = (event, radio_name) => {
    if (
      radio_name === 'other_language_selection' &&
      event.target.value === 'Yes'
    ) {
      setShowOtherLangauageAdditionalQuestion(true)
    } else if (
      radio_name === 'other_language_selection' &&
      event.target.value === 'No'
    ) {
      setShowOtherLangauageAdditionalQuestion(false)
      setShowOtherLangauageAdditionalTextbox(false)
    }
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleRadioButtonProfessionalTranslator = (event, radio_name) => {
    if (
      radio_name === 'professional_translator' &&
      event.target.value === 'No'
    ) {
      setShowOtherLangauageAdditionalTextbox(true)
    } else if (
      radio_name === 'professional_translator' &&
      event.target.value === 'Yes'
    ) {
      setShowOtherLangauageAdditionalTextbox(false)
    }
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmitData = async (e) => {
    e.preventDefault()
    try {
      if (
        formData.consent_type.includes('1') &&
        formData.no_consent_explain === ''
      ) {
        setExplainNoConsentErrors('This is required')
        return
      } else {
        setExplainNoConsentErrors('')
      }
      if (
        formData.professional_translator !== '' &&
        formData.professional_translator === 'No' &&
        formData.professional_translator_explain === ''
      ) {
        setExplainTranslatorErrors('This is required')
        return
      } else {
        setExplainTranslatorErrors('')
      }
      // const getValidatedform = await investigatorInfoSchema.validate(formData, {abortEarly: false});
      // const isValid = await investigatorInfoSchema.isValid(getValidatedform)
      const isValid = true
      if (isValid === true) {
        let consent_file = []
        if (!formData.consent_file) {
          return setErrors({ ...errors, ['consent_file']: 'This is required' })
        } else {
          for (let file of formData.consent_file) {
            let id = await uploadFile(file, {
              protocolId: formData.protocol_id,
              createdBy: formData.created_by,
              protocolType: protocolTypeDetails.researchType,
              informationType: 'informed_consent',
              documentName: 'consent_files'
            })
            consent_file.push(id)
          }
        }
        dispatch(createInformedConsent({ ...formData, consent_file })).then(
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
    } catch (error) {
      console.log('error', error)
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
    if (informedConsent) {
      setFormData({
        consent_type: informedConsent?.consent_type?.split(',') || [],
        no_consent_explain: informedConsent?.no_consent_explain || '',
        include_icf: informedConsent?.include_icf || '',
        participation_compensated:
          informedConsent?.participation_compensated || '',
        other_language_selection:
          informedConsent?.other_language_selection || '',
        professional_translator: informedConsent?.professional_translator || '',
        professional_translator_explain:
          informedConsent?.professional_translator_explain || '',
        protocol_id: protocolTypeDetails?.protocolId || '',
        created_by: userDetails?.id || '',
        consent_file:
          informedConsent?.documents?.map((doc) => ({
            name: doc.file_name,
            url: doc.file_url,
            type: doc.protocol_type
          })) || []
      })

      setShowOtherQuestion(informedConsent?.consent_type?.includes('1'))
      setShowICF(informedConsent?.consent_type?.includes('6'))
      setShowOtherLangauageAdditionalQuestion(
        informedConsent?.other_language_selection === 'Yes'
      )
      setShowOtherLangauageAdditionalTextbox(
        informedConsent?.professional_translator === 'No' &&
          informedConsent?.other_language_selection === 'Yes'
      )
    }
  }, [informedConsent, protocolTypeDetails])

  console.log('informedConsent', {
    informedConsent,
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
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                What types of consent will this study use?
              </FormLabel>
              <FormGroup
                onChange={(event) => handleConsentTypeChecked(event)}
                name="consent_type_check"
              >
                <FormControlLabel
                  control={
                    <Checkbox checked={formData.consent_type.includes('1')} />
                  }
                  value="1"
                  label="No consent (requesting waiver of consent)"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={formData.consent_type.includes('2')} />
                  }
                  value="2"
                  label="Verbal consent"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={formData.consent_type.includes('3')} />
                  }
                  value="3"
                  label="Written, signed consent by subject"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={formData.consent_type.includes('4')} />
                  }
                  value="4"
                  label="Written, signed consent by legally authorized representative"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={formData.consent_type.includes('5')} />
                  }
                  value="5"
                  label="Written, signed assent by minor"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={formData.consent_type.includes('6')} />
                  }
                  value="6"
                  label="HIPAA authorization agreement"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={formData.consent_type.includes('7')} />
                  }
                  value="7"
                  label="Waiver of HIPAA agreement"
                />
                <FormControlLabel
                  control={
                    <Checkbox checked={formData.consent_type.includes('8')} />
                  }
                  value="8"
                  label="Online/website/electronic signature consent"
                />
              </FormGroup>
            </FormControl>
          </Form.Group>
          {showOtherQuestion === true && (
            <Form.Group
              as={Col}
              controlId="validationFormik03"
              className="mt-mb-20"
            >
              <Box sx={{ width: '100%', maxWidth: '100%' }}>
                <TextField
                  variant="outlined"
                  placeholder="Explain why no consent*"
                  name="no_consent_explain"
                  id="no_consent_explain"
                  fullWidth
                  rows={3}
                  multiline
                  value={formData.no_consent_explain}
                  onChange={handleChange}
                />
              </Box>
              {explainNoConsentErrors && (
                <div className="error">{explainNoConsentErrors}</div>
              )}
            </Form.Group>
          )}

          {showICF === true && (
            <Form.Group as={Col} controlId="validationFormik01">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Will HIPAA authorization language be included in the ICF
                  (informed consent form)?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="include_icf"
                  value={formData.include_icf}
                  onChange={(event) =>
                    handleRadioButtonIncludedIcf(event, 'include_icf')
                  }
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Form.Group>
          )}
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                {' '}
                Will the participants be compensated for participation in the
                study?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="participation_compensated"
                value={formData.participation_compensated}
                onChange={(event) =>
                  handleRadioButtonCompensated(
                    event,
                    'participation_compensated'
                  )
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                Will the consent forms be offered in languages other than
                English?
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="other_language_selection"
                value={formData.other_language_selection}
                onChange={(event) =>
                  handleRadioButtonOtherLanguageSelection(
                    event,
                    'other_language_selection'
                  )
                }
              >
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Form.Group>
          {showOtherLangauageAdditionalQuestion === true && (
            <Form.Group as={Col} controlId="validationFormik01">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Have the documents been translated by a professional
                  translator?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="professional_translator"
                  value={formData.professional_translator}
                  onChange={(event) =>
                    handleRadioButtonProfessionalTranslator(
                      event,
                      'professional_translator'
                    )
                  }
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Form.Group>
          )}
          {showOtherLangauageAdditionalTextbox === true && (
            <Form.Group
              as={Col}
              controlId="validationFormik03"
              className="mt-mb-20"
            >
              <Box sx={{ width: '100%', maxWidth: '100%' }}>
                <TextField
                  variant="outlined"
                  placeholder="Explain *"
                  name="professional_translator_explain"
                  id="professional_translator_explain"
                  fullWidth
                  rows={3}
                  multiline
                  value={formData.professional_translator_explain}
                  onChange={handleChange}
                />
              </Box>
              {explainTranslatorErrors && (
                <div className="error">{explainTranslatorErrors}</div>
              )}
            </Form.Group>
          )}
          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
          >
            <InputLabel id="demo-simple-select-autowidth-label">
              Upload all consent document templates, including translated
              consents, if applicable, <br />
              here (if applying for waiver of consent, document explaining
              reasoning must be uploaded here) *
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
                name="consent_file"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length) {
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.files
                    })
                  }
                }}
                multiple
              />
            </Button>
            {formData?.consent_file !== undefined &&
              Array.from(formData?.consent_file)?.map((file, i) => (
                <div key={i}>{file?.name}</div>
              ))}
            {errors.consent_file && (
              <div className="error">{errors.consent_file}</div>
            )}
          </Form.Group>
          <Form.Group as={Col} className="ul-list">
            <p>
              The informed consent process is a continuous process and the IRB
              expects that proper subject consent is ensured by the investigator
              throughout the research study. To comply with the terms set forth
              by this IRB, the investigator must ensure that:
            </p>
            <ul>
              <li>
                No study procedures shall be conducted prior to completion of
                the informed consent forms which include subject or legally
                authorized representative (LAR) signatures and date,
                investigator or person obtaining consent signature and date, and
                providing a copy of the signed consent to the study participant.
              </li>
              <li>
                The identified research participant is given plenty of time to
                consider their participation in the study and all questions are
                answered. The identified research participant must be told that
                their participation in the study is voluntary and that they are
                under no obligation to participate. The potential participant
                must voice understanding before proceeding.
              </li>
              <li>
                The consent discussion must be in language understandable to the
                potential research participant’s comprehension level.
              </li>
              <li>
                The informed consent discussion must be performed in a private
                setting free from other people who may overhear the discussion,
                such as a private exam room or other closed-door setting.
              </li>
              <li>
                Only the most current, IRB-approved consent forms may be used
                for enrollment.{' '}
              </li>
              <li>
                All efforts must be taken to ensure participant anonymity
                including:
                <ul style={{ marginTop: 0 }}>
                  <li>
                    Safe storage of subject identifiers-all subject identifiers
                    must be coded and de-identified
                  </li>
                  <li>
                    All paper-based records will be stored in a double-locked
                    area such as a locking filing cabinet inside of a locking
                    door and only accessible to authorized staff.
                  </li>
                  <li>
                    All electronic-based records will only be accessed by
                    authorized staff using secure login credentials.
                  </li>
                </ul>
              </li>
              <li>
                It is the responsibility of the sponsor to enforce these terms
                with the site investigators.
              </li>
            </ul>
          </Form.Group>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
              <FormGroup onChange={(event) => handleTermsChecked(event)}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Your initials below signify that you have read the terms and agree with them:"
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
              SAVE AND CONTINUE
            </Button>
          </Form.Group>
        </form>
      </Row>
    </>
  )
}

export default InformedConsentForm
