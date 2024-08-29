import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import * as yup from 'yup'
import Grid from '@mui/material/Grid';
import axios from "axios";

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

function InformedConsentForm({consentInformation}) {
    const [showOtherQuestion, setShowOtherQuestion] = React.useState(false);
    const [showICF, setShowICF] = React.useState(false);
    const [termsSelected, setTermsSelected] = React.useState(false);
    const [formData, setFormData] = useState({
        consent_type: '',
        no_consent_explain: '',
        include_icf: '',
        participation_compensated: '',
        other_language_selection: '',
        professional_translator: '',
        professional_translator_explain: '',
    });
    const [errors, setErrors] = useState({});
    const [explainNoConsentErrors, setExplainNoConsentErrors] = useState();
    const [explainTranslatorErrors, setExplainTranslatorErrors] = useState();

    const handleTermsChecked = (event) => {
        const {checked} = event.target
        if(checked === true){
            setTermsSelected(true)
        } else if (checked === false){
            setTermsSelected(false)
        }
    }

    const handleRadioButtonElectronicConsent = (event, radio_name) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
	}
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmitData = async (e) => {
        e.preventDefault();
        console.log("sadasdsadas", formData)
        try {
            
            const res = await axios.post('http://localhost:8800/api/researchInfo/saveInformedInfo', formData)
            console.log('res', res)
            if(res.status===200){
                //navigate('/login')
            }
        } catch (error) {
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }
    };

    console.log('consentInformation', consentInformation)

	return (
        <Row>
            <form onSubmit={handleSubmitData}>
                <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <FormLabel id="demo-row-radio-buttons-group-label">The IRB will provide your site with an informed consent form formatted with your information. Please answer the questions below so that we may include it in the document</FormLabel>
                    </Box>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="Principal Investigator name *" id="principal_investigator_name" name="principal_investigator_name" value={consentInformation?.principal_investigator_name} />
                    </Box>
                    {errors.principal_investigator_name && <div className="error">{errors.principal_investigator_name}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="Site Address *" id="site_address" name="site_address" value={consentInformation?.site_address} />
                    </Box>
                    {errors.site_address && <div className="error">{errors.site_address}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="Additional Site Address" id="additional_site_address" name="additional_site_address" value={consentInformation?.additional_site_address} />
                    </Box>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="Primary phone number to be listed on the ICF (include the area code) *" id="primary_phone" name="primary_phone" value={consentInformation?.primary_phone} />
                    </Box>
                    {errors.primary_phone && <div className="error">{errors.primary_phone}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="24-hour phone number to be listed on the ICF (include the area code) *" id="always_primary_phone" name="always_primary_phone" value={consentInformation?.always_primary_phone} />
                    </Box>
                    {errors.always_primary_phone && <div className="error">{errors.always_primary_phone}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Will your site(s) use electronic consent?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="site_electronic_consent">
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" checked={consentInformation?.site_electronic_consent==='Yes'} />
                            <FormControlLabel value="No" control={<Radio />} label="No" checked={consentInformation?.site_electronic_consent==='No'} />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                <Form.Group as={Col} className="ul-list">
                    <p>Mandatory message to end users, must be initialed before moving on to the next step:</p>
                    <p>The informed consent process is a continuous process and the IRB expects that proper subject consent is ensured by the investigator throughout the research study. To comply with the terms set forth by this IRB, the investigator must ensure that:</p>
                    <ul>
                        <li>No study procedures shall be conducted prior to completion of the informed consent forms which include subject or legally authorized representative (LAR) signatures and date, investigator or person obtaining consent signature and date, and providing a copy of the signed consent to the study participant.</li>
                        <li>The identified research participant is given plenty of time to consider their participation in the study and all questions are answered. The identified research participant must be told that their participation in the study is voluntary and that they are under no obligation to participate. The potential participant must voice understanding before proceeding.</li>
                        <li>The consent discussion must be in language understandable to the potential research participant’s comprehension level.</li>
                        <li>The informed consent discussion must be performed in a private setting free from other people who may overhear the discussion, such as a private exam room or other closed-door setting.</li>
                        <li>Only the most current, IRB-approved consent forms may be used for enrollment.</li>
                        <li>All efforts must be taken to ensure participant anonymity including:
                            <ul style={{marginTop: 0}}>
                                <li>Safe storage of subject identifiers-all subject identifiers must be coded and de-identified</li>
                                <li>All paper-based records will be stored in a double-locked area such as a locking filing cabinet inside of a locking door and only accessible to authorized staff.</li>
                                <li>All electronic-based records will only be accessed by authorized staff using secure login credentials.</li>
                            </ul>
                        </li>
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
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20' style={{textAlign: 'right'}}>
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
