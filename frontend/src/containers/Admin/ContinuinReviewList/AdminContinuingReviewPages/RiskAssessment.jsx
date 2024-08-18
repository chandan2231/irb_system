import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
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
import { riskAssessmentSave } from '../../../../services/ContinuinReview/ContinuinReviewService';
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

const riskAssessmentSchema = yup.object().shape({
    irb_report: yup.string().required("This is required"),
    irb_report_explain: yup.string().when('irb_report', {
        is: 'Yes',
        then: (schema) => schema.required("This is required"),
        otherwise: (schema) => schema,
    }),
    criteria_report: yup.string().required("This is required"),
    criteria_report_explain: yup.string().when('criteria_report', {
        is: 'Yes',
        then: (schema) => schema.required("This is required"),
        otherwise: (schema) => schema,
    }),
})

function RiskAssessment({continuinReviewDetails}) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const [showAdditionalQuestionIrbReport, setShowAdditionalQuestionIrbReport] = React.useState(false);
    const [showAdditionalQuestionCriteriaReport, setShowAdditionalQuestionCriteriaReport] = React.useState(false);
    const [formData, setFormData] = useState({
        irb_report: '',
        criteria_report: '',
        irb_report_explain: '',
        criteria_report_explain: '',
        protocol_id: continuinReviewDetails.protocolId,
        created_by: userDetails.id,
    });
    const [errors, setErrors] = useState({});

    const handleRadioButtonIRBReport = (event, radio_name) => {
        if (radio_name === 'irb_report' && event.target.value === 'Yes') {
			setShowAdditionalQuestionIrbReport(true)
		} else if (radio_name === 'irb_report' && event.target.value === 'No') {
			setShowAdditionalQuestionIrbReport(false)
		}
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
	}
    const handleRadioButtonCriteriaReport = (event, radio_name) => {
        if (radio_name === 'criteria_report' && event.target.value === 'Yes') {
			setShowAdditionalQuestionCriteriaReport(true)
		} else if (radio_name === 'criteria_report' && event.target.value === 'No') {
			setShowAdditionalQuestionCriteriaReport(false)
		}
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
	}

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmitData = async (e) => {
        e.preventDefault();
        try {
            const getValidatedform = await riskAssessmentSchema.validate(formData, {abortEarly: false});
            const isValid = await riskAssessmentSchema.isValid(getValidatedform)
            console.log('formData', formData)
            if(isValid === true){
                dispatch(riskAssessmentSave(formData))
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

	return (
        <Row>
            <form onSubmit={handleSubmitData}>
                <h4>Question 1</h4>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Since the date of the last approval, has any regulatory agency including, but not limited to, the sponsor, statistical agency, medical monitor, data safety monitoring board (DSMB), or a data monitoring committee (DMC) provided any correspondence that has not yet been reported to the IRB?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="irb_report" onChange={(event) => handleRadioButtonIRBReport(event, 'irb_report')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                        {errors.irb_report && <div className="error">{errors.irb_report}</div>}
                    </FormControl>
                </Form.Group>
                {
                    showAdditionalQuestionIrbReport === true && (
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{width: '100%', maxWidth: '100%'}}>
                                <TextField  variant="outlined" placeholder="Explain *" fullWidth name="irb_report_explain" id='explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.irb_report_explain && <div className="error">{errors.irb_report_explain}</div>}
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20'>
                    <InputLabel id="demo-simple-select-autowidth-label" className='mt-mb-10'>Upload supporting documents *</InputLabel>
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
                <h4>Question 2</h4>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Since the date of the last approval, have you encountered any unanticipated problems? Unanticipated problems involve risks to subjects or others and include any incident, experience, or outcome that meets all of the following criteria: </FormLabel>
                        <FormLabel id="demo-row-radio-buttons-group-label" style={{marginTop: '15px'}}>1. is unexpected (in terms of nature, severity, or frequency) given (a) the research procedures that are described in the protocol-related documents, such as the IRB-approved research protocol and informed consent document; and (b) the characteristics of the subject population being studied:</FormLabel>
                        <FormLabel id="demo-row-radio-buttons-group-label" style={{marginTop: '15px'}}>2. is related or possibly related to a subject’s participation in the research; and</FormLabel>
                        <FormLabel id="demo-row-radio-buttons-group-label" style={{marginTop: '15px'}}>3. suggests that the research places subjects or others at a greater risk of harm (including physical, psychological, economic, or social harm) related to the research than was previously known or recognized.</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="criteria_report" onChange={(event) => handleRadioButtonCriteriaReport(event, 'criteria_report')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                        {errors.criteria_report && <div className="error">{errors.criteria_report}</div>}
                    </FormControl>
                </Form.Group>
                {
                    showAdditionalQuestionCriteriaReport === true && (
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{width: '100%', maxWidth: '100%'}}>
                                <TextField  variant="outlined" placeholder="Explain *" fullWidth name="criteria_report_explain" id='explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.criteria_report_explain && <div className="error">{errors.criteria_report_explain}</div>}
                        </Form.Group>
                    )
                }
                
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20' style={{textAlign: 'right'}}>
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

export default RiskAssessment
