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
import { uploadFile } from '../../../../services/UserManagement/UserService';
import { createProtocolProcedures } from '../../../../services/ProtocolType/MultiSiteSponsorService';
import { useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
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


const protocolProcedureInfoSchema = yup.object().shape({
    enrolled_study_type: yup.array().of(yup.string()).required("Please select at least one subject population"),
    enrolled_type_explain: yup.string().when('enrolled_study_type', {
        is: (enrolled_study_type) => enrolled_study_type.includes('20'),
        then: () => yup.string().required("Please explain the subject population"),
        otherwise: () => yup.string().nullable(),
    }),
    enrolled_group: yup.array().of(yup.string()).required("Please select at least one race and ethnic group"),
    enrolled_group_explain: yup.string().when('enrolled_group', {
        is: (enrolled_group) => enrolled_group.includes('9'),
        then: () => yup.string().required("Please explain the race and ethnic group"),
        otherwise: () => yup.string().nullable(),
    }),
    study_excluded: yup.string().required("Please specify if any populations are excluded"),
    study_excluded_explain: yup.string().when('study_excluded', {
        is: () => 'Yes',
        then: () => yup.string().required("Please explain the exclusion criteria"),
        otherwise: () => yup.string().nullable(),
    }),
    enrolled_subject: yup.string().required("Please specify how many subjects will be enrolled"),
    recurement_method: yup.array().of(yup.string()).required("Please select at least one recruitment method"),
    recurement_method_explain: yup.string().when('recurement_method', {
        is: (recurement_method) => recurement_method.includes('10'),
        then: () => yup.string().required("Please explain the recruitment method"),
        otherwise: () => yup.string().nullable(),
    }),
    irb_approval: yup.string().required("Please specify if IRB approval of site-specific templates is required"),
    expected_number_sites: yup.string().required("Please specify the expected number of sites"),
    future_research: yup.string().required("Please specify if samples will be retained for future research"),
    future_research_explain: yup.string().when('future_research', {
        is: () => 'Yes',
        then: () => yup.string().required("Please explain how the samples will be stored and used"),
        otherwise: () => yup.string().nullable(),
    }),
    facing_materials: yup.mixed().required("You must upload at least one recruitment or subject-facing material"),
});



function ProtocolProceduresForm({ protocolTypeDetails, protocolProcedures }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const [showAdditionalQuestionStudyType, setShowAdditionalQuestionStudyType] = React.useState(false);
    const [showAdditionalQuestionRaceAndEthnic, setShowAdditionalQuestionRaceAndEthnic] = React.useState(false);
    const [showStudyExcludedAdditionTextArea, setShowStudyExcludedAdditionTextArea] = React.useState(false);
    const [showAdditionalQuestionRecuritmentMethod, setShowAdditionalQuestionRecuritmentMethod] = React.useState(false);
    const [showFutureResearchAdditionTextArea, setShowFutureResearchAdditionTextArea] = React.useState(false);
    const [termsSelected, setTermsSelected] = React.useState(false);
    const [explainEnrolledTypeErrors, setExplainEnrolledTypeErrors] = React.useState();
    const [explainEnrolledGroupErrors, setExplainEnrolledGroupErrors] = React.useState();
    const [explainRecurementMethodErrors, setExplainRecurementMethodErrors] = React.useState();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        enrolled_study_type: [],
        enrolled_type_explain: '',
        enrolled_group: [],
        enrolled_group_explain: '',
        study_excluded: '',
        study_excluded_explain: '',
        enrolled_subject: '',
        recurement_method: [],
        recurement_method_explain: '',
        irb_approval: '',
        expected_number_sites: '',
        future_research: '',
        future_research_explain: '',
        protocol_id: protocolTypeDetails?.protocolId,
        created_by: userDetails?.id,
        facing_materials: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };



    const handleSbujectStudyChecked = (event) => {
        const { value, checked } = event.target
        if (checked === true && value === '20') {
            setShowAdditionalQuestionStudyType(true)
        } else if (checked === false && value === '20') {
            setShowAdditionalQuestionStudyType(false)
        }
        let updatedStudyTypeChecked = [...formData.enrolled_study_type];
        if (checked) {
            updatedStudyTypeChecked.push(value);
        } else {
            updatedStudyTypeChecked = updatedStudyTypeChecked.filter(
                (item) => item !== value
            );
        }
        setFormData({ ...formData, enrolled_study_type: updatedStudyTypeChecked });
    }

    const handleRaceAndEthnicChecked = (event) => {
        const { value, checked } = event.target
        if (checked === true && value === '9') {
            setShowAdditionalQuestionRaceAndEthnic(true)
        } else if (checked === false && value === '9') {
            setShowAdditionalQuestionRaceAndEthnic(false)
        }
        let updatedGroupsChecked = [...formData.enrolled_group];
        if (checked) {
            updatedGroupsChecked.push(value);
        } else {
            updatedGroupsChecked = updatedGroupsChecked.filter(
                (item) => item !== value
            );
        }
        setFormData({ ...formData, enrolled_group: updatedGroupsChecked });
    }

    const handleRadioButtonStudyExcluded = (event, radio_name) => {
        if (radio_name === 'study_excluded' && event.target.value === 'Yes') {
            setShowStudyExcludedAdditionTextArea(true)
        } else if (radio_name === 'study_excluded' && event.target.value === 'No') {
            setShowStudyExcludedAdditionTextArea(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleRecuritmentMethodChecked = (event) => {
        const { value, checked } = event.target
        if (checked === true && value === '10') {
            setShowAdditionalQuestionRecuritmentMethod(true)
        } else if (checked === false && value === '10') {
            setShowAdditionalQuestionRecuritmentMethod(false)
        }
        let updatedCheckedItem = [...formData.recurement_method];
        if (checked) {
            updatedCheckedItem.push(value);
        } else {
            updatedCheckedItem = updatedCheckedItem.filter(
                (item) => item !== value
            );
        }
        setFormData({ ...formData, recurement_method: updatedCheckedItem });
    }

    const handleRadioButtonIrbApproval = (event, radio_name) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleRadioButtonSelectFutureResearch = (event, radio_name) => {
        if (radio_name === 'future_research' && event.target.value === 'Yes') {
            setShowFutureResearchAdditionTextArea(true)
        } else if (radio_name === 'future_research' && event.target.value === 'No') {
            setShowFutureResearchAdditionTextArea(false)
        }
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleTearmChecked = (event) => {
        const { checked } = event.target
        if (checked === true) {
            setTermsSelected(true)
        } else if (checked === false) {
            setTermsSelected(false)
        }
    }

    const handleSubmitData = async (e) => {
        e.preventDefault();
        try {
            if (formData.enrolled_study_type.includes('20') && formData.enrolled_type_explain === "") {
                setExplainEnrolledTypeErrors('This is required')
                return
            } else {
                setExplainEnrolledTypeErrors('')
            }
            if (formData.enrolled_group.includes('9') && formData.enrolled_group_explain === "") {
                setExplainEnrolledGroupErrors('This is required')
                return
            } else {
                setExplainEnrolledGroupErrors('')
            }
            if (formData.recurement_method.includes('10') && formData.recurement_method_explain === "") {
                setExplainRecurementMethodErrors('This is required')
                return
            } else {
                setExplainRecurementMethodErrors('')
            }

            const getValidatedform = await protocolProcedureInfoSchema.validate(formData, { abortEarly: false });
            const isValid = await protocolProcedureInfoSchema.isValid(getValidatedform)
            if (isValid === true) {
                let facing_materials = []
                if (!formData.facing_materials) {
                    return setErrors({ ...errors, ['facing_materials']: 'This is required' });
                } else {
                    for (let file of formData.facing_materials) {
                        let id = await uploadFile(file, { protocolId: formData.protocol_id, createdBy: formData.created_by, protocolType: protocolTypeDetails.researchType, informationType: 'protocol_procedure', documentName: 'subject_facing_materials' })
                        facing_materials.push(id)
                    }
                }
                dispatch(createProtocolProcedures(formData))
                    .then(data => {
                        if (data.payload.status === 200) {
                            toast.success(data.payload.data.msg, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark" });
                            setFormData({})
                            e.target.reset();
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
    };

    useEffect(() => {
        if (protocolProcedures) {
            setFormData({
                enrolled_study_type: protocolProcedures?.enrolled_study_type?.split(',') || [],
                enrolled_type_explain: protocolProcedures?.enrolled_type_explain || '',
                enrolled_group: protocolProcedures?.enrolled_group?.split(',') || [],
                enrolled_group_explain: protocolProcedures?.enrolled_group_explain || '',
                study_excluded: protocolProcedures?.study_excluded || '',
                study_excluded_explain: protocolProcedures?.study_excluded_explain || '',
                enrolled_subject: protocolProcedures?.enrolled_subject || '',
                recurement_method: protocolProcedures?.recurement_method?.split(',') || [],
                recurement_method_explain: protocolProcedures?.recurement_method_explain || '',
                irb_approval: protocolProcedures?.irb_approval || '',
                expected_number_sites: protocolProcedures?.expected_number_sites || '',
                future_research: protocolProcedures?.future_research || '',
                future_research_explain: protocolProcedures?.future_research_explain || '',
                protocol_id: protocolTypeDetails?.protocolId,
                created_by: userDetails?.id || '',
                facing_materials: protocolProcedures?.documents?.map(doc => ({
                    name: doc.file_name,
                    url: doc.file_url,
                    type: doc.protocol_type,
                })) || [],
            });

            setShowAdditionalQuestionStudyType(protocolProcedures?.enrolled_study_type?.includes('20'));
            setShowAdditionalQuestionRaceAndEthnic(protocolProcedures?.enrolled_group?.includes('9'));
            setShowStudyExcludedAdditionTextArea(protocolProcedures?.study_excluded === 'Yes');
            setShowAdditionalQuestionRecuritmentMethod(protocolProcedures?.recurement_method?.includes('10'));
            setShowFutureResearchAdditionTextArea(protocolProcedures?.future_research === 'Yes');
        }
    }, [protocolProcedures, protocolTypeDetails]);

    console.log('protocolProcedures', {
        protocolProcedures,
        formData
    })

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <Row>
                <form onSubmit={handleSubmitData}>
                    <Form.Group as={Col} controlId="validationFormik01">
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Which subject populations will be enrolled in the study?</FormLabel>
                            <FormGroup onChange={(event) => handleSbujectStudyChecked(event)} name="enrolled_study_type">
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('1')}
                                />} value="1" label="Adults" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('2')}
                                />} value="2" label="Children (17 years and under)" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('3')}
                                />} value="3" label="Blind/Visually Impaired" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('4')}
                                />} value="4" label="Deaf/Hard of Hearing (including sign language communicators)" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('5')}
                                />} value="5" label="Individuals with impaired decision-making (requiring a LAR, including those with impaired or diminished mental capacity, dementia, and those suffering from mental health disorders)" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('6')}
                                />} value="6" label="Educationally Disadvantaged/Impaired or no reading skills" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('7')}
                                />} value="7" label="Economically disadvantaged" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('8')}
                                />} value="8" label="Healthy individuals" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('9')}
                                />} value="9" label="Terminally ill individuals" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('10')}
                                />} value="10" label="HIV positive" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('11')}
                                />} value="11" label="Hospitalized" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('12')}
                                />} value="12" label="Institutionalized (including nursing home, LTAC, assisted living, residential facility, mental hospital)" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('13')}
                                />} value="13" label="Prisoners" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('14')}
                                />} value="14" label="Military Personnel" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('15')}
                                />} value="15" label="Pregnant women" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('16')}
                                />} value="16" label="Human fetuses/neonates" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('17')}
                                />} value="17" label="Non-English speakers" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('18')}
                                />} value="18" label="Women only" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('19')}
                                />} value="19" label="Men only" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_study_type.includes('20')}
                                />} value="20" label="Other" />
                            </FormGroup>
                        </FormControl>
                    </Form.Group>
                    {
                        showAdditionalQuestionStudyType === true && (
                            <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <TextField variant="outlined" placeholder="Explain *" fullWidth id='enrolled_type_explain' name="enrolled_type_explain" rows={3} multiline
                                        value={formData.enrolled_type_explain}
                                        onChange={handleChange} />
                                </Box>
                                {explainEnrolledTypeErrors && <div className="error">{explainEnrolledTypeErrors}</div>}
                            </Form.Group>
                        )
                    }

                    <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label" >Which race and ethnic groups will be enrolled in the study?</FormLabel>
                            <FormGroup onChange={(event) => handleRaceAndEthnicChecked(event)} name="enrolled_group"  >
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_group.includes('1')}
                                />} value="1" label="White, not of Hispanic origin" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_group.includes('2')}
                                />} value="2" label="White, of Hispanic origin" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_group.includes('3')}
                                />} value="3" label="Black, not of Hispanic origin" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_group.includes('4')}
                                />} value="4" label="Black, of Hispanic origin" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_group.includes('5')}
                                />} value="5" label="American Indian/Alaskan Native" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_group.includes('6')}
                                />} value="6" label="Asian" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_group.includes('7')}
                                />} value="7" label="Native Hawaiian/Pacific Islander" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_group.includes('8')}
                                />} value="8" label="Multiracial" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.enrolled_group.includes('9')}
                                />} value="9" label="Other" />
                            </FormGroup>
                        </FormControl>
                    </Form.Group>
                    {
                        showAdditionalQuestionRaceAndEthnic === true && (
                            <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <TextField variant="outlined" placeholder="Explain *" fullWidth id='enrolled_group_explain' name="enrolled_group_explain" rows={3} multiline
                                        value={formData.enrolled_group_explain}
                                        onChange={handleChange} />
                                </Box>
                                {explainEnrolledGroupErrors && <div className="error">{explainEnrolledGroupErrors}</div>}
                            </Form.Group>
                        )
                    }
                    <Form.Group as={Col} controlId="validationFormik01">
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Will any subject populations be excluded from the study?</FormLabel>
                            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="study_excluded"
                                value={formData.study_excluded}
                                onChange={(event) => handleRadioButtonStudyExcluded(event, 'study_excluded')}>
                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Form.Group>
                    {
                        showStudyExcludedAdditionTextArea === true && (
                            <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <TextField variant="outlined" placeholder="Explain *" fullWidth id='study_excluded_explain' name="study_excluded_explain" rows={3} multiline
                                        value={formData.study_excluded_explain}
                                        onChange={handleChange} />
                                </Box>
                                {errors.study_excluded_explain && <div className="error">{errors.study_excluded_explain}</div>}
                            </Form.Group>
                        )
                    }
                    <Form.Group as={Col} controlId="validationFormik06" className='mt-mb-20'>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <TextField fullWidth label="How many subjects will be enrolled in the study? *" id="enrolled_subject" name="enrolled_subject"
                                value={formData.enrolled_subject}
                                onChange={handleChange} />
                        </Box>
                        {errors.enrolled_subject && <div className="error">{errors.enrolled_subject}</div>}
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik01" className='mt-mb-20'>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">What recruitment methods will be used in the study?</FormLabel>
                            <FormGroup onChange={event => handleRecuritmentMethodChecked(event)} name="recurement_method" >
                                <FormControlLabel control={<Checkbox
                                    checked={formData.recurement_method.includes('1')}
                                />} value="1" label="In-person conversation during routine office visits" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.recurement_method.includes('2')}
                                />} value="2" label="Recruiting participants from previous research studies" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.recurement_method.includes('3')}
                                />} value="3" label="Mass print advertisements such as a newspaper, magazine, or billboard" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.recurement_method.includes('4')}
                                />} value="4" label="Flyer, poster, or bulletin board in office" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.recurement_method.includes('5')}
                                />} value="5" label="Radio or television ads" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.recurement_method.includes('6')}
                                />} value="6" label="Direct mail to potential subjects" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.recurement_method.includes('7')}
                                />} value="7" label="Internet including social media recruiting" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.recurement_method.includes('8')}
                                />} value="8" label="Chart review" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.recurement_method.includes('9')}
                                />} value="9" label="Telephone screening" />
                                <FormControlLabel control={<Checkbox
                                    checked={formData.recurement_method.includes('10')}
                                />} value="10" label="Other" />
                            </FormGroup>
                        </FormControl>
                    </Form.Group>
                    {
                        showAdditionalQuestionRecuritmentMethod === true && (
                            <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <TextField variant="outlined" placeholder="Explain *" fullWidth id='recurement_method_explain' name="recurement_method_explain" rows={3} multiline
                                        value={formData.recurement_method_explain}
                                        onChange={handleChange} />
                                </Box>
                                {explainRecurementMethodErrors && <div className="error">{explainRecurementMethodErrors}</div>}
                            </Form.Group>
                        )
                    }
                    <Form.Group as={Col} controlId="validationFormik01">
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Will the sponsor require IRB approval of site-specific templates prior to use?</FormLabel>
                            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="irb_approval"
                                value={formData.irb_approval}
                                onChange={(event) => handleRadioButtonIrbApproval(event, 'irb_approval')}>
                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                        <Box sx={{ width: '100%', maxWidth: '100%' }}>
                            <FormLabel id="demo-row-radio-buttons-group-label">What is the expected number of sites to participate in this study that will be submitted to this IRB *</FormLabel>
                            <TextField variant="outlined" placeholder="" fullWidth name="expected_number_sites" id='expected_number_sites' rows={3} multiline
                                value={formData.expected_number_sites}
                                onChange={handleChange} />
                        </Box>
                        {errors.expected_number_sites && <div className="error">{errors.expected_number_sites}</div>}
                    </Form.Group>

                    <Form.Group as={Col} controlId="validationFormik01">
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Will any samples or data collected in this study be retained for future research?</FormLabel>
                            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="future_research"
                                value={formData.future_research}
                                onChange={(event) => handleRadioButtonSelectFutureResearch(event, 'future_research')}>
                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                <FormControlLabel value="No" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>
                    </Form.Group>

                    {
                        showFutureResearchAdditionTextArea === true && (
                            <Form.Group as={Col} controlId="validationFormik03" className='mt-mb-20'>
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Please explain how the data and/or samples will be stored, secured, and de-identified. Include information on how the data and/or samples might be used for future research: *</FormLabel>
                                    <TextField variant="outlined" placeholder="" fullWidth name="future_research_explain" id='future_research_explain' rows={3} multiline
                                        value={formData.future_research_explain}
                                        onChange={handleChange} />
                                </Box>
                                {errors.future_research_explain && <div className="error">{errors.future_research_explain}</div>}
                            </Form.Group>
                        )
                    }
                    <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20'>
                        <InputLabel id="demo-simple-select-autowidth-label">Upload all recruitment templates and subject-facing materials here *</InputLabel>
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
                                name='facing_materials'
                                onChange={e => {
                                    if (e.target.files && e.target.files.length) {
                                        setFormData({ ...formData, [e.target.name]: e.target.files });
                                    }
                                }}
                                multiple
                            />
                        </Button>
                        {formData?.facing_materials !== undefined && Array.from(formData?.facing_materials)?.map((file, i) => <div key={i}>{file?.name}</div>)}
                        {errors.facing_materials && <div className="error">{errors.facing_materials}</div>}
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik01">
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
                            <FormGroup onChange={event => handleTearmChecked(event)}>
                                <FormControlLabel control={<Checkbox />} label="Your initials below signify that you have read the terms and agree with them" />
                            </FormGroup>
                        </FormControl>
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20' style={{ textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="Submit"
                            disabled={!termsSelected}
                        >
                            SAVE AND CONTINUE
                        </Button>
                    </Form.Group>
                </form>
            </Row>
        </>
    )
}

export default ProtocolProceduresForm
