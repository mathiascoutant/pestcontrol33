import React from "react";
import { Box, Typography, IconButton, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import CardProduct from "../Layouts/CardProduct";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const ProductSection = ({ products }) => {
  // Trier les produits par date d'ajout (en supposant qu'il y a une propriété 'dateAjout')
  const sortedProducts = Array.isArray(products)
    ? products.sort((a, b) => new Date(b.dateAjout) - new Date(a.dateAjout))
    : [];

  // Utilisation de useMediaQuery pour détecter la taille de l'écran
  const isXs = useMediaQuery((theme) => theme.breakpoints.down("sm")); // Taille pour mobile
  const isSm = useMediaQuery((theme) => theme.breakpoints.between("sm", "md")); // Taille pour tablette
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md")); // Taille pour ordinateur

  // Affichage des produits selon la taille d'écran
  const displayedProducts = sortedProducts.slice(0, isXs ? 2 : isSm ? 3 : 4); // 2 produits sur mobile, 3 sur tablette, 4 sur ordinateur

  return (
    <Box sx={{ p: 2, px: { xs: 3, sm: 4, md: 10 }, py: 2 }}>
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
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)", // 1 produit sur téléphone
            sm: "repeat(3, 1fr)", // 2 produits sur tablette
            md: "repeat(4, 1fr)", // 4 produits sur ordinateur
          },
          gap: { xs: 6, sm: 2, md: 3 },
          ml: { xs: 6, sm: 0, md: 0 },
          mt: { xs: 6, sm: 0, md: 0 },
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
