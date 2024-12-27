import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import { styled } from "@mui/material/styles";
import * as yup from "yup";
import { getCommunicationListByProtocolId } from "../../services/Communication/CommunicationService";
import { Box, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CommunicationList({ protocolTypeDetails, enqueryUserType }) {
  const [expanded, setExpanded] = React.useState(false);
  const dispatch = useDispatch();
  const userDetails = JSON.parse(localStorage.getItem("user"));

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { communicationList, loading, error, createdProtocol } = useSelector(
    (state) => ({
      error: state.communication.error,
      communicationList: state.communication.communicationList,
      loading: state.communication.loading,
      createdProtocol: state.communication.createdProtocol,
    })
  );
  useEffect(() => {
    const data = {
      protocol_id: protocolTypeDetails.protocolId,
      status: enqueryUserType === "user" ? 2 : 1,
    };
    dispatch(getCommunicationListByProtocolId(data));
  }, [dispatch, userDetails.id]);

  console.log("communicationList", communicationList);

  const getAttachments = (attachments) => {
    return attachments ? attachments.split(",").map((url) => url.trim()) : [];
  };

  return (
    <>
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
      <Row>
        <Box>
          <div className="mt-mb-20">
            {communicationList !== null &&
            communicationList?.data?.length > 0 ? (
              communicationList?.data?.map((communication, index) => {
                const attachments = getAttachments(communication.attachments);
                return (
                  <>
                    <Accordion
                      expanded={expanded === `panel${index}`}
                      onChange={handleChange(`panel${index}`)}
                      key={communication.id}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <Typography
                          component="span"
                          sx={{ width: "90%", flexShrink: 0 }}
                        >
                          {communication.subject}
                        </Typography>
                        <Typography
                          component="span"
                          sx={{ color: "text.secondary" }}
                        >
                          {moment(communication.created_at).format(
                            "DD-MM-YYYY"
                          )}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div>
                          <p>
                            <strong>Subject:</strong> {communication.subject}
                          </p>

                          <p>
                            <strong>Body:</strong> {communication.body}
                          </p>
                          <p>
                            <strong>Created By:</strong>{" "}
                            {communication.created_by_user_type}
                          </p>

                          {attachments.length > 0 && (
                            <div>
                              <h4>Attachments:</h4>
                              <ul>
                                {attachments.map((url, idx) => (
                                  <li key={idx}>
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Attachment {idx + 1}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </>
                );
              })
            ) : (
              <p>No Thread Found</p>
            )}
          </div>
        </Box>
      </Row>
    </>
  );
}

export default CommunicationList;
