import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Header from "./components/Layouts/Header";
import LandingPage from "./components/Sections/LandingPage";
import ProductSection from "./components/Sections/ProductSection";
import LatestComments from "./components/Sections/LatestComments";
import Banner from "./components/UI/Banner";
function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products`
      );
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <Box>
      <Header />
      <LandingPage />
      <ProductSection products={products} />
      <LatestComments />
      <Banner />
    </Box>
  );
}

export default Home;
