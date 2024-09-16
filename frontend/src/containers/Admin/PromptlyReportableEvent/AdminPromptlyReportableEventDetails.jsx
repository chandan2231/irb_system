import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Form from 'react-bootstrap/Form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup'
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { fetchPromptlyReportableEventById } from '../../../services/Admin/EventAndRequestService';
import moment from "moment";


const promptlyReportableSchema = yup.object().shape({
    submitter_type: yup.string().required("This is required"),
    irb_protocol_number: yup.string().required("This is required"),
    sponsor_name: yup.string().required("This is required"),
    described_category_explain: yup.string().when('described_category', {
        is: 'Other',
        then: (schema) => schema.required("This is required"),
        otherwise: (schema) => schema,
    }),
    describe_problem: yup.string().required("This is required"),
    date_problem_discovered: yup.string().required("This is required"),
    date_of_occurrence: yup.string().required("This is required"),
    action_taken: yup.string().required("This is required"),
    plan_action_taken: yup.string().required("This is required"),
    question_not_covered: yup.string().required("This is required"),
    person_name: yup.string().required("This is required"),
    email: yup.string().required("This is required"),
    phone: yup.string().required("This is required"),
    your_name: yup.string().required("This is required"),
})

function AdminPromptlyReportableEventDetails() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const location = useLocation();
    const protocolDetails = location.state.details
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const [termsSelected, setTermsSelected] = React.useState(false);
    const [formData, setFormData] = useState({
        submitter_type: '',
        irb_protocol_number: '',
        sponsor_name: '',
        described_category: '',
        described_category_explain: '',
        involved_subject: '',
        date_problem_discovered: '',
        date_of_occurrence: '',
        date_reported_to_sponsor: '',
        describe_problem: '',
        action_taken: '',
        plan_action_taken: '',
        subject_harmed: '',
        protocol_change: '',
        question_not_covered: '',
        person_name: '',
        email: '',
        phone: '',
        your_name: '',
        protocol_id: protocolDetails.protocolId,
        created_by: userDetails.id,
    });
    const [errors, setErrors] = useState({});
    
    const handleFinalSubmissionTearmChecked = (event) => {
        const {checked} = event.target
        if(checked === true){
            setTermsSelected(true)
        } else if (checked === false){
            setTermsSelected(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmitData = async (e) => {
        e.preventDefault();
        try {
            // if (formData.date_problem_discovered === '') {
            //     return setErrors({ ...errors, ['date_problem_discovered']: 'This is required' });
            // }
            // if (formData.date_of_occurrence === '') {
            //     return setErrors({ ...errors, ['date_of_occurrence']: 'This is required' });
            // }
            const getValidatedform = await promptlyReportableSchema.validate(formData, { abortEarly: false });
            const isValid = await promptlyReportableSchema.isValid(getValidatedform)
            // const isValid = true
            if (isValid === true) {
                dispatch(createPromptlyReportableEvent({ ...formData }))
                .then(data => {
                    if (data.payload.status === 200) {
                        toast.success(data.payload.data.msg, {position: "top-right",autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark"});
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
    const { promptlyReportableEventById, loading, error } = useSelector(
        state => ({
            error: state.admin.error,
            promptlyReportableEventById: state.admin.promptlyReportableEventById,
            loading: state.admin.loading,
        })
    );
    useEffect(() => {
        let data = {protocolId: protocolDetails.protocolId}
        dispatch(fetchPromptlyReportableEventById(data));
    }, [dispatch, userDetails.id]);
    return (
        <Box sx={{ width: '100%' }}>
            <h2 className='ml-20'>Promptly Reportable Event Details ({protocolDetails.protocolId})</h2>
            <Box className='pd-25'>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"/>
                <form onSubmit={handleSubmitData} id="protocol_information">
                    {
                        promptlyReportableEventById && (
                            <>
                                <Form.Group as={Col} controlId="validationFormik01">
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Submitter Type</FormLabel>
                                        <RadioGroup aria-labelledby="demo-row-radio-buttons-group-label" name="submitter_type">
                                            <FormControlLabel value="Sponsor or CRO (Contract Research Organization)" control={<Radio />} label="Sponsor or CRO (Contract Research Organization)" checked={promptlyReportableEventById[0]?.submitter_type === 'Sponsor or CRO (Contract Research Organization)'} />
                                            <FormControlLabel value="Site Management Organization (SMO)" control={<Radio />} label="Site Management Organization (SMO)" checked={promptlyReportableEventById[0]?.submitter_type === 'Site Management Organization (SMO)'} />
                                            <FormControlLabel value="Site" control={<Radio />} label="Site" checked={promptlyReportableEventById[0]?.submitter_type === 'Site'} />
                                        </RadioGroup>
                                    </FormControl>
                                </Form.Group>
                                <h4>PROTOCOL INFORMATION:</h4>
                                <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="IRB Protocol Number *" id="irb_protocol_number" name="irb_protocol_number" defaultValue={promptlyReportableEventById[0]?.irb_protocol_number} />
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="Sponsor Name *" id="sponsor_name" name="sponsor_name" defaultValue={promptlyReportableEventById[0]?.sponsor_name} />
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik01">
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Select the category below that best describes the PRI *</FormLabel>
                                        <RadioGroup aria-labelledby="demo-row-radio-buttons-group-label" name="described_category">
                                            <FormControlLabel value="Audit, Inspection, or inquiry by a federal agency" control={<Radio />} label="Audit, Inspection, or inquiry by a federal agency" checked={promptlyReportableEventById[0]?.described_category === 'Audit, Inspection, or inquiry by a federal agency'} />
                                            <FormControlLabel value="Written report from federal agency (ie: FDA 483)" control={<Radio />} label="Written report from federal agency (ie: FDA 483)" checked={promptlyReportableEventById[0]?.described_category === 'Written report from federal agency (ie: FDA 483)'} />
                                            <FormControlLabel value="State medical board action" control={<Radio />} label="State medical board action" checked={promptlyReportableEventById[0]?.described_category === 'State medical board action'} />
                                            <FormControlLabel value="Hospital medical staff action" control={<Radio />} label="Hospital medical staff action" checked={promptlyReportableEventById[0]?.described_category === 'Hospital medical staff action'} />
                                            <FormControlLabel value="Allegation or finding of non-compliance" control={<Radio />} label="Allegation or finding of non-compliance" checked={promptlyReportableEventById[0]?.described_category === 'Allegation or finding of non-compliance'} />
                                            <FormControlLabel value="Suspension or early termination by the sponsor, investigator, or institution" control={<Radio />} label="Suspension or early termination by the sponsor, investigator, or institution" checked={promptlyReportableEventById[0]?.described_category === 'Suspension or early termination by the sponsor, investigator, or institution'} />
                                            <FormControlLabel value="Incarceration of a subject in a study not approved to involve prisoners" control={<Radio />} label="Incarceration of a subject in a study not approved to involve prisoners" checked={promptlyReportableEventById[0]?.described_category === 'Incarceration of a subject in a study not approved to involve prisoners'} />
                                            <FormControlLabel value="New or increased risk" control={<Radio />} label="New or increased risk" checked={promptlyReportableEventById[0]?.described_category === 'New or increased risk'} />
                                            <FormControlLabel value="Change in financial interest disclosure" control={<Radio />} label="Change in financial interest disclosure" checked={promptlyReportableEventById[0]?.described_category === 'Change in financial interest disclosure'} />
                                            <FormControlLabel value="Protocol deviation that harmed a subject or placed subject at risk of harm" control={<Radio />} label="Protocol deviation that harmed a subject or placed subject at risk of harm" checked={promptlyReportableEventById[0]?.described_category === 'Protocol deviation that harmed a subject or placed subject at risk of harm'} />
                                            <FormControlLabel value="Protocol deviation made without prior IRB approval to eliminate immediate harm to subject" control={<Radio />} label="Protocol deviation made without prior IRB approval to eliminate immediate harm to subject" checked={promptlyReportableEventById[0]?.described_category === 'Protocol deviation made without prior IRB approval to eliminate immediate harm to subject'} />
                                            <FormControlLabel value="Breach of confidentiality" control={<Radio />} label="Breach of confidentiality" checked={promptlyReportableEventById[0]?.described_category === 'Breach of confidentiality'} />
                                            <FormControlLabel value="Subject complaint" control={<Radio />} label="Subject complaint" checked={promptlyReportableEventById[0]?.described_category === 'Subject complaint'} />
                                            <FormControlLabel value="Unanticipated adverse device effect" control={<Radio />} label="Unanticipated adverse device effect" checked={promptlyReportableEventById[0]?.described_category === 'Unanticipated adverse device effect'} />
                                            <FormControlLabel value="Adverse event that requires change to the protocol or consent" control={<Radio />} label="Adverse event that requires change to the protocol or consent" checked={promptlyReportableEventById[0]?.described_category === 'Adverse event that requires change to the protocol or consent'} />
                                            <FormControlLabel value="Adverse event that does NOT require change to the protocol or consent" control={<Radio />} label="Adverse event that does NOT require change to the protocol or consent" checked={promptlyReportableEventById[0]?.described_category === 'Adverse event that does NOT require change to the protocol or consent'} />
                                            <FormControlLabel value="Sponsor/CRO/monitor requests report to IRB" control={<Radio />} label="Sponsor/CRO/monitor requests report to IRB" checked={promptlyReportableEventById[0]?.described_category === 'Sponsor/CRO/monitor requests report to IRB'} />
                                            <FormControlLabel value="Other" control={<Radio />} label="Other" checked={promptlyReportableEventById[0]?.described_category === 'Other'} />
                                        </RadioGroup>
                                    </FormControl>
                                </Form.Group>
                                {
                                    promptlyReportableEventById[0]?.described_category === 'Other' && (
                                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                                <FormLabel id="demo-row-radio-buttons-group-label">Explain *</FormLabel>
                                                <p className='explain_text'>{promptlyReportableEventById[0]?.described_category_explain}</p>
                                            </Box>
                                        </Form.Group>
                                    )
                                }
                                <Form.Group as={Col} controlId="validationFormik02" className='mt-mb-20'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Does this report involve one or more subjects</FormLabel>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="involved_subject">
                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" checked={promptlyReportableEventById[0]?.involved_subject === 'Other'} />
                                            <FormControlLabel value="No" control={<Radio />} label="No" checked={promptlyReportableEventById[0]?.involved_subject === 'Other'} />
                                        </RadioGroup>
                                    </FormControl>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="Date problem discovered *" id="date_problem_discovered" name="date_problem_discovered" defaultValue={moment(promptlyReportableEventById[0]?.date_problem_discovered).format("DD-MM-YYYY")} />
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="Date of occurrence *" id="date_of_occurrence" name="date_of_occurrence" defaultValue={moment(promptlyReportableEventById[0]?.date_of_occurrence).format("DD-MM-YYYY")} />
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="Date reported to sponsor (if applicable)" id="date_reported_to_sponsor" name="date_reported_to_sponsor" defaultValue={moment(promptlyReportableEventById[0]?.date_reported_to_sponsor).format("DD-MM-YYYY")} />
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Describe the problem *</FormLabel>
                                        <p className='explain_text'>{promptlyReportableEventById[0]?.describe_problem}</p>
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Describe the actions already taken to correct the problem *</FormLabel>
                                        <p className='explain_text'>{promptlyReportableEventById[0]?.action_taken}</p>
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Describe the actions you plan to take to correct the problem and prevent recurrence *</FormLabel>
                                        <p className='explain_text'>{promptlyReportableEventById[0]?.plan_action_taken}</p>
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik02" className='mt-mb-20'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Were subject(s) harmed because of this problem</FormLabel>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="subject_harmed">
                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" checked={promptlyReportableEventById[0]?.subject_harmed === 'Yes'} />
                                            <FormControlLabel value="No" control={<Radio />} label="No" checked={promptlyReportableEventById[0]?.subject_harmed === 'No'} />
                                        </RadioGroup>
                                    </FormControl>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik02" className='mt-mb-20'>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Will the protocol be changed because of this problem?</FormLabel>
                                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="protocol_change">
                                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" checked={promptlyReportableEventById[0]?.protocol_change === 'Yes'} />
                                            <FormControlLabel value="No" control={<Radio />} label="No" checked={promptlyReportableEventById[0]?.protocol_change === 'No'} />
                                        </RadioGroup>
                                    </FormControl>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Provide any additional relevant information that was not covered by the above questions *</FormLabel>
                                        <p className='explain_text'>{promptlyReportableEventById[0]?.question_not_covered}</p>
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="Person submitting this form *" id="person_name" name="person_name" defaultValue={promptlyReportableEventById[0]?.person_name} />
                                    </Box>
                                    {errors.person_name && <div className="error">{errors.person_name}</div>}
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="Email *" id="email" name="email" defaultValue={promptlyReportableEventById[0]?.email} />
                                    </Box>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="Phone *" id="phone" name="phone" defaultValue={promptlyReportableEventById[0]?.phone} />
                                    </Box>
                                </Form.Group>
                                <h3>Acknowledgement</h3>
                                <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                                    <FormControl>
                                        <FormGroup>
                                            <FormLabel>- By submitting this form you confirm the following is true and accurate to the best of your knowledge:</FormLabel>
                                            <FormLabel>- The information in this form is accurate and complete</FormLabel>
                                            <FormLabel>- You are an authorized designee to submit this information</FormLabel>
                                            <FormLabel>- The principal investigator has full awareness of the information submitted within this form</FormLabel>
                                        </FormGroup>
                                    </FormControl>
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                                    <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                        <TextField fullWidth disabled label="Your Name *" id="your_name" name="your_name" defaultValue={promptlyReportableEventById[0]?.your_name} />
                                    </Box>
                                    <div className='highlight-text'>Note: Your name above is the equivalent of a hand-written signature and is legally binding. Your signature confirms that you are authorized to submit this document and you acknowledge that it is accurate.</div>
                                    {errors.your_name && <div className="error">{errors.your_name}</div>}
                                </Form.Group>
                                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20' style={{ textAlign: 'right' }}>
                                    <Button variant="contained" color="primary" type="Submit" disabled >
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

export default AdminPromptlyReportableEventDetails












