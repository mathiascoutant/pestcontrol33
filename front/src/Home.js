import React from "react";
import { Box } from "@mui/material";
import Header from "./components/Layouts/Header";
import SearchBar from "./components/UI/SearchBar";
import LatestComments from "./components/Sections/LatestComments";
import Banner from "./components/UI/Banner";
import CarouselLastProducts from "./components/Sections/CarouselLastProducts";
import BannierePub from "./components/Sections/BannierePub";
import BanniereCategory from "./components/Sections/BanniereCategory";
import UnderConstructionBanner from "./components/UI/UnderConstructionBanner";

function Home() {
  return (
    <Box>
      <Header />
      <SearchBar />
      <UnderConstructionBanner />
      <BanniereCategory />
      <BannierePub />
      <CarouselLastProducts />
      <LatestComments />
      <Banner />
    </Box>
  );
}

export default Home;
