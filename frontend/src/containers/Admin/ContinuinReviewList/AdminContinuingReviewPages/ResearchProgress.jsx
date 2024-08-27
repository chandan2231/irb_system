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
import { researchProcessSave } from '../../../../services/ContinuinReview/ContinuinReviewService';
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {useSearchParams, useNavigate, Link} from 'react-router-dom';

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

function ResearchProgress({continuinReviewDetails, researchProgressDetails}) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const [formData, setFormData] = useState({
        subjects_enrolled: '',
        discontinued_subjects: '',
        sub_withdrew: '',
        withdrawal_reason_explain: '',
        sub_terminated_before_completion: '',
        termination_reason_explain: '',
        occured_adverse_event: '',
        adverse_event_submission: '',
        adverse_event_not_reported_explain: '',
        adverse_event_explain: '',
        subjecte_completed: '',
        last_approval_change: '',
        last_approval_change_report: '',
        changes_not_reported_to_irb: '',
        protocol_id: continuinReviewDetails.protocolId,
        created_by: userDetails.id,
    });
    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmitData = async (e) => {
        e.preventDefault();
        try {
            const getValidatedform = await researchProcessSchema.validate(formData, {abortEarly: false});
            const isValid = await researchProcessSchema.isValid(getValidatedform)
            console.log('formData', formData)
            if(isValid === true){
                dispatch(researchProcessSave(formData))
                .then(data=> {
                    if(data.payload.status === 200){
                    } else {   
                    }
                })
            }
        } catch (error) {
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }
    }

    console.log('researchProgressDetails', researchProgressDetails)
	return (
        <Row>
            <form onSubmit={handleSubmitData}>
                <h4>Question 1</h4>
                <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="Total Subjects Enrolled *" id="subjects_enrolled" name="subjects_enrolled" value={researchProgressDetails?.subjects_enrolled} />
                    </Box>
                </Form.Group>
                <h4>Question 2</h4>
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="How many subjects have discontinued their participation? *" id="discontinued_subjects" name="discontinued_subjects" value={researchProgressDetails?.discontinued_subjects} />
                    </Box>
                </Form.Group>
                <div style={{marginLeft: '0px'}}>
                    <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                        <Box sx={{width: '100%', maxWidth: '100%'}}>
                            <TextField fullWidth label="Out of that number, how many subjects withdrew of their own accord *" id="sub_withdrew" name="sub_withdrew" value={researchProgressDetails?.sub_withdrew} />
                        </Box>
                    </Form.Group>
                    {
                        researchProgressDetails?.sub_withdrew >= 1 && (
                            <div className='mt-mb-20'>
                                <FormLabel>Describe the reasons for withdrawal *</FormLabel>
                                <h4>{researchProgressDetails?.withdrawal_reason_explain}</h4>
                            </div>
                        )
                    }
                    <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                        <Box sx={{width: '100%', maxWidth: '100%'}}>
                            <TextField fullWidth label="how many subjects were terminated before completion of the protocol by the decision of the PI, Sponsor, or other contracted research personnel *" id="sub_terminated_before_completion" name="sub_terminated_before_completion" value={researchProgressDetails?.sub_terminated_before_completion} />
                        </Box>
                    </Form.Group>
                    {
                        researchProgressDetails?.sub_terminated_before_completion >= 1 && (
                            <div className='mt-mb-20'>
                                <FormLabel>Describe the reasons for termination *</FormLabel>
                                <h4>{researchProgressDetails?.termination_reason_explain}</h4>
                            </div>
                        )
                    }
                </div>
                <h4>Question 3</h4>
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="How many adverse events have occurred since the last approval?*" id="occured_adverse_event" name="occured_adverse_event" value={researchProgressDetails?.occured_adverse_event} />
                    </Box>
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Have these adverse events been submitted to the IRB?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="adverse_event_submission">
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" checked={researchProgressDetails?.adverse_event_submission === 'Yes'} />
                            <FormControlLabel value="No" control={<Radio />} label="No" checked={researchProgressDetails?.adverse_event_submission === 'No'} />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    researchProgressDetails?.adverse_event_submission === 'No'  && (
                        <>
                            <div className='mt-mb-20'>
                                <FormLabel>What was the reason the adverse events were not reported to the IRB?*</FormLabel>
                                <h4>{researchProgressDetails?.adverse_event_not_reported_explain}</h4>
                            </div>
                            <div className='mt-mb-20'>
                                <FormLabel>Please describe the adverse events including what occurred, the timeline in which it occurred, and the time at which the study personnel became aware of the adverse event*</FormLabel>
                                <h4>{researchProgressDetails?.adverse_event_explain}</h4>
                            </div>
                            
                            <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20'>
                                <InputLabel id="demo-simple-select-autowidth-label" className='mt-mb-10'>Upload any supporting documents</InputLabel>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Upload file
                                    <VisuallyHiddenInput type="file" />
                                </Button>
                            </Form.Group>
                        </>
                    )
                }
                <h4>Question 4</h4>
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="How many subject have completed the study per protocol?*" id="subjecte_completed" name="subjecte_completed" value={researchProgressDetails?.subjecte_completed} />
                    </Box>
                </Form.Group>
                <h4>Question 5</h4>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Have there been any updates/changes to the protocol since the last approval?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="last_approval_change">
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" checked={researchProgressDetails?.last_approval_change === 'Yes'} />
                            <FormControlLabel value="No" control={<Radio />} label="No" checked={researchProgressDetails?.last_approval_change === 'No'} />
                        </RadioGroup>
                    </FormControl>
                </Form.Group>
                {
                    researchProgressDetails?.last_approval_change === 'Yes' && (
                        <Form.Group as={Col} controlId="validationFormik01">
                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Have these changes been reported to the IRB?</FormLabel>
                                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="last_approval_change_report">
                                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" checked={researchProgressDetails?.last_approval_change_report === 'Yes'} />
                                    <FormControlLabel value="No" control={<Radio />} label="No" checked={researchProgressDetails?.last_approval_change_report === 'No'} />
                                </RadioGroup>
                            </FormControl>
                        </Form.Group>
                    )
                }
                {
                    researchProgressDetails?.last_approval_change_report === 'No' && (
                        <div className='mt-mb-20'>
                            <FormLabel>What is the reason the changes have not reported to the IRB?*</FormLabel>
                            <h4>{researchProgressDetails?.changes_not_reported_to_irb}</h4>
                        </div>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20' style={{textAlign: 'right'}}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="Submit"
                        disabled
                    >
                        SAVE AND CONTINUE
                    </Button>
                </Form.Group>
            </form>
        </Row>
	)
}

export default ResearchProgress
