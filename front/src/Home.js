import React from "react";
import { Box } from "@mui/material";
import Header from "./components/Layouts/Header";
import LandingPage from "./components/Sections/LandingPage";
import LatestComments from "./components/Sections/LatestComments";
import Banner from "./components/UI/Banner";
import CarouselLastProducts from "./components/Sections/CarouselLastProducts";

function Home() {
  return (
    <Box>
      <Header />
      <LandingPage />
      <CarouselLastProducts />
      <LatestComments />
      <Banner />
    </Box>
  );
}

export default Home;
