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
import { createInvestigatorInformation } from '../../../../services/ProtocolType/ClinicalResearcherService';
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

const investigatorInfoSchema = yup.object().shape({
    investigator_name: yup.string().required("This is required"),
    investigator_email: yup.string().required("This is required"),
    sub_investigator_name: yup.string().required("This is required")
})

function InvestigatorInformationForm({ protocolTypeDetails }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const [showAdditionalQuestion, setShowAdditionalQuestion] = React.useState(false);
    const [showAdditionalQuestionPendingOrActive, setShowAdditionalQuestionPendingOrActive] = React.useState(false);
    const [showAdditionalQuestionSiteFWP, setShowAdditionalQuestionSiteFWP] = React.useState(false);
    const [otherQuestionSelection, setOtherQuestionSelection] = React.useState('');
    const [showOtherQuestion, setShowOtherQuestion] = React.useState(false);
    const [formData, setFormData] = useState({
        investigator_name: '',
        investigator_email: '',
        sub_investigator_name: '',
        sub_investigator_email: '',
        primary_contact: '',
        primary_contact_email: '',
        fda_audit: '',
        fda_audit_explain: '',
        involved_years: '',
        investigators_npi: '',
        training_completed: '',
        training_completed_explain: '',
        investigator_research_number: '',
        pending_or_active_research: '',
        pending_or_active_research_explain: '',
        site_fwp: '',
        fwa_number: '',
        protocol_id: protocolTypeDetails.protocolId,
        created_by: userDetails.id,
    });
    const [errors, setErrors] = useState({});

    const handleRadioButtonFdaAudit = (event, radio_name) => {
        if (radio_name === 'fda_audit' && event.target.value === 'Yes') {
            setShowAdditionalQuestion(true)
        } else if (radio_name === 'fda_audit' && event.target.value === 'No') {
            setShowAdditionalQuestion(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handlePendingOrInactiveresearch = (event, radio_name) => {
        if (radio_name === 'pending_or_active_research' && event.target.value === 'Yes') {
            setShowAdditionalQuestionPendingOrActive(true)
        } else if (radio_name === 'pending_or_active_research' && event.target.value === 'No') {
            setShowAdditionalQuestionPendingOrActive(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSiteFWP = (event, radio_name) => {
        if (radio_name === 'site_fwp' && event.target.value === 'Yes') {
            setShowAdditionalQuestionSiteFWP(true)
        } else if (radio_name === 'site_fwp' && event.target.value === 'No') {
            setShowAdditionalQuestionSiteFWP(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleInvestigatorsInvolvedYears = (event, radio_name) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleTrainingCompletedChecked = (event) => {
        const { value, checked } = event.target
        if (checked === true && value === '8') {
            setShowOtherQuestion(true)
            setOtherQuestionSelection(8)
        } else if (checked === false && value === '8') {
            setShowOtherQuestion(false)
            setOtherQuestionSelection('')
        }
        let updatedTrainingCompleted = [...formData.training_completed];
        if (checked) {
            updatedTrainingCompleted.push(value);
        } else {
            updatedTrainingCompleted = updatedTrainingCompleted.filter(
                (training) => training !== value
            );
        }
        setFormData({ ...formData, training_completed: updatedTrainingCompleted });
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmitData = async (e) => {
        e.preventDefault();
        try {
            const getValidatedform = await investigatorInfoSchema.validate(formData, { abortEarly: false });
            const isValid = await investigatorInfoSchema.isValid(getValidatedform)
            console.log('formData', formData)
            console.log('isValid', isValid)
            if (isValid === true) {
                let cv_files = []
                let medical_license = []
                let training_certificates = []
                if (!formData.cv_files) {
                    return setErrors({ ...errors, ['cv_files']: 'This is required' });
                }
                else {
                    for (let file of formData.cv_files) {
                        let id = await uploadFile(file, { protocolId: formData.protocol_id })
                        cv_files.push(id)
                    }
                    if (formData.medical_license) {
                        for (let file of formData.medical_license) {
                            let id = await uploadFile(file, { protocolId: formData.protocol_id })
                            medical_license.push(id)
                        }
                    }
                    if (formData.training_certificates) {
                        for (let file of formData.training_certificates) {
                            let id = await uploadFile(file, { protocolId: formData.protocol_id })
                            training_certificates.push(id)
                        }
                    }
                }
                dispatch(createInvestigatorInformation({ ...formData, cv_files, medical_license, training_certificates }))
                    .then(data => {
                        if (data.payload.status === 200) {
                        } else {
                        }
                    })
            }

        } catch (error) {
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            if (formData.fda_audit !== '' && formData.fda_audit === 'Yes' && formData.fda_audit_explain === "") {
                newErrors['fda_audit_explain_error'] = 'This is required';
            } else {
                newErrors['fda_audit_explain_error'] = '';
            }
            if (formData.pending_or_active_research !== '' && formData.pending_or_active_research === 'Yes' && formData.pending_or_active_research_explain === "") {
                newErrors['pending_or_active_research_explain_error'] = 'This is required';
            } else {
                newErrors['pending_or_active_research_explain_error'] = '';
            }
            if (formData.site_fwp !== '' && formData.site_fwp === 'Yes' && formData.fwa_number === "") {
                newErrors['fwa_number_error'] = 'This is required';
            } else {
                newErrors['fwa_number_error'] = '';
            }
            if (otherQuestionSelection !== '' && otherQuestionSelection === 8 && formData.training_completed_explain === "") {
                newErrors['training_completed_explain_error'] = 'This is required';
            } else {
                newErrors['training_completed_explain_error'] = '';
            }
            setErrors(newErrors);
        }
    };
    return (
        <Row>
            <form onSubmit={handleSubmitData}>
                <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="Investigator Name *" id="investigator_name" name="investigator_name" onChange={handleChange} />
                    </Box>
                    {errors.investigator_name && <div className="error">{errors.investigator_name}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="Investigator Email *" id="investigator_email" name="investigator_email" onChange={handleChange} />
                    </Box>
                    {errors.investigator_email && <div className="error">{errors.investigator_email}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="Sub-Investigator Name *" id="sub_investigator_name" name="sub_investigator_name" onChange={handleChange} />
                    </Box>
                    {errors.sub_investigator_name && <div className="error">{errors.sub_investigator_name}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="Sub-Investigator Email" id="sub_investigator_email" name="sub_investigator_email" onChange={handleChange} />
                    </Box>
                </Form.Group>

                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="Primary point of contact if different from above" id="primary_contact" name="primary_contact" onChange={handleChange} />
                    </Box>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="Primary point of contact email address" id="primary_contact_email" name="primary_contact_email" onChange={handleChange} />
                    </Box>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Has the investigator ever had an FDA audit?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="fda_audit" onChange={(event) => handleRadioButtonFdaAudit(event, 'fda_audit')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showAdditionalQuestion === true && (
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <TextField variant="outlined" placeholder="Explain *" fullWidth name="fda_audit_explain" id='explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.fda_audit_explain_error && <div className="error">{errors.fda_audit_explain_error}</div>}
                        </Form.Group>
                    )
                }

                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">How long has the investigator been involved in research?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="involved_years" onChange={(event) => handleInvestigatorsInvolvedYears(event, 'involved_years')}>
                            <FormControlLabel value="New to research-1 year" control={<Radio />} label="New to research-&lt;1 year" />
                            <FormControlLabel value="1-5 years" control={<Radio />} label="1-5 years" />
                            <FormControlLabel value="6 years or more" control={<Radio />} label="6 years or more" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>

                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="What is the investigator's NPI if applicable" id="investigators_npi" name="investigators_npi" onChange={handleChange} />
                    </Box>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">What training in the field of human subjects protection has the investigator completed?</FormLabel>
                        <FormGroup onChange={(event) => handleTrainingCompletedChecked(event)} name="training_completed">
                            <FormControlLabel control={<Checkbox />} label="OHRP Human Subject Assurance Training" value='1' />
                            <FormControlLabel control={<Checkbox />} label="CITI Program Training" value='2' />
                            <FormControlLabel control={<Checkbox />} label="Certified Physician Investigator Training" value='3' />
                            <FormControlLabel control={<Checkbox />} label="ACRP training (CCRC, CCRA)" value='4' />
                            <FormControlLabel control={<Checkbox />} label="SOCRA (CCRP)" value='5' />
                            <FormControlLabel control={<Checkbox />} label="Graduate or undergraduate research studies or degrees" value='6' />
                            <FormControlLabel control={<Checkbox />} label="Academy of Physicians in Clinical Research" value='7' />
                            <FormControlLabel control={<Checkbox />} label="Other" value='8' />
                        </FormGroup>
                    </FormControl>
                </Form.Group>
                {
                    showOtherQuestion === true && (
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <TextField variant="outlined" placeholder="Explain *" fullWidth id='training_completed_explain' name="training_completed_explain" rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.training_completed_explain_error && <div className="error">{errors.training_completed_explain_error}</div>}
                        </Form.Group>
                    )
                }

                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="What is the current number of research studies supervised by the investigator?" id="investigator_research_number" name="investigator_research_number" onChange={handleChange} />
                    </Box>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Do you have any pending or active restrictions related to research or the practice of medicine?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="pending_or_active_research" onChange={(event) => handlePendingOrInactiveresearch(event, 'pending_or_active_research')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showAdditionalQuestionPendingOrActive === true && (
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <TextField variant="outlined" placeholder="Explain *" fullWidth id='explain' name='pending_or_active_research_explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.pending_or_active_research_explain_error && <div className="error">{errors.pending_or_active_research_explain_error}</div>}
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Does your site have an FWA?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="site_fwp" onChange={(event) => handleSiteFWP(event, 'site_fwp')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showAdditionalQuestionSiteFWP === true && (
                        <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <TextField fullWidth label="Please provide FWA number *" id="fwa_number" name="fwa_number" onChange={handleChange} />
                            </Box>
                            {errors.fwa_number_error && <div className="error">{errors.fwa_number_error}</div>}
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20'>
                    <InputLabel id="demo-simple-select-autowidth-label">Upload investigator and sub-investigator (if applicable) CV here *</InputLabel>
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
                            name='cv_files'
                            required
                            onChange={e => {
                                if (e.target.files && e.target.files.length) {
                                    setFormData({ ...formData, [e.target.name]: e.target.files });
                                }
                            }}
                        />
                    </Button>
                    {formData?.cv_files?.map((file, i) => <div key={i}>{file?.name}</div>)}
                    {errors.cv_files && <div className="error">{errors.cv_files}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20'>
                    <InputLabel id="demo-simple-select-autowidth-label">Upload copy of medical license (if applicable) here</InputLabel>
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
                            name='medical_license'
                            onChange={e => {
                                if (e.target.files && e.target.files.length) {
                                    setFormData({ ...formData, [e.target.name]: e.target.files });
                                }
                            }}
                        />
                    </Button>
                    {formData?.medical_license?.map((file, i) => <div key={i}>{file?.name}</div>)}
                    {errors.medical_license && <div className="error">{errors.medical_license}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20'>
                    <InputLabel id="demo-simple-select-autowidth-label">Upload copies of training certificates (if applicable) here</InputLabel>
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
                            name='training_certificates'
                            onChange={e => {
                                if (e.target.files && e.target.files.length) {
                                    setFormData({ ...formData, [e.target.name]: e.target.files });
                                }
                            }}
                        />
                    </Button>
                    {formData?.training_certificates?.map((file, i) => <div key={i}>{file?.name}</div>)}
                    {errors.training_certificates && <div className="error">{errors.training_certificates}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20' style={{ textAlign: 'right' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="Submit"
                    >
                        SAVE AND CONTINUE
                    </Button>
                </Form.Group>
            </form>
        </Row>
    )
}

export default InvestigatorInformationForm
