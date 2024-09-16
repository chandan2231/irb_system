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
import * as yup from 'yup'
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchStudyCloseoutRequestDetailsById } from '../../../services/Admin/EventAndRequestService';
import moment from "moment";

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

function AdminStudyCloseoutRequestDetails() {
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

    const { studyCloseoutRequestDetailsById, loading, error } = useSelector(
        state => ({
            error: state.admin.error,
            studyCloseoutRequestDetailsById: state.admin.studyCloseoutRequestDetailsById,
            loading: state.admin.loading,
        })
    );
    useEffect(() => {
        let data = {protocolId: protocolDetails.protocolId}
        dispatch(fetchStudyCloseoutRequestDetailsById(data));
    }, [dispatch, userDetails.id]);

    return (
        <Box sx={{ width: '100%' }}>
            <h2 className='ml-20'>Study Closeout Request Details ({protocolDetails.protocolId})</h2>
            <Box className='pd-25'>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"/>
                <form onSubmit={handleSubmitData} id="protocol_information">
                    {
                        studyCloseoutRequestDetailsById && (
                            <>
                                <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="Protocol Number *" id="protocol_number" name="protocol_number" defaultValue={studyCloseoutRequestDetailsById[0]?.protocol_number} />
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="PI Name *" id="pi_name" name="pi_name" defaultValue={studyCloseoutRequestDetailsById[0]?.pi_name}/>
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="Date of Study Completion *" id="study_completion_date" name="study_completion_date" defaultValue={moment(studyCloseoutRequestDetailsById[0]?.study_completion_date).format("DD-MM-YYYY")} />
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Reason for Study Closeout *</FormLabel>
                                        <RadioGroup aria-labelledby="demo-row-radio-buttons-group-label" name="study_closeout_reason">
                                            <FormControlLabel value="Completed study per protocol including completing enrollment and collection/analysis of all data" control={<Radio />} label="Completed study per protocol including completing enrollment and collection/analysis of all data" checked={studyCloseoutRequestDetailsById[0]?.study_closeout_reason==='Completed study per protocol including completing enrollment and collection/analysis of all data'} />
                                            <FormControlLabel value="Early closure due to PI, sponsor, or other agency decision" control={<Radio />} label="Early closure due to PI, sponsor, or other agency decision" checked={studyCloseoutRequestDetailsById[0]?.study_closeout_reason==='Early closure due to PI, sponsor, or other agency decision'} />
                                            <FormControlLabel value="Early closure due to enrollment challenges" control={<Radio />} label="Early closure due to enrollment challenges" checked={studyCloseoutRequestDetailsById[0]?.study_closeout_reason==='Early closure due to enrollment challenges'} />
                                            <FormControlLabel value="Other" control={<Radio />} label="Other" checked={studyCloseoutRequestDetailsById[0]?.study_closeout_reason==='Other'} />
                                        </RadioGroup>
                                    </FormControl>
                                </Form.Group>
                                {
                                    studyCloseoutRequestDetailsById[0]?.study_closeout_reason==='Other' && (
                                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                                <FormLabel id="demo-row-radio-buttons-group-label">Explain *</FormLabel>
                                                <p className='explain_text'>{studyCloseoutRequestDetailsById[0]?.study_closeout_reason_other}</p>
                                            </Box>
                                        </Form.Group>
                                    )
                                }
                                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="Number of subjects enrolled since study start-up *" id="subject_enrolled_number" name="subject_enrolled_number" defaultValue={studyCloseoutRequestDetailsById[0]?.subject_enrolled_number} />
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="How many subjects withdrew on their own *" id="subject_withdrew_number" name="subject_withdrew_number" defaultValue={studyCloseoutRequestDetailsById[0]?.subject_withdrew_number} />
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="How many subjects were withdrawn by the sponsor, PI, or other study personnel *" id="subject_withdrew_by_other" name="subject_withdrew_by_other" defaultValue={studyCloseoutRequestDetailsById[0]?.subject_withdrew_by_other} />
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="How many subjects were screen fails *" id="subject_fails" name="subject_fails" value={studyCloseoutRequestDetailsById[0]?.subject_fails} />
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="How many subjects are lost to follow up *" id="subject_lost_followup" name="subject_lost_followup" value={studyCloseoutRequestDetailsById[0]?.subject_lost_followup} />
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="How many subjects have completed the research *" id="subject_completed" name="subject_completed" value={studyCloseoutRequestDetailsById[0]?.subject_completed} />
                                    </Box>
                                    <div className='highlight-text'>Note: There should be no remaining subjects in order to close the study</div>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Have you received any subject complaints since last review</FormLabel>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="subject_complaints_review">
                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" checked={studyCloseoutRequestDetailsById[0]?.subject_complaints_review==='Yes'} />
                                            <FormControlLabel value="No" control={<Radio />} label="No" checked={studyCloseoutRequestDetailsById[0]?.subject_complaints_review==='No'} />
                                        </RadioGroup>
                                    </FormControl>
                                </Form.Group>
                                {
                                    studyCloseoutRequestDetailsById[0]?.subject_complaints_review==='Yes' && (
                                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                                <FormLabel id="demo-row-radio-buttons-group-label">Explain *</FormLabel>
                                                <p className='explain_text'>{studyCloseoutRequestDetailsById[0]?.subject_complaints_review_explain}</p>
                                            </Box>
                                        </Form.Group>
                                    )
                                }
                                <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Were there any changes to the protocol, consent form, or other subject materials not yet reported to IRB? </FormLabel>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="not_reported_irb">
                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" checked={studyCloseoutRequestDetailsById[0]?.not_reported_irb==='Yes'} />
                                            <FormControlLabel value="No" control={<Radio />} label="No" checked={studyCloseoutRequestDetailsById[0]?.not_reported_irb==='No'} />
                                        </RadioGroup>
                                    </FormControl>
                                </Form.Group>
                                {
                                    studyCloseoutRequestDetailsById[0]?.not_reported_irb==='Yes' && (
                                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                                <FormLabel id="demo-row-radio-buttons-group-label">Please explain the changes, what document(s) were changed, the reason for the change(s), and why they were not reported to the IRB *</FormLabel>
                                                <p className='explain_text'>{studyCloseoutRequestDetailsById[0]?.not_reported_irb_explain}</p>
                                            </Box>
                                        </Form.Group>
                                    )
                                }
                                <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Is there any promptly reportable information that has not been reported to the IRB?</FormLabel>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="promptly_reportable_info">
                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" checked={studyCloseoutRequestDetailsById[0]?.promptly_reportable_info==='Yes'} />
                                            <FormControlLabel value="No" control={<Radio />} label="No" checked={studyCloseoutRequestDetailsById[0]?.promptly_reportable_info==='No'} />
                                        </RadioGroup>
                                    </FormControl>
                                </Form.Group>
                                
                                <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Is there any adverse events that have not been reported to the IRB?</FormLabel>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="adverse_event_info">
                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" checked={studyCloseoutRequestDetailsById[0]?.adverse_event_info==='Yes'} />
                                            <FormControlLabel value="No" control={<Radio />} label="No" checked={studyCloseoutRequestDetailsById[0]?.adverse_event_info==='No'} />
                                        </RadioGroup>
                                    </FormControl>
                                </Form.Group>
                                
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
                                        <TextField fullWidth disabled label="Your Name *" id="your_name" name="your_name" onChange={handleChange} defaultValue={studyCloseoutRequestDetailsById[0]?.your_name} />
                                    </Box>
                                    <div className='highlight-text'>Note: Your name above is the equivalent of a hand-written signature and is legally binding. Your signature confirms that you are authorized to submit this document and you acknowledge that it is accurate.</div>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20' style={{ textAlign: 'right' }}>
                                    <Button variant="contained" color="primary" type="Submit" disabled>
                                        SUBMIT
                                    </Button>
                                </Form.Group>
                            </>
                        )
                    }
                    
                </form>
            </Box>
        </Box>
    )
}

export default AdminStudyCloseoutRequestDetails












