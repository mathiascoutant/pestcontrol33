import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import CardProduct from "../Layouts/CardProduct";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ProductSection = ({ products }) => {
  const displayedProducts = Array.isArray(products) ? products.slice(0, 4) : [];

  return (
    <Box sx={{ mt: 4, p: 2, px: 10, py: 5 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: "semibold",
          display: "flex",
          alignItems: "center",
        }}
      >
        Nos produits
        <IconButton component={Link} to="/shop" sx={{ ml: 1 }}>
          <ArrowForwardIcon />
        </IconButton>
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        {displayedProducts.map((product) => (
          <CardProduct
            key={product.id}
            id={product.id}
            name={product.nom}
            price={
              product.newPrice ? product.newPrice + "€" : product.prix + "€"
            }
            reduction={product.discount ? `-${product.discount}%` : null}
            status={product.stock > 0 ? "En stock" : "Rupture de stock"}
            image={product.medias?.imageUrls?.[0]}
            promotion={product.promotion}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ProductSection;
