import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import { Box, TextField } from "@mui/material";

function SubmissionForm({ type }) {
  const [termsSelected, setTermsSelected] = React.useState(false);
  const initialValues = {
    notificationName: "",
  };
  const [name, setName] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [checkForTerms, setCheckForTerms] = useState(false);

  const handleSubmitData = (values) => {
    let stopCall = false;
    console.log("stopCall", stopCall);
    // return;
    if (!stopCall) {
      setTimeout(() => {
        let isConfirmed = window.confirm(
          "Are you sure you want to submit the notification?"
        );
        if (isConfirmed && !stopCall) {
          //dispatch(submitNotificationDetails(formData))
        }
      }, 1000);
    }
  };

  const handleFinalSubmissionTearmChecked = (event) => {
    const { checked } = event.target;
    if (checked === true) {
      setTermsSelected(true);
    } else if (checked === false) {
      setTermsSelected(false);
    }
  };

  const handleCheckForTerms = (event) => {
    setCheckForTerms(event.target.checked);
  }

  // Validate form fields
  useEffect(() => {
    const isFormValid =
      termsSelected &&
      checkForTerms &&
      name.trim() !== ""

    setIsButtonDisabled(!isFormValid);
  }, [termsSelected, checkForTerms, name]);

  return (
    <>
      <Row>
        <form onSubmit={handleSubmitData}>
          <Form.Group
            as={Col}
            controlId="validationFormik01"
            className="ul-list"
          >
            <p>By submitting this application you attest to the following:</p>
            <ul>
              {[
                " The document review request is not an approval of research or protocol.",
                "The expert opinions in articles or reviews are those of the author and not the organization. The review of documents cannot cover all potential ethical/ legal issues that may arise without complete information of the research protocol.",
                "Your initial below certifies that you have read and agree to the research compliance terms listed in above protocol application..",
              ].map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </Form.Group>
          <Form.Group as={Col} controlId="validationFormik01">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
              <FormGroup
                onChange={(event) => handleFinalSubmissionTearmChecked(event)}
              >
                <FormControlLabel
                  control={<Checkbox />}
                  label="Your initial below certifies that you have read and agree to the research compliance terms listed in above protocol application."
                />
              </FormGroup>
            </FormControl>
          </Form.Group>

          {/* Checkbox to confirm terms */}
          <Form.Group as={Col} controlId="validationFormik02">
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
              <FormGroup onChange={
                handleCheckForTerms
              }>
                <FormControlLabel
                  control={<Checkbox />}
                  checked={
                    checkForTerms
                  }
                  label="I acknowledge that process payment for protocol approval submission is non-refundable."
                />
              </FormGroup>
            </FormControl>
          </Form.Group>


          {/* Text box for enter name */}
          <Form.Group as={Col} controlId="validationFormik02">
            <Box sx={{ width: "100%", maxWidth: "100%" }}>
              <TextField
                fullWidth
                label="Enter Name"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
          </Form.Group>

          {type !== "member" && (
            <Form.Group
              as={Col}
              controlId="validationFormik010"
              className="mt-mb-20"
              style={{ textAlign: "right" }}
            >
              {/* <Button
                variant="contained"
                color="primary"
                type="Submit"
              >
                SUBMIT
              </Button> */}
            </Form.Group>
          )}
        </form>
      </Row>
    </>
  );
}

export default SubmissionForm;
