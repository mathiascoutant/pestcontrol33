import { Box, Typography } from "@mui/material";
import React from "react";
import Header from "./components/Layouts/Header";
import Footer from "./components/Layouts/Footer";

function About() {
  return (
    <Box>
      <Header />
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mt: 15 }}
        gutterBottom
      >
        A propos
      </Typography>
      <Footer />
    </Box>
  );
}

export default About;
