import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import SendEmail from "./SendEmail";
import CommunicationList from "./CommunicationList";

const Communication = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const protocolTypeDetails = location.state.details;
  const enqueryUserType = location.state.identifierType;
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box sx={{ width: "100%" }}>
      <h2 className="ml-20">
        {protocolTypeDetails.researchType}&nbsp;(
        {protocolTypeDetails.protocolId})
      </h2>
      <Box className="ml-20" sx={{ borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
          scrollButtons="auto"
          style={{ padding: 0 }}
        >
          <Tab label="Send Email" {...a11yProps(0)} />
          <Tab label="Thread" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <SendEmail
          protocolTypeDetails={protocolTypeDetails}
          enqueryUserType={enqueryUserType}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CommunicationList
          protocolTypeDetails={protocolTypeDetails}
          enqueryUserType={enqueryUserType}
        />
      </CustomTabPanel>
    </Box>
  );
};

export default Communication;
