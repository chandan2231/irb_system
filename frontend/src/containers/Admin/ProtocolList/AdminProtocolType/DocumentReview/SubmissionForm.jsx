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

function SubmissionForm({ type }) {
  const [termsSelected, setTermsSelected] = React.useState(false);
  const initialValues = {
    notificationName: "",
  };

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
                "Your initials below signify that you have read and agree to the terms listed above."
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
                  label="Your initials below signify that you have read and agree to the terms listed above"
                />
              </FormGroup>
            </FormControl>
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
