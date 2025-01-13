import React from "react";
import { Button } from "@mui/material";

function CustomButton({
  variant = "contained",
  color = "primary",
  size = "medium",
  children,
  onClick,
  ...props
}) {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );
}

export default CustomButton;
