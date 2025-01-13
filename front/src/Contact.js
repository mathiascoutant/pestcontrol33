import React from "react";
import { Box, Typography } from "@mui/material";
import Header from "./components/Layouts/Header";
import Footer from "./components/Layouts/Footer";
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
      <Footer />
    </Box>
  );
}

export default Contact;
