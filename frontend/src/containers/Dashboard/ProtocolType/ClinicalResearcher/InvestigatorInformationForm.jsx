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

function InvestigatorInformationForm() {
    const [showAdditionalQuestion, setShowAdditionalQuestion] = React.useState(false);
    const [showDisapproveAdditionTextArea, setShowDisapproveAdditionTextArea] = React.useState(false);
    const [showOversiteAdditionTextArea, setShowOversiteAdditionTextArea] = React.useState(false);
    const [showImmediateFamilyAdditionTextArea, setShowImmediateFamilyAdditionTextArea] = React.useState(false);
    const [showStockOwnershipAdditionTextArea, setShowStockOwnershipAdditionTextArea] = React.useState(false);
    const [showPropertyInterestAdditionTextArea, setShowPropertyInterestAdditionTextArea] = React.useState(false);
    const [showFinancialAgreementAdditionTextArea, setShowFinancialAgreementAdditionTextArea] = React.useState(false);
    const [showServePositionAdditionTextArea, setShowServePositionAdditionTextArea] = React.useState(false);
    const [showInfluenceConductAdditionTextArea, setShowInfluenceConductAdditionTextArea] = React.useState(false);
    const [showInterestConflictsAdditionTextArea, setShowInterestConflictsAdditionTextArea] = React.useState(false);
    const [showFdaAuditAdditionTextArea, setShowFdaAuditAdditionTextArea] = React.useState(false);
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
    });
    const [errors, setErrors] = useState({});

    const handleRadioButtonMoreSite = (event, radio_name) => {
        if (radio_name === 'more_site' && event.target.value === 'Yes') {
            setShowAdditionalQuestion(true)
        } else if (radio_name === 'more_site' && event.target.value === 'No') {
            setShowAdditionalQuestion(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleRadioButtonSelectDisapproved = (event, radio_name) => {
        if (radio_name === 'disapproved_or_withdrawn' && event.target.value === 'Yes') {
            setShowDisapproveAdditionTextArea(true)
        } else if (radio_name === 'disapproved_or_withdrawn' && event.target.value === 'No') {
            setShowDisapproveAdditionTextArea(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleRadioButtonSelectOversite = (event, radio_name) => {
        if (radio_name === 'oversite' && event.target.value === 'Yes') {
            setShowOversiteAdditionTextArea(true)
        } else if (radio_name === 'oversite' && event.target.value === 'No') {
            setShowOversiteAdditionTextArea(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleRadioButtonImmediateFamily = (event, radio_name) => {
        if (radio_name === 'immediate_family' && event.target.value === 'Yes') {
            setShowImmediateFamilyAdditionTextArea(true)
        } else if (radio_name === 'immediate_family' && event.target.value === 'No') {
            setShowImmediateFamilyAdditionTextArea(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleRadioButtonStockOwnerShip = (event, radio_name) => {
        if (radio_name === 'stock_ownership' && event.target.value === 'Yes') {
            setShowStockOwnershipAdditionTextArea(true)
        } else if (radio_name === 'stock_ownership' && event.target.value === 'No') {
            setShowStockOwnershipAdditionTextArea(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleRadioButtonPropertyInterest = (event, radio_name) => {
        if (radio_name === 'property_interest' && event.target.value === 'Yes') {
            setShowPropertyInterestAdditionTextArea(true)
        } else if (radio_name === 'property_interest' && event.target.value === 'No') {
            setShowPropertyInterestAdditionTextArea(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleRadioButtonFinancialAgreement = (event, radio_name) => {
        if (radio_name === 'financial_agreement' && event.target.value === 'Yes') {
            setShowFinancialAgreementAdditionTextArea(true)
        } else if (radio_name === 'financial_agreement' && event.target.value === 'No') {
            setShowFinancialAgreementAdditionTextArea(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleRadioButtonServePosition = (event, radio_name) => {
        if (radio_name === 'server_position' && event.target.value === 'Yes') {
            setShowServePositionAdditionTextArea(true)
        } else if (radio_name === 'server_position' && event.target.value === 'No') {
            setShowServePositionAdditionTextArea(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleRadioButtonInfluenceConduct = (event, radio_name) => {
        if (radio_name === 'influence_conduct' && event.target.value === 'Yes') {
            setShowInfluenceConductAdditionTextArea(true)
        } else if (radio_name === 'influence_conduct' && event.target.value === 'No') {
            setShowInfluenceConductAdditionTextArea(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleRadioButtonInterestConflicts = (event, radio_name) => {
        if (radio_name === 'interest_conflict' && event.target.value === 'Yes') {
            setShowInterestConflictsAdditionTextArea(true)
        } else if (radio_name === 'interest_conflict' && event.target.value === 'No') {
            setShowInterestConflictsAdditionTextArea(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleRadioButtonFdaAudit = (event, radio_name) => {
        if (radio_name === 'fda_audit' && event.target.value === 'Yes') {
            setShowFdaAuditAdditionTextArea(true)
        } else if (radio_name === 'fda_audit' && event.target.value === 'No') {
            setShowFdaAuditAdditionTextArea(false)
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

                const res = await axios.post('http://localhost:8800/api/researchInfo/saveInvestigatorInfo', { ...formData, cv_files, medical_license, training_certificates })
                console.log('res', res)
                if (res.status === 200) {
                    //navigate('/login')
                }
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
                        <TextField fullWidth label="Sub-Investigator Name" id="sub_investigator_name" name="sub_investigator_name" onChange={handleChange} />
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
                        <TextField fullWidth label="Additional Study personnel name" id="additional_study_name" name="additional_study_name" onChange={handleChange} />
                    </Box>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="Additional Study personnel email address" id="additional_study_email" name="additional_study_email" onChange={handleChange} />
                    </Box>
                </Form.Group>
                <h3>Investigational/Research Location:</h3>
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="Name of site *" id="site_name" name="site_name" onChange={handleChange} />
                    </Box>
                    {errors.site_name && <div className="error">{errors.site_name}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="Address of site *" id="site_address" name="site_address" onChange={handleChange} />
                    </Box>
                    {errors.site_address && <div className="error">{errors.site_address}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Do you have more than one site where research will be conducted?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="more_site" onChange={(event) => handleRadioButtonMoreSite(event, 'more_site')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showAdditionalQuestion === true && (
                        <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <TextField fullWidth label="Name and address of site *" id="site_name_address" name="site_name_address" onChange={handleChange} />
                            </Box>
                            {errors.site_name_address && <div className="error">{errors.site_name_address}</div>}
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="Full protocol title *" id="protocol_title" name="protocol_title" onChange={handleChange} />
                    </Box>
                    {errors.protocol_title && <div className="error">{errors.protocol_title}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="Protocol Number *" id="protocol_number" name="protocol_number" onChange={handleChange} />
                    </Box>
                    {errors.protocol_number && <div className="error">{errors.protocol_number}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="Your initials below confirm that your site will only enroll subjects that meet criteria for inclusion in the study *" name="study_criteria" id='study_criteria' onChange={handleChange} />
                    </Box>
                    {errors.study_criteria && <div className="error">{errors.study_criteria}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="How many subjects do you expect to enroll at your site(s) *" name="subject_number" id='subject_number' onChange={handleChange} />
                    </Box>
                    {errors.subject_number && <div className="error">{errors.subject_number}</div>}
                </Form.Group>

                <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                        <TextField fullWidth label="What is your site number assigned by the sponsor" name="site_number" id='site_number' onChange={handleChange} />
                    </Box>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik02" className='mt-mb-20'>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label"> Has this study been disapproved or withdrawn from another IRB?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="disapproved_or_withdrawn" onChange={(event) => handleRadioButtonSelectDisapproved(event, 'disapproved_or_withdrawn')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showDisapproveAdditionTextArea === true && (
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <TextField fullWidth variant="outlined" placeholder="Explain" name="disapproved_or_withdrawn_explain" id='disapproved_or_withdrawn_explain' rows={3} multiline onChange={handleChange} value={formData.disapproved_or_withdrawn_explain} />
                            </Box>
                            {errors.disapproved_or_withdrawn_explain_error && <div className="error">{errors.disapproved_or_withdrawn_explain_error}</div>}
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik04" className='mt-mb-20'>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label"> Are you transferring oversight from another IRB?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="oversite" onChange={(event) => handleRadioButtonSelectOversite(event, 'oversite')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showOversiteAdditionTextArea === true && (
                        <Form.Group as={Col} controlId="validationFormik05" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <TextField fullWidth variant="outlined" placeholder="Explain" name="oversite_explain" id='oversite_explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.oversite_explain_error && <div className="error">{errors.oversite_explain_error}</div>}
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik04" className='mt-mb-20'>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Have any individuals or immediate family members at this site received compensation from the sponsor of this study in the past 12 months that amounts to $5,000 or greater?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="immediate_family" onChange={(event) => handleRadioButtonImmediateFamily(event, 'immediate_family')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showImmediateFamilyAdditionTextArea === true && (
                        <Form.Group as={Col} controlId="validationFormik05" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <FormLabel id="demo-row-radio-buttons-group-label">Please explain the compensation in great detail including amount received, services rendered, and name and title or relationship of the individual with the conflict *</FormLabel>
                                <TextField fullWidth variant="outlined" placeholder="Explain" name="immediate_family_explain" id='immediate_family_explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.immediate_family_explain_error && <div className="error">{errors.immediate_family_explain_error}</div>}
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik04" className='mt-mb-20'>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Do any individuals or immediate family members at this site own interest in the form of stock or other ownership in the sponsor company of this study in the last 12 months that amounts to $5,000 or greater?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="stock_ownership" onChange={(event) => handleRadioButtonStockOwnerShip(event, 'stock_ownership')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showStockOwnershipAdditionTextArea === true && (
                        <Form.Group as={Col} controlId="validationFormik05" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <FormLabel id="demo-row-radio-buttons-group-label">Please describe the monetary interest in detail including the estimated value, percentage of ownership, and name and role of the individual *</FormLabel>
                                <TextField fullWidth variant="outlined" placeholder="Explain" name="stock_ownership_explain" id='stock_ownership_explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.stock_ownership_explain_error && <div className="error">{errors.stock_ownership_explain_error}</div>}
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik04" className='mt-mb-20'>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Do any individuals at this site have proprietary interests being investigated in this study such as, but not limited to, patents, investigational products, or licensing agreements?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="property_interest" onChange={(event) => handleRadioButtonPropertyInterest(event, 'property_interest')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showPropertyInterestAdditionTextArea === true && (
                        <Form.Group as={Col} controlId="validationFormik05" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <FormLabel id="demo-row-radio-buttons-group-label">Please describe the interest in detail including the estimated value, ownership, patent information/investigational product information (if applicable), and name and role of the individual*</FormLabel>
                                <TextField fullWidth variant="outlined" placeholder="Explain" name="property_interest_explain" id='property_interest_explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.property_interest_explain_error && <div className="error">{errors.property_interest_explain_error}</div>}
                        </Form.Group>
                    )
                }

                <Form.Group as={Col} controlId="validationFormik04" className='mt-mb-20'>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Do any individuals at this site have a financial agreement with the sponsor for which they will receive compensation that is linked to the outcome of the study?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="financial_agreement" onChange={(event) => handleRadioButtonFinancialAgreement(event, 'financial_agreement')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showFinancialAgreementAdditionTextArea === true && (
                        <Form.Group as={Col} controlId="validationFormik05" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <FormLabel id="demo-row-radio-buttons-group-label">Please describe the interest in detail including the estimated value, ownership, patent information/investigational product information (if applicable), and name and role of the individual*</FormLabel>
                                <TextField fullWidth variant="outlined" placeholder="Explain" name="financial_agreement_explain" id='financial_agreement_explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.financial_agreement_explain_error && <div className="error">{errors.financial_agreement_explain_error}</div>}
                        </Form.Group>
                    )
                }

                <Form.Group as={Col} controlId="validationFormik04" className='mt-mb-20'>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Do any individuals at this site serve in any executive position or on a board of directors for the sponsor of this study?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="server_position" onChange={(event) => handleRadioButtonServePosition(event, 'server_position')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showServePositionAdditionTextArea === true && (
                        <Form.Group as={Col} controlId="validationFormik05" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <FormLabel id="demo-row-radio-buttons-group-label">Please describe the position in detail including the estimated value of compensation, types of services rendered, duration that the individual has served in this capacity and name and role of the individual *</FormLabel>
                                <TextField fullWidth variant="outlined" placeholder="Explain" name="server_position_explain" id='server_position_explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.server_position_explain_error && <div className="error">{errors.server_position_explain_error}</div>}
                        </Form.Group>
                    )
                }

                <Form.Group as={Col} controlId="validationFormik04" className='mt-mb-20'>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Do any individuals at this site have any interests that may influence the conduct, outcome, or safety of this study?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="influence_conduct" onChange={(event) => handleRadioButtonInfluenceConduct(event, 'influence_conduct')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showInfluenceConductAdditionTextArea === true && (
                        <Form.Group as={Col} controlId="validationFormik05" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <FormLabel id="demo-row-radio-buttons-group-label">Please describe the interest in detail including the potential conflicts and how they may interfere with the study, and name and role of the individual *</FormLabel>
                                <TextField fullWidth variant="outlined" placeholder="Explain" name="influence_conduct_explain" id='influence_conduct_explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.influence_conduct_explain_error && <div className="error">{errors.influence_conduct_explain_error}</div>}
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik04" className='mt-mb-20'>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Is there a Conflict of Interest Committee that has made any determinations related to the potential conflicts and is there a management plan in place?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="interest_conflict" onChange={(event) => handleRadioButtonInterestConflicts(event, 'interest_conflict')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                            <FormControlLabel value="N/A" control={<Radio />} label="N/A" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showInterestConflictsAdditionTextArea === true && (
                        <Form.Group as={Col} controlId="validationFormik05" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <FormLabel id="demo-row-radio-buttons-group-label">Please describe the COI committee findings in detail including the name of the COI committee, the determinations, and describe the management plan *</FormLabel>
                                <TextField fullWidth variant="outlined" placeholder="Explain" name="interest_conflict_explain" id='interest_conflict_explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.interest_conflict_explain_error && <div className="error">{errors.interest_conflict_explain_error}</div>}
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik04" className='mt-mb-20'>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Has the investigator ever had an FDA audit? </FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="fda_audit" onChange={(event) => handleRadioButtonFdaAudit(event, 'fda_audit')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    showFdaAuditAdditionTextArea === true && (
                        <Form.Group as={Col} controlId="validationFormik05" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <TextField fullWidth variant="outlined" placeholder="Explain *" name="fda_audit_explain" id='fda_audit_explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.fda_audit_explain_error && <div className="error">{errors.fda_audit_explain_error}</div>}
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
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
                <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
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
                <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
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
                    <InputLabel id="demo-simple-select-autowidth-label">Upload copy of medical license (if applicable) here </InputLabel>
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
                    <InputLabel id="demo-simple-select-autowidth-label">Upload copies of training certificates (if applicable) here </InputLabel>
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
