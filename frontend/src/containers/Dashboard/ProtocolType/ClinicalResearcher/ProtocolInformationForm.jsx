import React, { useEffect, useState } from 'react'
import {useNavigate } from "react-router-dom";
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Form from 'react-bootstrap/Form';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
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

const protocoalInfoSchema = yup.object().shape({
    first_time_protocol: yup.string().required("This is required"),
    protocol_title: yup.string().required("This is required"),
    protocol_number: yup.string().required("This is required"),
    sponsor: yup.string().required("This is required"),
    study_duration: yup.string().required("This is required"),
    funding_source: yup.string().required("This is required"),
})

function ProtocolInformationForm() {
    // const navigate = useNavigate();
    const [showAdditionalQuestion, setShowAdditionalQuestion] = React.useState(false);
    const [showDisapproveAdditionTextArea, setShowDisapproveAdditionTextArea] = React.useState(false);
    const [showOversiteAdditionTextArea, setShowOversiteAdditionTextArea] = React.useState(false);
    const [formData, setFormData] = useState({
        first_time_protocol: '',
        protocol_title: '',
        protocol_number: '',
        sponsor: '',
        study_duration: '',
        funding_source: '',
        disapproved_or_withdrawn: '',
        disapproved_or_withdrawn_explain: '',
        oversite: '',
        oversite_explain: '',
    });
    const [errors, setErrors] = useState({});

	// const handleSubmitData = async (e) => {
    //     e.preventDefault();
    //     let form = new FormData(e.target);
    //     let formObj = Object.fromEntries(form.entries());
    //     console.log('formObj', formObj)
    //     const isValid = await protocoalInfoSchema.isValid(formObj)
    //     console.log('isValid', isValid)
    //     console.log('formObj', formObj)
    //     return;
    //      let stopCall = false
    //      console.log('stopCall', stopCall)
    //      return;
    //      if (!stopCall) {
    // 	        setTimeout(() => {
    // 		        let isConfirmed = window.confirm(
    // 			        'Are you sure you want to submit the notification?'
    // 		        )
    // 		        if (isConfirmed && !stopCall) {
    // 			        dispatch(submitNotificationDetails(formData))
    // 		        }
    // 	        }, 1000)
    //      }
	// }

    const handleRadioButtonSelectFirstTime = (event, radio_name) => {
        if (radio_name === 'first_time_protocol' && event.target.value === 'No') {
			setShowAdditionalQuestion(true)
		} else if (radio_name === 'first_time_protocol' && event.target.value === 'Yes') {
			setShowAdditionalQuestion(false)
            setShowDisapproveAdditionTextArea(false)
		}
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
	}

    const handleRadioButtonSelectDisapproved = (event, radio_name) => {
        if (radio_name === 'disapproved_or_withdrawn' && event.target.value === 'Yes') {
			setShowDisapproveAdditionTextArea(true)
		} else if (radio_name === 'disapproved_or_withdrawn' && event.target.value === 'No') {
			setShowDisapproveAdditionTextArea(false)
		}
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
	}

    const handleRadioButtonSelectOversite = (event, radio_name) => {
        if (radio_name === 'oversite' && event.target.value === 'Yes') {
			setShowOversiteAdditionTextArea(true)
		} else if (radio_name === 'oversite' && event.target.value === 'No') {
			setShowOversiteAdditionTextArea(false)
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
            const getValidatedform = await protocoalInfoSchema.validate(formData, {abortEarly: false});
            const isValid = await protocoalInfoSchema.isValid(getValidatedform)
            if(isValid === true){
                const res = await axios.post('http://localhost:8800/api/researchInfo/saveProtocolInfo', formData)
                console.log('res', res)
                if(res.status===200){
                    //navigate('/login')
                }
            }
        } catch (error) {
            const newErrors = {};
            error.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            if(formData.disapproved_or_withdrawn !== '' && formData.disapproved_or_withdrawn === 'Yes' && formData.disapproved_or_withdrawn_explain === ""){
                newErrors['disapproved_or_withdrawn_explain_error'] = 'This is required';
            } else {
                newErrors['disapproved_or_withdrawn_explain_error'] = '';
            }
            if(formData.oversite !== '' && formData.oversite === 'Yes' && formData.oversite_explain === ""){
                newErrors['oversite_explain_error'] = 'This is required';
            } else {
                newErrors['oversite_explain_error'] = '';
            }
            setErrors(newErrors);
        }
    };

    // const handleCheckboxChange = (e) => {
    //     const {name, checked} = e.target;
    //     let updatedInterests = [...formData.interests];
    //     if (checked) {
    //       updatedInterests.push(name);
    //     } else {
    //       updatedInterests = updatedInterests.filter(
    //         (interest) => interest !== name
    //       );
    //     }
    //     setFormData({...formData, interests: updatedInterests});
    // };

    

	return (
        <Row>
            <form onSubmit={handleSubmitData}>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Are you submitting this protocol for the first time? *</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="first_time_protocol" onChange={(event) => handleRadioButtonSelectFirstTime(event, 'first_time_protocol')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                    {errors.first_time_protocol && <div className="error">{errors.first_time_protocol}</div>}
                </Form.Group>
                {
                    showAdditionalQuestion === true && (
                        <>                                    
                            <Form.Group as={Col} controlId="validationFormik02">
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
                                        <Box sx={{width: '100%', maxWidth: '100%'}}>
                                            <TextField  variant="outlined" placeholder="Explain" name="disapproved_or_withdrawn_explain" fullWidth id='explain' rows={3} multiline onChange={handleChange} value={formData.disapproved_or_withdrawn_explain} />
                                        </Box>
                                        {errors.disapproved_or_withdrawn_explain_error && <div className="error">{errors.disapproved_or_withdrawn_explain_error}</div>}
                                    </Form.Group>
                                )
                            }
                            <Form.Group as={Col} controlId="validationFormik04">
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
                                        <Box sx={{width: '100%', maxWidth: '100%'}}>
                                            <TextField  variant="outlined" placeholder="Explain" name="oversite_explain" fullWidth id='explain' rows={3} multiline onChange={handleChange} value={formData.oversite_explain} />
                                        </Box>
                                        {errors.oversite_explain_error && <div className="error">{errors.oversite_explain_error}</div>}
                                    </Form.Group>
                                )
                            }
                        </>

                    )
                }
                <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="Title of Protocol *" id="protocol_title" name="protocol_title" onChange={handleChange} value={formData.protocol_title} />
                    </Box>
                    {errors.protocol_title && <div className="error">{errors.protocol_title}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="Protocol number *" id="protocol_number" name="protocol_number" onChange={handleChange} value={formData.protocol_number} />
                    </Box>
                    {errors.protocol_number && <div className="error">{errors.protocol_number}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik08" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="Sponsor *" id="sponsor" name="sponsor"  onChange={handleChange} value={formData.sponsor} />
                    </Box>
                    {errors.sponsor && <div className="error">{errors.sponsor}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik09" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="Approximate duration of study *" id="study_duration" name="study_duration" onChange={handleChange} value={formData.study_duration} />
                    </Box>
                    {errors.study_duration && <div className="error">{errors.study_duration}</div>}
                </Form.Group>
                <FormControl sx={{ minWidth: '100%' }} className='mt-mb-20'>
                    <InputLabel id="demo-simple-select-autowidth-label">Funding source *</InputLabel>
                    <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        autoWidth
                        label="Funding source"
                        name="funding_source"
                        value={formData.funding_source} 
                        onChange={handleChange}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value='Self/Investigator-Sponsor/Internally Funded'>Self/Investigator-Sponsor/Internally Funded</MenuItem>
                        <MenuItem value='Industry'>Industry</MenuItem>
                        <MenuItem value='Non-profit organization'>Non-profit organization</MenuItem>
                        <MenuItem value='U.S. Federal Grant'>U.S. Federal Grant</MenuItem>
                        <MenuItem value='State or local Government'>State or local Government</MenuItem>
                        <MenuItem value='No funding'>No funding</MenuItem>
                    </Select>
                    {errors.funding_source && <div className="error">{errors.funding_source}</div>}
                </FormControl>
                <Box sx={{ flexGrow: 1 }}>
                    <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20'>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <InputLabel id="demo-simple-select-autowidth-label">Upload Protocol *</InputLabel>
                            </Grid>
                            <Grid item xs={10}>
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
                            </Grid>
                        </Grid>
                    </Form.Group>
                </Box>
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20' style={{textAlign: 'right'}}>
                    <Button
                        // disabled={!dirty || !isValid}
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

export default ProtocolInformationForm
