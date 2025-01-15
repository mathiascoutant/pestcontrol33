import React from "react";
import { Box, Typography } from "@mui/material";
import Header from "./components/Layouts/Header";

function Contact() {
  return (
    <Box>
      <Header />
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mt: 15 }}
        gutterBottom
      >
        Contact
      </Typography>
    </Box>
  );
}

export default Contact;
