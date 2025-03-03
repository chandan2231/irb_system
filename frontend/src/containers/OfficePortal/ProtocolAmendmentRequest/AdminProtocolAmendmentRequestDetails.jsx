import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Form from "react-bootstrap/Form";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { fetchProtocolAmendmentRequestById } from "../../../services/Admin/EventAndRequestService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CustomMUIFormLabel as FormLabel } from "../../../components/Mui/CustomFormLabel";
import { CustomMUITextFieldWrapper as TextField } from "../../../components/Mui/CustomTextField";
import { CustomDatePickerWrapper as DatePicker } from "../../../components/Mui/CustomDatePickerWrapper";
import { CustomInputLabel as InputLabel } from "../../../components/Mui/CustomInputLabel";
import { CustomMUISelectWrapper as Select } from "../../../components/Mui/CustomSelectWrapper"


const amendDocumentType = [
  { label: "Protocol", value: "1" },
  { label: "Consent form", value: "2" },
  { label: "Subject facing material", value: "3" },
  { label: "Other", value: "4" },
];

function AdminProtocolAmendmentRequestDetails() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();
  const protocolDetails = location.state.details;
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    protocol_number: "",
    amend_document: "",
    amend_document_explain: "",
    describe_change_request: "",
    describe_reasoning: "",
    protocol_id: protocolDetails.protocolId,
    created_by: userDetails.id,
  });

  const handleSubmitData = async (e) => {
    e.preventDefault();
    try {
      if (
        formData.amend_document.includes("4") &&
        formData.amend_document_explain === ""
      ) {
        setExplainAmendDocumentErrors("This is required");
        return;
      } else {
        setExplainAmendDocumentErrors("");
      }
      // const getValidatedform = await protocoalAmendmentSchema.validate(formData, { abortEarly: false });
      // const isValid = await protocoalAmendmentSchema.isValid(getValidatedform)
      // const isValid = true
      if (isValid === true) {
        dispatch(createProtocolInformation({ ...formData })).then((data) => {
          if (data.payload.status === 200) {
            toast.success(data.payload.data.msg, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setFormData({});
          }
        });
      }
    } catch (error) { }
  };

  const { protocolAmendmentRequestById, loading, error } = useSelector(
    (state) => ({
      error: state.admin.error,
      protocolAmendmentRequestById: state.admin.protocolAmendmentRequestById,
      loading: state.admin.loading,
    }),
  );
  useEffect(() => {
    let data = { protocolId: protocolDetails.protocolId };
    dispatch(fetchProtocolAmendmentRequestById(data));
  }, [dispatch, userDetails.id]);
  const amendDocumentTypeArr =
    protocolAmendmentRequestById &&
    protocolAmendmentRequestById.protocol_amendment_request?.amend_document?.split(
      ",",
    );
  return (
    <Box sx={{ width: "100%" }}>
      <h2 className="ml-20">
        Protocol Amendment Request Details ({protocolDetails.protocolId})
      </h2>
      <Box className="pd-25">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <form onSubmit={handleSubmitData} id="protocol_information">
          {protocolAmendmentRequestById && (
            <>
              <Form.Group
                as={Col}
                controlId="validationFormik07"
                className="mt-mb-20"
              >
                <TextField
                  fullWidth
                  disabled
                  label="Protocol number"
                  id="protocol_number"
                  name="protocol_number"
                  defaultValue={
                    protocolAmendmentRequestById.protocol_amendment_request
                      ?.protocol_number
                  }
                />
              </Form.Group>
              <Form.Group as={Col} controlId="validationFormik01">
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    What documents are you wanting to modify or amend?
                  </FormLabel>
                  <FormGroup name="amend_document">
                    {amendDocumentType.map((appliedChanges, index) => {
                      return (
                        <FormControlLabel
                          key={index}
                          control={<Checkbox />}
                          label={appliedChanges.label}
                          value={appliedChanges.value}
                          checked={amendDocumentTypeArr?.find(
                            (id) => Number(id) === Number(appliedChanges.value),
                          )}
                        />
                      );
                    })}
                  </FormGroup>
                </FormControl>
              </Form.Group>
              {amendDocumentTypeArr?.includes("4") && (
                <Form.Group
                  as={Col}
                  controlId="validationFormik03"
                  className="mt-mb-20"
                >
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Explain
                  </FormLabel>
                  <p className="explain_text">
                    {
                      protocolAmendmentRequestById.protocol_amendment_request
                        ?.amend_document_explain
                    }
                  </p>
                </Form.Group>
              )}
              <Box sx={{ flexGrow: 1 }}>
                <Form.Group
                  as={Col}
                  controlId="validationFormik010"
                  className="mt-mb-20"
                >
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Uploaded redlined document(s) here
                  </InputLabel>
                  {/* <div className='highlight-text'>Please note: Documents must be in WORD version showing “track changes” </div> */}
                  {protocolAmendmentRequestById.protocol_amendment_request
                    ?.documents?.length > 0 &&
                    protocolAmendmentRequestById.protocol_amendment_request?.documents?.map(
                      (docList, index) => {
                        if (docList.document_name === "redlined document") {
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
                      },
                    )}
                </Form.Group>
                <h3>Summary of changes:</h3>
                <Form.Group
                  as={Col}
                  controlId="validationFormik03"
                  className="mt-mb-20"
                >
                  <Box sx={{ width: "100%", maxWidth: "100%" }}>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Use the text box below to describe the changes requested
                      in full detail
                    </FormLabel>
                    <p className="explain_text">
                      {
                        protocolAmendmentRequestById.protocol_amendment_request
                          ?.describe_change_request
                      }
                    </p>
                  </Box>
                </Form.Group>
                <h3>Rationale for changes:</h3>
                <Form.Group
                  as={Col}
                  controlId="validationFormik03"
                  className="mt-mb-20"
                >
                  <Box sx={{ width: "100%", maxWidth: "100%" }}>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Use the text box below to describe the reasoning for each
                      of the changes requested
                    </FormLabel>
                    <p className="explain_text">
                      {
                        protocolAmendmentRequestById.protocol_amendment_request
                          ?.describe_reasoning
                      }
                    </p>
                  </Box>
                </Form.Group>
              </Box>
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
                  disabled
                >
                  SAVE AND CONTINUE
                </Button>
              </Form.Group>
            </>
          )}
        </form>
      </Box>
    </Box>
  );
}

export default AdminProtocolAmendmentRequestDetails;
