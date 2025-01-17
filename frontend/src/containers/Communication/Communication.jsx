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
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const ShowOptions = ({ protocolTypeDetails, enqueryUserType }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDownloadCommunicationPDF = () => {
    console.log("Download PDF", {
      protocolTypeDetails,
      enqueryUserType,
    });
    handleClose();
  };

  const options = [
    {
      id: 1,
      label: "View Pdf",
      icon: <PictureAsPdfIcon />,
      onClick: () => {
        handleDownloadCommunicationPDF();
      },
    },
  ];
  return (
    <Box>
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

const Communication = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const protocolTypeDetails = location.state.details;
  const enqueryUserType = location.state.identifierType;
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [isReplyToThreadClicked, setIsReplyToThreadClicked] =
    React.useState(false);
  const [selectedThread, setSelectedThread] = React.useState(null);
  const handleReplyToThread = (threadDetails) => {
    setIsReplyToThreadClicked(true);
    setSelectedThread(threadDetails);
    setValue(0);
  };

  const handleCancelReply = () => {
    setIsReplyToThreadClicked(false);
    setSelectedThread(null);
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "between",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
            style={{
              padding: 0,
              width: "100%",
            }}
          >
            <Tab label="Send Email" {...a11yProps(0)} />
            <Tab label="Thread" {...a11yProps(1)} />
          </Tabs>
          <ShowOptions
            protocolTypeDetails={protocolTypeDetails}
            enqueryUserType={enqueryUserType}
          />
        </Box>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <SendEmail
          protocolTypeDetails={protocolTypeDetails}
          enqueryUserType={enqueryUserType}
          isReplyToThreadClicked={isReplyToThreadClicked}
          selectedThread={selectedThread}
          handleCancelReply={handleCancelReply}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CommunicationList
          protocolTypeDetails={protocolTypeDetails}
          enqueryUserType={enqueryUserType}
          handleReplyToThread={handleReplyToThread}
        />
      </CustomTabPanel>
    </Box>
  );
};

export default Communication;
