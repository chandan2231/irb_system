import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form';
import FormControl from '@mui/material/FormControl';
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

const studyInfoSchema = yup.object().shape({
    research_type: yup.string().required("This is required"),
})

function StudyInformationForm() {
    const [showOtherQuestion, setShowOtherQuestion] = React.useState(false);
	const [errors, setErrors] = useState({});
    const [explainErrors, setExplainErrors] = useState();
    
    const [formData, setFormData] = useState({
        research_type: '',
        research_type_explain: '',
    });

    
    const handleSelectResearchType = (event, select_name) => {
        if(event.target.value === 'Other' && select_name === 'research_type'){
            setShowOtherQuestion(true)
        } else {
            setShowOtherQuestion(false)
        }
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };
	
	const handleSubmitData = async (e) => {
        e.preventDefault();
        try {
            const getValidatedform = await studyInfoSchema.validate(formData, {abortEarly: false});
            const isValid = await studyInfoSchema.isValid(getValidatedform)
            if(formData.research_type !== '' && formData.research_type === 'Other' && formData.research_type_explain === ""){
                setExplainErrors('This is required')
                return
            } else {
                setExplainErrors('')
            }
            if(isValid === true){
                const res = await axios.post('http://localhost:8800/api/researchInfo/saveStydyInfo', formData)
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
            setErrors(newErrors);
        }
    };
    
	return (
        <Row>
            <form onSubmit={handleSubmitData}>
                <FormControl sx={{ minWidth: '100%' }} className='mt-mb-20'>
                    <InputLabel id="demo-simple-select-autowidth-label">What type of research study are you submitting *</InputLabel>
                    <Select 
                        autoWidth 
                        labelId="demo-simple-select-autowidth-label" 
                        id="demo-simple-select-autowidth" 
                        value={formData.research_type} 
                        onChange={(event) => handleSelectResearchType(event, 'research_type')}
                        label="What type of research study are you submitting"
                        name="research_type"
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value='Drug/biologic'>Drug/biologic</MenuItem>
                        <MenuItem value='Device'>Device</MenuItem>
                        <MenuItem value='Social/behavioral'>Social/behavioral</MenuItem>
                        <MenuItem value='Food/dietary supplement'>Food/dietary supplement</MenuItem>
                        <MenuItem value='State or local Government'>State or local Government</MenuItem>
                        <MenuItem value='Cosmetic'>Cosmetic</MenuItem>
                        <MenuItem value='Retrospective/chart review'>Retrospective/chart review</MenuItem>
                        <MenuItem value='Other'>Other</MenuItem>
                    </Select>
                    {errors.research_type && <div className="error">{errors.research_type}</div>}
                </FormControl>
                {
                    showOtherQuestion === true && (
                        <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                            <Box sx={{width: '100%', maxWidth: '100%'}}>
                                <TextField  variant="outlined" placeholder="Explain *" name='research_type_explain' fullWidth id='research_type_explain' rows={3} multiline onChange={handleChange} />
                            </Box>
                            {explainErrors && <div className="error">{explainErrors}</div>}
                        </Form.Group>
                    )
                }
                <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20'>
                    <InputLabel id="demo-simple-select-autowidth-label">Upload drug/biologic profile, device profile, food/dietary supplement ingredient list, or cosmetic ingredient list</InputLabel>
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

export default StudyInformationForm
