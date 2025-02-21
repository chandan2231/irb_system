import React, { useEffect } from "react";
import CommonModal from "../../../components/CommonModal/Modal";
import Loader from "../../../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import moment from "moment";

const EventDetails = ({ open, onClose, data, type }) => {
  console.log("data", data);
  const [loader, setLoader] = React.useState(false);
  const dispatch = useDispatch();
  let protocols = "";
  let members = "";
  if (data !== null) {
    protocols = data?.protocol_name
      .split(",")
      .map((protocol) => protocol.trim());
  }
  if (data !== null) {
    members = data?.members.split(",").map((member) => member.trim());
  }

  const getContentForHaveProtocolId = () => {
    return (
      <Box>
        <p>
          <strong>Event Date and Time:</strong> {data?.event_date_time}
        </p>
        <p>
          <strong>Event Subject:</strong> {data?.event_subject}
        </p>
        <h2>Protocols</h2>
        <ul>
          {protocols.map((protocol, index) => (
            <li key={index}>{protocol}</li>
          ))}
        </ul>

        <h2>Members</h2>
        <ul>
          {members.map((member, index) => (
            <li key={index}>{member}</li>
          ))}
        </ul>

        <p>
          <strong>Created Date:</strong> {data?.createdDate}
        </p>
      </Box>
    );
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <CommonModal
        open={open}
        onClose={() => onClose()}
        title="Event Details"
        subTitle=""
        content={getContentForHaveProtocolId()}
        hideSubmitButton={true}
        hideCancelButton={true}
        identifier="view_event_details"
      />
    </React.Fragment>
  );
};

export default EventDetails;
