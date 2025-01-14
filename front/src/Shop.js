import React, { useState, useEffect } from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import Header from "./components/Layouts/Header";
import Footer from "./components/Layouts/Footer";
import CardProduct from "./components/Layouts/CardProduct";

function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://37.187.225.41:3002/api/v1/products/"
        );
        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Les données récupérées ne sont pas un tableau");
          setProducts([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box>
      <Header />
      <Typography
        variant="h4"
        sx={{ textAlign: "center", mt: 15, mb: 5 }}
        gutterBottom
      >
        Nos produits
      </Typography>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <CardProduct
                id={product.id}
                image={
                  product.medias?.imageUrls?.[0] || "default-image-url.jpg"
                }
                promotion={product.discount ? `-${product.discount}%` : null}
                name={product.nom}
                status={product.stock > 0 ? "En stock" : "Rupture de stock"}
                price={`${product.prix}€`}
                reduction={product.newPrice ? `${product.newPrice}€` : null}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
}

export default Shop;
