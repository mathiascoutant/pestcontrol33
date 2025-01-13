import React from "react";
import { Box } from "@mui/material";
import Header from "./components/Layouts/Header";
import Footer from "./components/Layouts/Footer";
import LandingPage from "./components/Sections/LandingPage";

function Home() {
  return (
    <Box>
      <Header />
      <LandingPage />
      <Footer />
    </Box>
  );
}

export default Home;
