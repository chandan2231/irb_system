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
import { informedConsentSave } from '../../../services/ContinuinReview/ContinuinReviewService';
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

const investigatorInfoSchema = yup.object().shape({
    icf_version: yup.string().required("This is required"),
    performing_consent: yup.string().required("This is required"),
    challenges_faced: yup.string().required("This is required"),
    challenges_faced_explain: yup.string().when('challenges_faced', {
        is: 'Yes',
        then: (schema) => schema.required("This is required"),
        otherwise: (schema) => schema,
    }),
    changes_consent: yup.string().required("This is required"),
    changes_consent_explain: yup.string().when('changes_consent', {
        is: 'Yes',
        then: (schema) => schema.required("This is required"),
        otherwise: (schema) => schema,
    }),
    ensuring_list: yup.string().required("This is required"),
    ensuring_list_explain: yup.string().when('ensuring_list', {
        is: 'Yes',
        then: (schema) => schema.required("This is required"),
        otherwise: (schema) => schema,
    }),

})

function InformedConsentProcess({continuinReviewDetails}) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const [showAdditionalQuestionChallengesFaced, setShowAdditionalQuestionChallengesFaced] = React.useState(false);
    const [showAdditionalQuestionChangeConsent, setShowAdditionalQuestionChangeConsent] = React.useState(false);
    const [showAdditionalQuestionEnsuringList, setShowAdditionalQuestionEnsuringList] = React.useState(false);
    const [formData, setFormData] = useState({
        icf_version: '',
        performing_consent: '',
        challenges_faced: '',
        challenges_faced_explain: '',
        changes_consent: '',
        changes_consent_explain: '',
        ensuring_list: '',
        ensuring_list_explain: '',
        protocol_id: continuinReviewDetails.protocolId,
        created_by: userDetails.id,
    });
    const [errors, setErrors] = useState({});

    const handleChallengesFaced = (event, radio_name) => {
        if (radio_name === "challenges_faced" && event.target.value === 'Yes') {
			setShowAdditionalQuestionChallengesFaced(true)
		} else if (radio_name === "challenges_faced" && event.target.value === 'No') {
			setShowAdditionalQuestionChallengesFaced(false)
		}
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
	}

    const handleChangeConsent = (event, radio_name) => {
        if (radio_name === "changes_consent" && event.target.value === 'Yes') {
			setShowAdditionalQuestionChangeConsent(true)
		} else if (radio_name === "changes_consent" && event.target.value === 'No') {
			setShowAdditionalQuestionChangeConsent(false)
		}
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
	}


    const handleRadioButtonEnsuringList = (event, radio_name) => {
        if (radio_name === 'ensuring_list' && event.target.value === 'Yes') {
			setShowAdditionalQuestionEnsuringList(true)
		} else if (radio_name === 'ensuring_list' && event.target.value === 'No') {
			setShowAdditionalQuestionEnsuringList(false)
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
            const getValidatedform = await investigatorInfoSchema.validate(formData, {abortEarly: false});
            const isValid = await investigatorInfoSchema.isValid(getValidatedform)
            console.log('formData', formData)
            if(isValid === true){
                dispatch(informedConsentSave(formData))
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
    };
	return (
        <Row>
            <form onSubmit={handleSubmitData}>
                <h4>Question 1</h4>
                <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="Which version of the ICF are you currently using? *" id="icf_version" name="icf_version" onChange={handleChange} />
                    </Box>
                    {errors.icf_version && <div className="error">{errors.icf_version}</div>}
                </Form.Group>
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20'>
                    <InputLabel id="demo-simple-select-autowidth-label" className='mt-mb-10'>Upload the most recent ICF *</InputLabel>
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
                <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                    <Box sx={{width: '100%', maxWidth: '100%'}}>
                        <TextField fullWidth label="Who is performing the informed consent at your site? *" id="performing_consent" name="performing_consent" onChange={handleChange} />
                    </Box>
                    {errors.performing_consent && <div className="error">{errors.performing_consent}</div>}
                </Form.Group>
                <h4>Question 3</h4>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Have there been any challenges faced to the consenting process?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="challenges_faced" onChange={(event) => handleChallengesFaced(event, 'challenges_faced')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                        {errors.challenges_faced && <div className="error">{errors.challenges_faced}</div>}
                    </FormControl>
                </Form.Group>
                {
                    showAdditionalQuestionChallengesFaced === true && (
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{width: '100%', maxWidth: '100%'}}>
                                <TextField  variant="outlined" placeholder="Explain *" fullWidth name="challenges_faced_explain" id='explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.challenges_faced_explain && <div className="error">{errors.challenges_faced_explain}</div>}
                        </Form.Group>
                    )
                }
                <h4>Question 4</h4>
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Have there been any changes to the consent form that have not been reported to the IRB?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="changes_consent" onChange={(event) => handleChangeConsent(event, 'changes_consent')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                        {errors.changes_consent && <div className="error">{errors.changes_consent}</div>}
                    </FormControl>
                </Form.Group>
                {
                    showAdditionalQuestionChangeConsent === true && (
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{width: '100%', maxWidth: '100%'}}>
                                <TextField  variant="outlined" placeholder="Explain *" fullWidth name="changes_consent_explain" id='explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.changes_consent_explain && <div className="error">{errors.changes_consent_explain}</div>}
                        </Form.Group>
                    )
                }
                <h4>Question 5</h4>
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20'>
                    <InputLabel id="demo-simple-select-autowidth-label" className='mt-mb-10'>Upload new informed consent form here *</InputLabel>
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
                <Form.Group as={Col} controlId="validationFormik01">
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Are you ensuring that:</FormLabel>
                        <FormLabel id="demo-row-radio-buttons-group-label" style={{marginTop: '15px'}}>1. The participants are made aware that their participation is voluntary and that they may choose to withdraw at any time?</FormLabel>
                        <FormLabel id="demo-row-radio-buttons-group-label" style={{marginTop: '15px'}}>2. The participants are provided with a copy of the informed consent form to take home?</FormLabel>
                        <FormLabel id="demo-row-radio-buttons-group-label" style={{marginTop: '15px'}}>3. The participants are provided with the most up-to-date contact information for study staff?</FormLabel>
                        <FormLabel id="demo-row-radio-buttons-group-label" style={{marginTop: '15px'}}>4. The investigator is providing the most current information regarding the study that may affect the participants’ willingness to participate in the study? </FormLabel>
                        <FormLabel id="demo-row-radio-buttons-group-label" style={{marginTop: '15px'}}>5. All participants have been consented or re-consented, where necessary, with the most current approved informed consent form?</FormLabel>
                        <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="ensuring_list" onChange={(event) => handleRadioButtonEnsuringList(event, 'ensuring_list')}>
                            <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="No" control={<Radio />} label="No" />
                        </RadioGroup>
                        {errors.ensuring_list && <div className="error">{errors.ensuring_list}</div>}
                    </FormControl>
                </Form.Group>
                {
                    showAdditionalQuestionEnsuringList === true && (
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{width: '100%', maxWidth: '100%'}}>
                                <TextField  variant="outlined" placeholder="Explain *" fullWidth name="ensuring_list_explain" id='explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {errors.ensuring_list_explain && <div className="error">{errors.ensuring_list_explain}</div>}
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

export default InformedConsentProcess