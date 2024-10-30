import React, { useEffect, useState } from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { createMultiSiteSubmission, getMultiSiteSavedProtocolType } from '../../../../services/ProtocolType/MultiSiteSponsorService';
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StarBorder from '@mui/icons-material/StarBorder';


function SubmissionForm({ protocolTypeDetails, protocolDetailsById }) {
    const dispatch = useDispatch();
    const userDetails = JSON.parse(localStorage.getItem('user'));
    const [termsSelected, setTermsSelected] = React.useState(false);
    const [formData, setFormData] = useState({
        protocol_id: protocolTypeDetails.protocolId,
        protocol_type: protocolTypeDetails.researchType,
        created_by: userDetails.id,
    })

    // useEffect(() => {
    //     let data = { protocolId: protocolTypeDetails?.protocolId, protocolType: protocolTypeDetails?.researchType }
    //     dispatch(getMultiSiteSavedProtocolType(data));
    // }, [dispatch, userDetails.id]);

    // const { getAllMultiSiteSavedProtocolType, loading, error } = useSelector(
    //     state => ({
    //         error: state.multiSiteSponsor.error,
    //         getAllMultiSiteSavedProtocolType: state.multiSiteSponsor.getAllMultiSiteSavedProtocolType,
    //         loading: state.multiSiteSponsor.loading,
    //     })
    // );
    // getAllMultiSiteSavedProtocolType && getAllMultiSiteSavedProtocolType.map((formList) => {
    //     if (formList.filled === false) {
    //         notSavedForm.push(formList.form)
    //     }
    // });
    const notSavedForm = []

    const handleFinalSubmissionTearmChecked = (event) => {
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
            if (notSavedForm.length >= 0) {
                toast.error('Befor final submission you have to fill protocol information', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark" });
            } else if (notSavedForm.length <= 0) {
                const isValid = true
                if (isValid === true) {
                    dispatch(createMultiSiteSubmission({ ...formData }))
                        .then(data => {
                            if (data.payload.status === 200) {
                                toast.success(data.payload.data.msg, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark" });
                                setFormData({})
                            }
                        })
                }
            }
        } catch (error) {
        }
    }

    const titleCase = (str) => {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
            <Row>
                {
                    notSavedForm.length > 0 && (
                        <List
                            sx={{ width: '100%', maxWidth: '50%', bgcolor: 'background.paper' }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={<ListSubheader component="div" id="nested-list-subheader" style={{ fontSize: '18px', color: 'red' }}>Befor final submission you have to fill the below forms</ListSubheader>}
                        >
                            {notSavedForm.map((showForm) => {
                                return (
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <StarBorder />
                                        </ListItemIcon>
                                        <ListItemText primary={titleCase(showForm.replaceAll("_", ' '))} />
                                    </ListItemButton>
                                )
                            })}
                        </List>
                    )
                }
                <form onSubmit={handleSubmitData}>
                    <Form.Group as={Col} controlId="validationFormik01" className='ul-list'>

                        <p>By submitting this application you attest to the following:</p>
                        <ul>
                            <li>Research will not commence prior to receiving the IRB approval letter.</li>
                            <li>The sponsor will conduct regular reviews of the sites and the principal investigators to ensure ethical conduct of the study and data integrity.</li>
                            <li>The sponsor ensures that all persons involved in conducting the study are trained and have proper credentialing for conducting research.</li>
                            <li>Only the most current IRB-approved consent form will be used to enroll subjects.</li>
                            <li>No changes will be made to the research protocol, consents forms, and all patient-facing materials without the approval of the IRB </li>
                            <li>The study procedures will comply with all applicable laws and regulations regarding the conduct of research</li>
                            <li>All findings from the study, during and/or after study completion that directly affect subject safety will be communicated to subjects and to this IRB</li>
                            <li>All findings from the study, during and/or after study completion that could influence the conduct of the study, alter the IRB’s approval of the study, or influence subjects willingness to participate or continue participating in the study will be reported to this IRB</li>
                            <li>It is the sponsor’s responsibility to ensure that manufacturing and formulation of investigational products adhere to federal regulations.</li>
                            <li>The sponsor agrees to submit and provide payment to this IRB for annual review yearly including payment for all sites that will be submitting to this IRB</li>
                        </ul>
                    </Form.Group>
                    <Form.Group as={Col} controlId="validationFormik01">
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
                            <FormGroup onChange={event => handleFinalSubmissionTearmChecked(event)}>
                                <FormControlLabel control={<Checkbox />} label="Your initials below signify that you have read and agree to the terms listed above" />
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
                            SUBMIT
                        </Button>
                    </Form.Group>
                </form>
            </Row>
        </>
    )
}

export default SubmissionForm

