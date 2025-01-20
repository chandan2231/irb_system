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
import { downloadCommunicationPdf } from "../../services/Communication/CommunicationService";
import Loader from "../../components/Loader";
import jsPDF from "jspdf";
import "jspdf-autotable";

const generatePDF = ({ apiResponseData }) => {
  const doc = new jsPDF();

  apiResponseData.forEach((item, index) => {
    // Add a new page for every protocol except the first one
    if (index > 0) {
      doc.addPage();
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    if (index === 0) {
      // Main Title
      doc.text(`Communication Details of ${item.protocol_id}`, 105, 15, {
        align: "center",
      });

      // Subheading
      doc.setFontSize(12); // Smaller font size for subheading
      doc.setFont("helvetica", "normal"); // Normal font style for subheading
      doc.text(`Research Type: ${item.protocol_type}`, 105, 25, {
        align: "center",
      }); // Adjusted Y-coordinate for spacing
    }

    // Show Query Send BY :-
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Query Sent By: ${item.created_by_user_type === "user" ? "Applicant" : "Admin"}`,
      20,
      30
    );

    // Show Subject
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Subject:", 20, 40);

    // Show Subject Value
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(item.subject, 40, 40);

    // Show Body
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Body:", 20, 50);

    // Show Body Value
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(item.body, 40, 50);

    // Show Attachments
    if (item.attachments) {
      const attachments = item.attachments.split(", ");
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Attachments:", 20, 60);

      // Show Attachments as Links in Blue Color
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 255); // Set text color to blue (RGB format)
      attachments.forEach((link, idx) => {
        const yPosition = 60 + idx * 10; // Adjust y-position for each link
        const linkText = `Attachment ${idx + 1}`;
        doc.text(linkText, 50, yPosition);

        // Add a clickable link
        const textWidth = doc.getTextWidth(linkText); // Get text width to define link area
        doc.link(50, yPosition - 4, textWidth, 8, { url: link });
      });
    }
  });

  // Add Footer with Page Numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  doc.save("communication-details.pdf");
};

const Communication = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [loader, setLoader] = React.useState(false);
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

  const ShowOptions = ({ protocolTypeDetails }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [loader, setLoader] = React.useState(false);
    const dispatch = useDispatch();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleDownloadCommunicationPDF = async () => {
      let data = { protocolId: protocolTypeDetails.protocolId };
      try {
        setLoader(true);
        dispatch(downloadCommunicationPdf(data)).then((res) => {
          // HERE WE GO
          const pdfResponse = res?.payload?.data || [];
          console.log("pdfResponse", pdfResponse);
          generatePDF({ apiResponseData: pdfResponse });
          setLoader(false);
          // if (pdfResponse !== "") {
          //   window.open(pdfResponse.pdfUrl, "_blank", "noopener,noreferrer");
          // }
        });
        handleClose();
      } catch (error) {
        setLoader(false);
        console.log("error", error);
      }
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

    if (loader) {
      return <Loader />;
    }

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

  if (loader) {
    return <Loader />;
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
          <ShowOptions protocolTypeDetails={protocolTypeDetails} />
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
