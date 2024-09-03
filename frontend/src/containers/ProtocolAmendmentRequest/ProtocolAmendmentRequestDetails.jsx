import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Form from 'react-bootstrap/Form';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import * as yup from 'yup'
import Grid from '@mui/material/Grid';
import { createProtocolInformation } from '../../services/ProtocolType/MultiSiteSponsorService';
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { uploadFile } from '../../services/UserManagement/UserService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const protocoalAmendmentSchema = yup.object().shape({
    protocol_number: yup.string().required("This is required"),
    describe_change_request: yup.string().required("This is required"),
    describe_reasoning: yup.string().required("This is required"),
    
})

function ProtocolAmendmentRequestDetails() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const location = useLocation();
    const protocolDetails = location.state.details
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const [showAdditionalQuestionAmendType, setShowAdditionalQuestionAmendType] = React.useState(false);
    const [explainEnrolledTypeErrors, setExplainAmendDocumentErrors] = React.useState();
    const [formData, setFormData] = useState({
        protocol_number: '',
        amend_document: '',
        amend_document_explain: '',
        describe_change_request: '',
        describe_reasoning: '',
        protocol_id: protocolDetails.protocolId,
        created_by: userDetails.id,
    });
    const [errors, setErrors] = useState({});

    const handleAmendDocumentChecked = (event) => {
        const { value, checked } = event.target
        if (checked === true && value === '4') {
            setShowAdditionalQuestionAmendType(true)
        } else if (checked === false && value === '4') {
            setShowAdditionalQuestionAmendType(false)
        }
        let amendDocTypeChecked = [...formData.amend_document];
        if (checked) {
            amendDocTypeChecked.push(value);
        } else {
            amendDocTypeChecked = amendDocTypeChecked.filter(
                (item) => item !== value
            );
        }
        setFormData({ ...formData, amend_document: amendDocTypeChecked });
    }

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmitData = async (e) => {
        e.preventDefault();
        try {
            if (formData.amend_document.includes('4') && formData.amend_document_explain === "") {
                setExplainAmendDocumentErrors('This is required')
                return
            } else {
                setExplainAmendDocumentErrors('')
            }
            const getValidatedform = await protocoalAmendmentSchema.validate(formData, { abortEarly: false });
            const isValid = await protocoalAmendmentSchema.isValid(getValidatedform)
            // const isValid = true
            if (isValid === true) {
                let redlined_document = []
                if (!formData.redlined_document) {
                    return setErrors({ ...errors, ['redlined_document']: 'This is required' });
                }
                else {
                    for (let file of formData.redlined_document) {
                        let id = await uploadFile(file, { protocolId: formData.protocol_id, createdBy: formData.created_by,  protocolType: protocolTypeDetails.researchType, informationType: 'protocol_information', documentName: 'protocol'  })
                        redlined_document.push(id)
                    }
                }
                dispatch(createProtocolInformation({ ...formData, redlined_document }))
                .then(data => {
                    if (data.payload.status === 200) {
                        toast.success(data.payload.data.msg, {position: "top-right",autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark"});
                        setFormData({})
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
    return (
        <Box sx={{ width: '100%' }}>
            <h2 className='ml-20'>Protocol Amendment Request Details ({protocolDetails.protocolId})</h2>
            <Box className='pd-25'>
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"/>
                <form onSubmit={handleSubmitData} id="protocol_information">
                    <Form.Group as={Col} controlId="validationFormik07" className='mt-mb-20'>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <TextField fullWidth label="Protocol number *" id="protocol_number" name="protocol_number" onChange={handleChange} value={formData.protocol_number} />
                        </Box>
                        {errors.protocol_number && <div className="error">{errors.protocol_number}</div>}
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik01">
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">What documents are you wanting to modify or amend?</FormLabel>
                            <FormGroup onChange={(event) => handleAmendDocumentChecked(event)} name="amend_document">
                                <FormControlLabel control={<Checkbox />} value="1" label="Protocol" />
                                <FormControlLabel control={<Checkbox />} value="2" label="Consent form" />
                                <FormControlLabel control={<Checkbox />} value="3" label="Subject facing material" />
                                <FormControlLabel control={<Checkbox />} value="4" label="Other" />
                            </FormGroup>
                        </FormControl>
                    </Form.Group>
                    {
                        showAdditionalQuestionAmendType === true && (
                            <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <TextField variant="outlined" placeholder="Explain *" fullWidth id='amend_document_explain' name="amend_document_explain" rows={3} multiline onChange={handleChange} />
                                </Box>
                                {explainEnrolledTypeErrors && <div className="error">{explainEnrolledTypeErrors}</div>}
                            </Form.Group>
                        )
                    }
                    
                    
                    
                    <Box sx={{ flexGrow: 1 }}>
                        <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20'>
                            
                            <InputLabel id="demo-simple-select-autowidth-label">Upload redlined document(s) here *</InputLabel>
                            
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
                                    name='redlined_document'
                                    onChange={e => {
                                        if (e.target.files && e.target.files.length) {
                                            setFormData({ ...formData, redlined_document: e.target.files });
                                        }
                                    }}
                                />
                            </Button>
                            {errors.redlined_document && <div className="error">{errors.redlined_document}</div>}
                            {formData?.redlined_document !== undefined && Array.from(formData?.redlined_document).map((file, i) => <div key={i}>{file?.name}</div>)}
                            <div className='highlight-text'>Please note: Documents must be in WORD version showing “track changes” </div>
                        </Form.Group>
                        <h3>Summary of changes:</h3>
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <FormLabel id="demo-row-radio-buttons-group-label">Use the text box below to describe the changes requested in full detail *</FormLabel>
                                <TextField variant="outlined" placeholder="Explain" name="describe_change_request" fullWidth id='describe_change_request' rows={5} multiline onChange={handleChange} value={formData.describe_change_request} />
                            </Box>
                            {errors.describe_change_request && <div className="error">{errors.describe_change_request}</div>}
                        </Form.Group>
                        <h3>Rationale for changes:</h3>
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                <FormLabel id="demo-row-radio-buttons-group-label">Use the text box below to describe the reasoning for each of the changes requested *</FormLabel>
                                <TextField variant="outlined" placeholder="Explain" name="describe_reasoning" fullWidth id='describe_reasoning' rows={5} multiline onChange={handleChange} value={formData.describe_reasoning} />
                            </Box>
                            {errors.describe_reasoning && <div className="error">{errors.describe_reasoning}</div>}
                        </Form.Group>
                    </Box>
                    <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20' style={{ textAlign: 'right' }}>
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
            </Box>
        </Box>
    )
}

export default ProtocolAmendmentRequestDetails












