import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Form from "react-bootstrap/Form";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import * as yup from "yup";
import Grid from "@mui/material/Grid";
import { createProtocolInformation } from "../../../../../services/ProtocolType/MultiSiteSponsorService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const fundingSource = [
  {
    label: "Self/Investigator-Sponsor/Internally",
    value: "Self/Investigator-Sponsor/Internally",
  },
  { label: "Industry", value: "Industry" },
  { label: "Non-profit organization", value: "Non-profit organization" },
  { label: "U.S. Federal Grant", value: "U.S. Federal Grant" },
  { label: "State or local Government", value: "State or local Government" },
  { label: "No funding", value: "No funding" },
];

function ProtocolInformationForm({ protocolTypeDetails, protocolInformation, type }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    first_time_protocol: "",
    protocol_title: "",
    protocol_number: "",
    sponsor: "",
    study_duration: "",
    funding_source: "",
    disapproved_or_withdrawn: "",
    disapproved_or_withdrawn_explain: "",
    oversite: "",
    oversite_explain: "",
    protocol_id: protocolTypeDetails.protocolId,
    created_by: userDetails.id,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      const getValidatedform = await protocoalInfoSchema.validate(formData, {
        abortEarly: false,
      });
      const isValid = await protocoalInfoSchema.isValid(getValidatedform);
      console.log("formData", formData);
      if (isValid === true) {
        dispatch(createProtocolInformation(formData)).then((data) => {
          if (data.payload.status === 200) {
          } else {
          }
        });
      }
    } catch (error) {}
  };

  console.log("protocolInformation", protocolInformation);

  return (
    <Row>
      <form onSubmit={handleSubmitData}>
        <Form.Group as={Col} controlId="validationFormik01">
          <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">
              Are you submitting this protocol for the first time? *
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="first_time_protocol"
            >
              <FormControlLabel
                value="Yes"
                control={<Radio />}
                label="Yes"
                checked={protocolInformation?.first_time_protocol === "Yes"}
              />
              <FormControlLabel
                value="No"
                control={<Radio />}
                label="No"
                checked={protocolInformation?.first_time_protocol === "No"}
              />
            </RadioGroup>
          </FormControl>
          {errors.first_time_protocol && (
            <div className="error">{errors.first_time_protocol}</div>
          )}
        </Form.Group>
        {protocolInformation?.first_time_protocol === "No" && (
          <>
            <Form.Group as={Col} controlId="validationFormik02">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  {" "}
                  Has this study been disapproved or withdrawn from another IRB?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="disapproved_or_withdrawn"
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                    checked={
                      protocolInformation?.disapproved_or_withdrawn === "Yes"
                    }
                  />
                  <FormControlLabel
                    value="No"
                    control={<Radio />}
                    label="No"
                    checked={
                      protocolInformation?.disapproved_or_withdrawn === "No"
                    }
                  />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            {protocolInformation?.disapproved_or_withdrawn === "Yes" && (
              <Form.Group
                as={Col}
                controlId="validationFormik03"
                className="mt-mb-20"
              >
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Explain
                </FormLabel>
                <p className="explain_text">
                  {protocolInformation?.disapproved_or_withdrawn_explain}
                </p>
              </Form.Group>
            )}
            <Form.Group as={Col} controlId="validationFormik04">
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  {" "}
                  Are you transferring oversight from another IRB?
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="oversite"
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                    checked={protocolInformation?.oversite === "Yes"}
                  />
                  <FormControlLabel
                    value="No"
                    control={<Radio />}
                    label="No"
                    checked={protocolInformation?.oversite === "No"}
                  />
                </RadioGroup>
              </FormControl>
            </Form.Group>
            {protocolInformation?.oversite === "Yes" && (
              <Form.Group
                as={Col}
                controlId="validationFormik05"
                className="mt-mb-20"
              >
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Explain
                </FormLabel>
                <p className="explain_text">
                  {protocolInformation?.oversite_explain}
                </p>
              </Form.Group>
            )}
          </>
        )}
        <Form.Group
          as={Col}
          controlId="validationFormik06"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Title of Protocol *"
              id="protocol_title"
              name="protocol_title"
              value={protocolInformation?.protocol_title}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik07"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Protocol number *"
              id="protocol_number"
              name="protocol_number"
              value={protocolInformation?.protocol_number}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik08"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Sponsor *"
              id="sponsor"
              name="sponsor"
              value={protocolInformation?.sponsor}
            />
          </Box>
        </Form.Group>
        <Form.Group
          as={Col}
          controlId="validationFormik09"
          className="mt-mb-20"
        >
          <Box sx={{ width: "100%", maxWidth: "100%" }}>
            <TextField
              fullWidth
              label="Approximate duration of study *"
              id="study_duration"
              name="study_duration"
              value={protocolInformation?.study_duration}
            />
          </Box>
        </Form.Group>
        <FormControl sx={{ minWidth: "100%" }} className="mt-mb-20">
          <InputLabel id="demo-simple-select-autowidth-label">
            Funding source *
          </InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            autoWidth
            label="Funding source"
            name="funding_source"
            value={protocolInformation?.funding_source}
          >
            {fundingSource.map((source, index) => {
              return (
                <MenuItem key={index} value={source.value}>
                  {source.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Box sx={{ flexGrow: 1 }}>
          <Form.Group
            as={Col}
            controlId="validationFormik010"
            className="mt-mb-20"
          >
            <InputLabel id="demo-simple-select-autowidth-label">
              Uploaded Protocol
            </InputLabel>
            {protocolInformation?.documents?.length > 0 &&
              protocolInformation?.documents?.map((docList, index) => {
                if (docList.document_name === "protocol") {
                  return (
                    <div>
                      <a
                        href={docList.file_url}
                        target="_blank"
                        className="no_underline"
                      >
                        {docList.file_name}
                      </a>
                    </div>
                  );
                }
              })}
          </Form.Group>
        </Box>
        {
          type !== 'member' && (
            <Form.Group
              as={Col}
              controlId="validationFormik010"
              className="mt-mb-20"
              style={{ textAlign: "right" }}
            >
              <Button
                variant="contained"
                color="primary"
                type="Submit"
              >
                SAVE AND CONTINUE
              </Button>
            </Form.Group>
          )
        }
      </form>
    </Row>
  );
}

export default ProtocolInformationForm;
