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



function SubmissionForm() {
    const [termsSelected, setTermsSelected] = React.useState(false);
    const initialValues = {
		notificationName: '',
	}
    
	const handleSubmitData = values => {
		let stopCall = false
		console.log('stopCall', stopCall)
		// return;
		if (!stopCall) {
			setTimeout(() => {
				let isConfirmed = window.confirm(
					'Are you sure you want to submit the notification?'
				)
				if (isConfirmed && !stopCall) {
					//dispatch(submitNotificationDetails(formData))
				}
			}, 1000)
		}
	}

    const handleFinalSubmissionTearmChecked = (event) => {
        const {checked} = event.target
        if(checked === true){
            setTermsSelected(true)
        } else if (checked === false){
            setTermsSelected(false)
        }
    }

	return (
		<>
			<Row>
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
					<Form.Group as={Col} controlId="validationFormik010" className='mt-mb-20' style={{textAlign: 'right'}}>
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

