import * as React from "react";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Typography } from "@mui/material";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M9 12l-2-2 2-2 2 2-2 2z"/></svg>')`,
      },
    },
    "&.Mui-disabled": {
      color: theme.palette.grey[400],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      backgroundColor: theme.palette.grey[400], // Change the background color for disabled state
      opacity: 0.5,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
    "&:before": {
      content: '""',
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="white"><path d="M9 12l-2-2 2-2 2 2-2 2z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "dark" ? "#39393D" : "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function ToggleStatus({ status, onStatusChange }) {
  const handleToggle = () => {
    onStatusChange(status);
  };
  return (
    <IOSSwitch
      checked={status === "1" || status === 1 ? true : false}
      onChange={handleToggle}
    />
  );
}

export function ToggleStatusForWaiveFee({ status, onStatusChange }) {
  const handleToggle = () => {
    const newStatus = status === 1 ? 2 : 2 ? 1 : 1;
    onStatusChange(newStatus);
  };
  return (
    <IOSSwitch
      checked={status === "1" || status === 1 ? false : true}
      onChange={handleToggle}
    />
  );
}

export function ToggleStatusForAllowEdit({ status, onStatusChange }) {
  // 0 create (by default)
  // 1 edit not allowed
  // 2 edit allowed

  const newStatus = () => {
    if (status === 0 || status === "0") return 2;
    if (status === 1 || status === "1") return 2;
    if (status === 2 || status === "2") return 1;
    return 0;
  };

  const handleToggle = () => {
    const updatedStatus = newStatus();
    onStatusChange(updatedStatus);
  };

  const getCheck = () => {
    if (status === 0 || status === "0") return false;
    if (status === 1 || status === "1") return false;
    if (status === 2 || status === "2") return true;
    return false;
  };

  return <IOSSwitch checked={getCheck()} onChange={handleToggle} />;
}

export function ToggleStatusForAllowVoting({ status, onStatusChange }) {
  const handleToggle = () => {
    const newStatus = status === 1 ? 2 : 2 ? 1 : 1;
    onStatusChange(newStatus);
  };
  return (
    <IOSSwitch
      checked={status === "1" || status === 1 ? false : true}
      onChange={handleToggle}
    />
  );
}
