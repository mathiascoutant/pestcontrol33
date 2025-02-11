import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Box, Typography, CircularProgress, IconButton } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardProduct from "../Layouts/CardProduct";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

const CarouselLastProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/products/`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProducts(data.slice(0, 5));
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "60px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <Box sx={{ mx: 4, mb: 10, mt: 10 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 5,
          textAlign: "center",
          fontSize: { xs: "1.5rem", sm: "2rem", md: "1.7rem" },
        }}
      >
        Nos produits
        <IconButton component={Link} to="/shop" sx={{ ml: 1 }}>
          <ArrowForwardIcon />
        </IconButton>
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : products.length > 0 ? (
        <Slider {...settings}>
          {products.map((product) => (
            <Box
              key={product.id}
              sx={{ display: "flex", justifyContent: "center", p: 2 }}
            >
              <CardProduct
                id={product.id}
                name={product.nom}
                status={product.stock > 0 ? "En stock" : "Rupture de stock"}
                price={`${product.prix}€`}
                reduction={product.newPrice ? `${product.newPrice}€` : null}
                image={
                  product.medias?.imageUrls?.[0] || "default-image-url.jpg"
                }
                promotion={product.discount ? `-${product.discount}%` : null}
              />
            </Box>
          ))}
        </Slider>
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Aucun produit disponible pour le moment.
        </Typography>
      )}
    </Box>
  );
};

export default CarouselLastProducts;
