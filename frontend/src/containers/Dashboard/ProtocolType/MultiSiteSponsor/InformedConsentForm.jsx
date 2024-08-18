import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import * as yup from 'yup'
import { createInformedConsent } from '../../../../services/ProtocolType/MultiSiteSponsorService';
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { uploadFile } from '../../../../services/UserManagement/UserService';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function InformedConsentForm({ protocolTypeDetails }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const [showOtherQuestion, setShowOtherQuestion] = React.useState(false);
    const [showICF, setShowICF] = React.useState(false);
    const [showOtherLangauageAdditionalTextbox, setShowOtherLangauageAdditionalTextbox] = React.useState(false);
    const [showOtherLangauageAdditionalQuestion, setShowOtherLangauageAdditionalQuestion] = React.useState(false);
    const [termsSelected, setTermsSelected] = React.useState(false);
    const [formData, setFormData] = useState({
        consent_type: '',
        no_consent_explain: '',
        include_icf: '',
        participation_compensated: '',
        other_language_selection: '',
        professional_translator: '',
        professional_translator_explain: '',
        protocol_id: protocolTypeDetails.protocolId,
        created_by: userDetails.id,
    });
    const [errors, setErrors] = useState({});

    const [explainNoConsentErrors, setExplainNoConsentErrors] = useState();
    const [explainTranslatorErrors, setExplainTranslatorErrors] = useState();

    const handleTermsChecked = (event) => {
        const { checked } = event.target
        if (checked === true) {
            setTermsSelected(true)
        } else if (checked === false) {
            setTermsSelected(false)
        }
    }

    const handleConsentTypeChecked = (event) => {
        const { value, checked } = event.target
        if (checked === true && value === '1') {
            setShowOtherQuestion(true)
        } else if (checked === false && value === '1') {
            setShowOtherQuestion(false)
        }
        if (checked === true && value === '6') {
            setShowICF(true)
        } else if (checked === false && value === '6') {
            setShowICF(false)
        }
        let updatedConsentTypeCHecked = [...formData.consent_type];
        if (checked) {
            updatedConsentTypeCHecked.push(value);
        } else {
            updatedConsentTypeCHecked = updatedConsentTypeCHecked.filter(
                (training) => training !== value
            );
        }
        setFormData({ ...formData, consent_type: updatedConsentTypeCHecked });

    }

    const handleRadioButtonIncludedIcf = (event, radio_name) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleRadioButtonCompensated = (event, radio_name) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleRadioButtonOtherLanguageSelection = (event, radio_name) => {
        if (radio_name === 'other_language_selection' && event.target.value === 'Yes') {
            setShowOtherLangauageAdditionalQuestion(true)
        } else if (radio_name === 'other_language_selection' && event.target.value === 'No') {
            setShowOtherLangauageAdditionalQuestion(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleRadioButtonProfessionalTranslator = (event, radio_name) => {
        if (radio_name === 'professional_translator' && event.target.value === 'No') {
            setShowOtherLangauageAdditionalTextbox(true)
        } else if (radio_name === 'professional_translator' && event.target.value === 'Yes') {
            setShowOtherLangauageAdditionalTextbox(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmitData = async (e) => {
        e.preventDefault();
        try {
            if (formData.consent_type.includes('1') && formData.no_consent_explain === "") {
                setExplainNoConsentErrors('This is required')
                return
            } else {
                setExplainNoConsentErrors('')
            }
            if (formData.professional_translator !== '' && formData.professional_translator === 'No' && formData.professional_translator_explain === "") {
                setExplainTranslatorErrors('This is required')
                return
            } else {
                setExplainTranslatorErrors('')
            }
            // const getValidatedform = await investigatorInfoSchema.validate(formData, {abortEarly: false});
            // const isValid = await investigatorInfoSchema.isValid(getValidatedform)
            console.log('formData', formData)
            let isValid = true
            if (isValid === true) {
                let consent_file = ''
                if (formData.consent_file) {
                    for (let file of formData.consent_file) {
                        let id = await uploadFile(file, { protocolId: formData.protocol_id })
                        consent_file.push(id)
                    }
                }
                else {
                    return setErrors({ ...errors, consent_file: "This is required" })
                }
                dispatch(createInformedConsent({ ...formData, consent_file }))
                    .then(data => {
                        if (data.payload.status === 200) {
                        } else {
                        }
                    })
            }
        } catch (error) {
            console.log('error', error)
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }
    }

    return (
        <Row>
            <form onSubmit={handleSubmitData}>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">What types of consent will this study use?</FormLabel>
                        <FormGroup onChange={(event) => handleConsentTypeChecked(event)} name="consent_type_check">
                            <FormControlLabel control={<Checkbox />} value="1" label="No consent (requesting waiver of consent)" />
                            <FormControlLabel control={<Checkbox />} value="2" label="Verbal consent" />
                            <FormControlLabel control={<Checkbox />} value="3" label="Written, signed consent by subject" />
                            <FormControlLabel control={<Checkbox />} value="4" label="Written, signed consent by legally authorized representative" />
                            <FormControlLabel control={<Checkbox />} value="5" label="Written, signed assent by minor" />
                            <FormControlLabel control={<Checkbox />} value="6" label="HIPAA authorization agreement" />
                            <FormControlLabel control={<Checkbox />} value="7" label="Waiver of HIPAA agreement" />
                            <FormControlLabel control={<Checkbox />} value="8" label="Online/website/electronic signature consent" />
                        </FormGroup>
                    </FormControl>
                </Form.Group>
                {
                    showOtherQuestion === true && (
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <TextField variant="outlined" placeholder="Explain why no consent*" name="no_consent_explain" id="no_consent_explain" fullWidth rows={3} multiline onChange={handleChange} />
                            </Box>
                            {explainNoConsentErrors && <div className="error">{explainNoConsentErrors}</div>}
                        </Form.Group>
                    )
                }

                {
                    showICF === true && (
                        <Form.Group as={Col} controlId="validationFormik01">
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Will HIPAA authorization language be included in the ICF (informed consent form)?</FormLabel>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="include_icf" onChange={(event) => handleRadioButtonIncludedIcf(event, 'include_icf')}>
                                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="No" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label"> Will the participants be compensated for participation in the study?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="participation_compensated" onChange={(event) => handleRadioButtonCompensated(event, 'participation_compensated')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Will the consent forms be offered in languages other than English?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="other_language_selection" onChange={(event) => handleRadioButtonOtherLanguageSelection(event, 'other_language_selection')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showOtherLangauageAdditionalQuestion === true && (
                        <Form.Group as={Col} controlId="validationFormik01">
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Have the documents been translated by a professional translator?</FormLabel>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="professional_translator" onChange={(event) => handleRadioButtonProfessionalTranslator(event, 'professional_translator')}>
                                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="No" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </Form.Group>
                    )
                }
                {
                    showOtherLangauageAdditionalTextbox === true && (
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <TextField variant="outlined" placeholder="Explain" name="professional_translator_explain" id="professional_translator_explain" fullWidth rows={3} multiline onChange={handleChange} />
                            </Box>
                            {explainTranslatorErrors && <div className="error">{explainTranslatorErrors}</div>}
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20'>
                    <InputLabel id="demo-simple-select-autowidth-label">Upload all consent document templates, including translated consents, if applicable, <br />here (if applying for waiver of consent, document explaining reasoning must be uploaded here) *</InputLabel>
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
                            name='consent_file'
                            required
                            onChange={e => {
                                if (e.target.files && e.target.files.length) {
                                    setFormData({ ...formData, [e.target.name]: e.target.files});
                                }
                            }}
                        />
                    </Button>
                    {formData?.consent_file?.map((file, i) => <div key={i}>{file?.name}</div>)}
                    {errors.consent_file && <div className="error">{errors.consent_file}</div>}
                </Form.Group>
                <Form.Group as={Col} className="ul-list">
                    <p>The informed consent process is a continuous process and the IRB expects that
                        proper subject consent is ensured by the investigator throughout the research
                        study. To comply with the terms set forth by this IRB, the investigator must
                        ensure that:
                    </p>
                    <ul>
                        <li>No study procedures shall be conducted prior to completion of the informed consent forms which include subject or legally authorized representative (LAR) signatures and date, investigator or person obtaining consent signature and date, and providing a copy of the signed consent to the study participant.</li>
                        <li>The identified research participant is given plenty of time to consider their participation in the study and all questions are answered. The identified research participant must be told that their participation in the study is voluntary and that they are under no obligation to participate. The potential participant must voice understanding before proceeding.</li>
                        <li>The consent discussion must be in language understandable to the potential research participant’s comprehension level.</li>
                        <li>The informed consent discussion must be performed in a private setting free from other people who may overhear the discussion, such as a private exam room or other closed-door setting.</li>
                        <li>Only the most current, IRB-approved consent forms may be used for enrollment. </li>
                        <li>All efforts must be taken to ensure participant anonymity including:
                            <ul style={{ marginTop: 0 }}>
                                <li>Safe storage of subject identifiers-all subject identifiers must be coded and de-identified</li>
                                <li>All paper-based records will be stored in a double-locked area such as a locking filing cabinet inside of a locking door and only accessible to authorized staff.</li>
                                <li>All electronic-based records will only be accessed by authorized staff using secure login credentials.</li>
                            </ul>
                        </li>
                        <li>It is the responsibility of the sponsor to enforce these terms with the site investigators.</li>
                    </ul>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
                        <FormGroup onChange={event => handleTermsChecked(event)}>
                            <FormControlLabel control={<Checkbox />} label="Your initials below signify that you have read the terms and agree with them:" />
                        </FormGroup>
                    </FormControl>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20' style={{ textAlign: 'right' }}>
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
    )
}

export default InformedConsentForm
