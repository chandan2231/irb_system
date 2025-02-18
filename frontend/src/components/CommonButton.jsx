import React from "react";
import Button from "@mui/material/Button";

const CommonButton = ({
  children,
  color,
  disabled,
  size,
  sx,
  variant,
  onClick,
  startIcon,
}) => {
  return (
    <Button
      color={color}
      disabled={disabled}
      size={size}
      sx={sx}
      variant={variant}
      onClick={onClick}
      startIcon={startIcon}
    >
      {children}
    </Button>
  );
};

export default CommonButton;
