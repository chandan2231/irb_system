import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Form from 'react-bootstrap/Form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import * as yup from 'yup'
import { createStudyCloseoutRequest } from '../../services/EventAndRequest/EventAndRequestService';
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const studyCloseSchema = yup.object().shape({
    protocol_number: yup.string().required("This is required"),
    pi_name: yup.string().required("This is required"),
    study_closeout_reason: yup.string().required("This is required"),
    study_closeout_reason_other: yup.string().when('study_closeout_reason', {
        is: 'other',
        then: (schema) => schema.required("This is required"),
        otherwise: (schema) => schema,
    }),
    subject_enrolled_number: yup.string().required("This is required"),
    subject_withdrew_number: yup.string().required("This is required"),
    subject_withdrew_by_other: yup.string().required("This is required"),
    subject_fails: yup.string().required("This is required"),
    subject_lost_followup: yup.string().required("This is required"),
    subject_completed: yup.string().required("This is required"),
    subject_complaints_review_explain: yup.string().when('subject_complaints_review', {
        is: 'Yes',
        then: (schema) => schema.required("This is required"),
        otherwise: (schema) => schema,
    }),
    not_reported_irb_explain: yup.string().when('not_reported_irb', {
        is: 'Yes',
        then: (schema) => schema.required("This is required"),
        otherwise: (schema) => schema,
    }),
    promptly_reportable_info: yup.string().required("This is required"),
    adverse_event_info: yup.string().required("This is required"),
    your_name: yup.string().required("This is required"),
})

function StudyCloseoutRequestDetails() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const location = useLocation();
    const protocolDetails = location.state.details
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const [value, setValue] = React.useState(null);
    const [showStudyCloseoutReason, setShowStudyCloseoutReason] = React.useState(false);
    const [showSubjectComplaintsReviewTextbox, setShowSubjectComplaintsReviewTextbox] = React.useState(false);
    const [showChangesNotReportedToIRBTextbox, setShowChangesNotReportedToIRBTextbox] = React.useState(false);
    const [showErrorMsgPromptlyReportableNotSubmitted, setShowErrorMsgPromptlyReportableNotSubmitted] = React.useState('');
    const [showErrorMsgAdverseEventNotSubmitted, setShowErrorMsgAdverseEventNotSubmitted] = React.useState('');
    const [termsSelected, setTermsSelected] = React.useState(false);
    const [formData, setFormData] = useState({
        protocol_number: '',
        pi_name: '',
        study_completion_date: null,
        study_closeout_reason: '',
        study_closeout_reason_other: '',
        subject_enrolled_number: '',
        subject_withdrew_number: '',
        subject_withdrew_by_other: '',
        subject_fails: '',
        subject_lost_followup: '',
        subject_completed: '',
        subject_complaints_review: '',
        subject_complaints_review_explain: '',
        not_reported_irb: '',
        not_reported_irb_explain: '',
        promptly_reportable_info: '',
        adverse_event_info: '',
        your_name: '',
        protocol_id: protocolDetails.protocolId,
        created_by: userDetails.id,
        protocol_type: protocolDetails.researchType,
    });
    const [errors, setErrors] = useState({});
    
    const handleStudyCloseoutReason = (event, radio_name) => {
        if (radio_name === 'study_closeout_reason' && event.target.value === 'Other') {
            setShowStudyCloseoutReason(true)
        } else if (radio_name === 'study_closeout_reason' && event.target.value !== 'Other') {
            setShowStudyCloseoutReason(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleSubjectComplainsReview = (event, radio_name) => {
        if (radio_name === 'subject_complaints_review' && event.target.value === 'Yes') {
            setShowSubjectComplaintsReviewTextbox(true)
        } else if (radio_name === 'subject_complaints_review' && event.target.value === 'No') {
            setShowSubjectComplaintsReviewTextbox(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleChangesNotReportedToIRB = (event, radio_name) => {
        if (radio_name === 'not_reported_irb' && event.target.value === 'Yes') {
            setShowChangesNotReportedToIRBTextbox(true)
        } else if (radio_name === 'not_reported_irb' && event.target.value === 'No') {
            setShowChangesNotReportedToIRBTextbox(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const handlePromptlyReportableInfo = (event, radio_name) => {
        if (radio_name === 'promptly_reportable_info' && event.target.value === 'Yes') {
            setShowErrorMsgPromptlyReportableNotSubmitted('you must complete a Promptly Reportable Information submission')
        } else if (radio_name === 'promptly_reportable_info' && event.target.value === 'No') {
            setShowErrorMsgPromptlyReportableNotSubmitted('')
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }
    const handleAdverseEventInfo = (event, radio_name) => {
        if (radio_name === 'adverse_event_info' && event.target.value === 'Yes') {
            setShowErrorMsgAdverseEventNotSubmitted('you must complete and submit an Adverse Event report')
        } else if (radio_name === 'adverse_event_info' && event.target.value === 'No') {
            setShowErrorMsgAdverseEventNotSubmitted('')
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    // const handleFinalSubmissionTearmChecked = (event) => {
    //     const {checked} = event.target
    //     if(checked === true){
    //         setTermsSelected(true)
    //     } else if (checked === false){
    //         setTermsSelected(false)
    //     }
    // }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmitData = async (e) => {
        e.preventDefault();
        try {
            if (formData.study_completion_date === null) {
                return setErrors({ ...errors, ['study_completion_date']: 'This is required' });
            }
            const getValidatedform = await studyCloseSchema.validate(formData, { abortEarly: false });
            const isValid = await studyCloseSchema.isValid(getValidatedform)
            console.log('formData', formData)
            //return
            if (isValid === true) {
                dispatch(createStudyCloseoutRequest({ ...formData }))
                .then(data => {
                    if (data.payload.status === 200) {
                        toast.success(data.payload.data.msg, {position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark"});
                        setFormData({})
                    } else {
                        toast.error(data.payload.data.msg, {position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark"});
                    }
                })
            }
        } catch (error) {
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
            if (Object.keys(newErrors).length > 0) {
                const firstErrorField = document.querySelector(`[name="${Object.keys(newErrors)[0]}"]`);
                if (firstErrorField) {
                  firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    }
    // const handleDateChange = (newValue) => {
    //     console.log(dayjs(newValue).format('YYYY-MM-DD'))
    //     setFormData({ ...formData, study_completion_date: dayjs(newValue).format('YYYY-MM-DD')});
    // };
    return (
        <Box sx={{ width: '100%' }}>
            <h2 className='ml-20'>Study Closeout Request Details ({protocolDetails.protocolId})</h2>
            <Box className='pd-25'>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"/>
                <form onSubmit={handleSubmitData} id="protocol_information">
                    <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <TextField fullWidth label="Protocol Number *" id="protocol_number" name="protocol_number" onChange={handleChange} value={formData.protocol_number} />
                        </Box>
                        {errors.protocol_number && <div className="error">{errors.protocol_number}</div>}
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <TextField fullWidth label="PI Name *" id="pi_name" name="pi_name" onChange={handleChange} value={formData.pi_name} />
                        </Box>
                        {errors.pi_name && <div className="error">{errors.pi_name}</div>}
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date of Study Completion *"
                                    onChange={newValue => (setFormData({ ...formData, study_completion_date: dayjs(newValue).format('YYYY-MM-DD')}))}
                                    renderInput={(params) => <TextField {...params} />}
                                    sx={{ width: "50%" }}
                                />
                            </LocalizationProvider>
                        </Box>
                        {errors.study_completion_date && <div className="error">{errors.study_completion_date}</div>}
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Reason for Study Closeout *</FormLabel>
                            <RadioGroup aria-labelledby="demo-row-radio-buttons-group-label" name="study_closeout_reason" onChange={(event) => handleStudyCloseoutReason(event, 'study_closeout_reason')}>
                                <FormControlLabel value="Completed study per protocol including completing enrollment and collection/analysis of all data" control={<Radio />} label="Completed study per protocol including completing enrollment and collection/analysis of all data" />
                                <FormControlLabel value="Early closure due to PI, sponsor, or other agency decision" control={<Radio />} label="Early closure due to PI, sponsor, or other agency decision" />
                                <FormControlLabel value="Early closure due to enrollment challenges" control={<Radio />} label="Early closure due to enrollment challenges" />
                                <FormControlLabel value="Other" control={<Radio />} label="Other" />
                            </RadioGroup>
                        </FormControl>
                        {errors.study_closeout_reason && <div className="error">{errors.study_closeout_reason}</div>}
                    </Form.Group>
                    {
                        showStudyCloseoutReason === true && (
                            <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <TextField variant="outlined" placeholder="Explain *" name="study_closeout_reason_other" fullWidth id='explain' rows={3} multiline onChange={handleChange} value={formData.study_closeout_reason_other} />
                                </Box>
                                {errors.study_closeout_reason_other && <div className="error">{errors.study_closeout_reason_other}</div>}
                            </Form.Group>
                        )
                    }
                    <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <TextField fullWidth label="Number of subjects enrolled since study start-up *" id="subject_enrolled_number" name="subject_enrolled_number" onChange={handleChange} value={formData.subject_enrolled_number} />
                        </Box>
                        {errors.subject_enrolled_number && <div className="error">{errors.subject_enrolled_number}</div>}
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <TextField fullWidth label="How many subjects withdrew on their own *" id="subject_withdrew_number" name="subject_withdrew_number" onChange={handleChange} value={formData.subject_withdrew_number} />
                        </Box>
                        {errors.subject_withdrew_number && <div className="error">{errors.subject_withdrew_number}</div>}
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <TextField fullWidth label="How many subjects were withdrawn by the sponsor, PI, or other study personnel *" id="subject_withdrew_by_other" name="subject_withdrew_by_other" onChange={handleChange} value={formData.subject_withdrew_by_other} />
                        </Box>
                        {errors.subject_withdrew_by_other && <div className="error">{errors.subject_withdrew_by_other}</div>}
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <TextField fullWidth label="How many subjects were screen fails *" id="subject_fails" name="subject_fails" onChange={handleChange} value={formData.subject_fails} />
                        </Box>
                        {errors.subject_fails && <div className="error">{errors.subject_fails}</div>}
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <TextField fullWidth label="How many subjects are lost to follow up *" id="subject_lost_followup" name="subject_lost_followup" onChange={handleChange} value={formData.subject_lost_followup} />
                        </Box>
                        {errors.subject_lost_followup && <div className="error">{errors.subject_lost_followup}</div>}
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <TextField fullWidth label="How many subjects have completed the research *" id="subject_completed" name="subject_completed" onChange={handleChange} value={formData.subject_completed} />
                        </Box>
                        <div className='highlight-text'>Note: There should be no remaining subjects in order to close the study</div>
                        {errors.subject_completed && <div className="error">{errors.subject_completed}</div>}
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Have you received any subject complaints since last review</FormLabel>
                            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="subject_complaints_review" onChange={(event) => handleSubjectComplainsReview(event, 'subject_complaints_review')}>
                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Form.Group>
                    {
                        showSubjectComplaintsReviewTextbox === true && (
                            <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <TextField variant="outlined" placeholder="Explain *" name="subject_complaints_review_explain" fullWidth id='subject_complaints_review_explain' rows={3} multiline onChange={handleChange} value={formData.subject_complaints_review_explain} />
                                </Box>
                                {errors.subject_complaints_review_explain && <div className="error">{errors.subject_complaints_review_explain}</div>}
                            </Form.Group>
                        )
                    }
                    <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Were there any changes to the protocol, consent form, or other subject materials not yet reported to IRB? </FormLabel>
                            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="not_reported_irb" onChange={(event) => handleChangesNotReportedToIRB(event, 'not_reported_irb')}>
                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Form.Group>
                    {
                        showChangesNotReportedToIRBTextbox === true && (
                            <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Please explain the changes, what document(s) were changed, the reason for the change(s), and why they were not reported to the IRB *</FormLabel>
                                    <TextField variant="outlined" placeholder="Explain" name="not_reported_irb_explain" fullWidth id='not_reported_irb_explain' rows={3} multiline onChange={handleChange} value={formData.not_reported_irb_explain} />
                                </Box>
                                {errors.not_reported_irb_explain && <div className="error">{errors.not_reported_irb_explain}</div>}
                            </Form.Group>
                        )
                    }
                    <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Is there any promptly reportable information that has not been reported to the IRB?</FormLabel>
                            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="promptly_reportable_info" onChange={(event) => handlePromptlyReportableInfo(event, 'promptly_reportable_info')}>
                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                            </RadioGroup>
                            {errors.promptly_reportable_info && <div className="error">{errors.promptly_reportable_info}</div>}
                        </FormControl>
                    </Form.Group>
                    {
                        showErrorMsgPromptlyReportableNotSubmitted !== '' && (
                            <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <FormLabel id="demo-row-radio-buttons-group-label">{showErrorMsgPromptlyReportableNotSubmitted !== '' && <div className="error">{showErrorMsgPromptlyReportableNotSubmitted}</div>}</FormLabel>
                                </Box>
                            </Form.Group>
                        )
                    }
                    <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Is there any adverse events that have not been reported to the IRB?</FormLabel>
                            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="adverse_event_info" onChange={(event) => handleAdverseEventInfo(event, 'adverse_event_info')}>
                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                            </RadioGroup>
                            {errors.adverse_event_info && <div className="error">{errors.adverse_event_info}</div>}
                        </FormControl>
                    </Form.Group>
                    {
                        showErrorMsgAdverseEventNotSubmitted !== '' && (
                            <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <FormLabel id="demo-row-radio-buttons-group-label">{showErrorMsgAdverseEventNotSubmitted !== '' && <div className="error">{showErrorMsgAdverseEventNotSubmitted}</div>}</FormLabel>
                                </Box>
                            </Form.Group>
                        )
                    }
                    <h3>Acknowledgement</h3>
                    <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                        <FormControl>
							<FormGroup>
                                <FormLabel>- By submitting this form, you guarantee that all research has completed and no new study procedures or enrollments will occur.</FormLabel>
                                <FormLabel>- You certify that all data collection has completed and no new data will be collected.</FormLabel>
                                <FormLabel>- You also certify that any biological samples related to the study have been destroyed and no new samples will be collected.</FormLabel>
                            </FormGroup>
						</FormControl>
					</Form.Group>
                    <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <TextField fullWidth label="Your Name *" id="your_name" name="your_name" onChange={handleChange} value={formData.your_name} />
                        </Box>
                        <div className='highlight-text'>Note: Your name above is the equivalent of a hand-written signature and is legally binding. Your signature confirms that you are authorized to submit this document and you acknowledge that it is accurate.</div>
                        {errors.your_name && <div className="error">{errors.your_name}</div>}
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20' style={{ textAlign: 'right' }}>
                        <Button variant="contained" color="primary" type="Submit">
                            SUBMIT
                        </Button>
                    </Form.Group>
                </form>
            </Box>
        </Box>
    )
}

export default StudyCloseoutRequestDetails












