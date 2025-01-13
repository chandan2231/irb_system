import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import { styled } from "@mui/material/styles";
import * as yup from "yup";
import { getCommunicationListByProtocolId } from "../../services/Communication/CommunicationService";
import { Box, IconButton, Menu, MenuItem, useTheme } from "@mui/material";
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
import ReplyIcon from "@mui/icons-material/Reply";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Loader from "../../components/Loader";

const CommunicationItem = ({ communication }) => {
  const formattedDate = moment(communication.created_at).format("DD-MM-YYYY");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        flexShrink: 0,
      }}
    >
      <Typography component="span">{communication.subject}</Typography>
      <Typography
        component="span"
        color="text.secondary"
        sx={{ marginRight: 2 }}
      >
        {formattedDate}
      </Typography>
    </Box>
  );
};

const CommunicationBody = ({ communication, attachments }) => {
  return (
    <div>
      <p>
        <strong>Subject:</strong> {communication.subject}
      </p>

      <p>
        <strong>Body:</strong> {communication.body}
      </p>
      <p>
        <strong>Created By:</strong> {communication.created_by_user_type}
      </p>

      {attachments.length > 0 && (
        <div>
          <h4>Attachments:</h4>
          <ul>
            {attachments.map((url, idx) => (
              <li key={idx}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Attachment {idx + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const ShowOptions = ({
  communication,
  handleReplyToThread
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReply = () => {
    handleReplyToThread(communication);
    handleClose();
  };

  const options = [
    {
      id: 1,
      label: "Reply",
      icon: <ReplyIcon />,
      onClick: () => {
        handleReply();
      },
    },
  ];
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "text.secondary",
        cursor: "pointer",
        height: "48px",
      }}
    >
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              width: "14ch",
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            selected={option === "Pyxis"}
            onClick={option.onClick}
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "start",
              gap: 1,
            }}
          >
            {option.icon} {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

function CommunicationList({
  protocolTypeDetails,
  enqueryUserType,
  handleReplyToThread
}) {
  const [loader, setLoader] = useState(false);
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
    setLoader(true);
    const data = {
      protocol_id: protocolTypeDetails.protocolId,
      status: enqueryUserType === "user" ? 2 : 1,
    };
    dispatch(getCommunicationListByProtocolId(data)).then(() => {
      setLoader(false);
    });
  }, [dispatch, userDetails.id]);

  const getAttachments = (attachments) => {
    return attachments ? attachments.split(",").map((url) => url.trim()) : [];
  };

  if (loader) {
    return <Loader />
  }

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
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      width: "100%",
                      gap: 1,
                    }}
                    key={communication.id}
                  >
                    <Accordion
                      sx={{
                        width: "100%",
                      }}
                      expanded={expanded === `panel${index}`}
                      onChange={handleChange(`panel${index}`)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <CommunicationItem communication={communication} />
                      </AccordionSummary>
                      <AccordionDetails>
                        <CommunicationBody
                          communication={communication}
                          attachments={attachments}
                        />
                      </AccordionDetails>
                    </Accordion>
                    <ShowOptions
                      communication={communication}
                      handleReplyToThread={handleReplyToThread}
                    />
                  </Box>
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
