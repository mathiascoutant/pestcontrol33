import { Box, Container, Typography, Grid, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./components/Layouts/Header";
import CardProduct from "./components/Layouts/CardProduct";
import fondImage from "../src/Assets/fond.png";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");

        // Récupérer tous les produits
        const productsResponse = await fetch(
          "http://37.187.225.41:3002/api/v1/products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        const allProducts = await productsResponse.json();

        // Filtrer les produits qui ont des likes
        const favoriteProducts = allProducts.filter(
          (product) => product.like > 0
        );

        console.log("Produits likés trouvés:", favoriteProducts);
        setFavorites(favoriteProducts);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <Box>
      <Header />
      <Box
        sx={{
          backgroundImage: `url(${fondImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mb: 5,
          mt: 8,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#000",
            mb: 2,
            fontWeight: "bold",
          }}
        >
          Mes favoris
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography sx={{ color: "#000" }}>
            <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
              Accueil
            </Link>
          </Typography>
          <Typography sx={{ color: "#000" }}>{">"}</Typography>
          <Typography sx={{ color: "#000" }}>Mes favoris</Typography>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, py: 3, mt: 10 }}>
        <Container maxWidth="lg">
          {loading ? (
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              Chargement de vos favoris...
            </Typography>
          ) : favorites.length === 0 ? (
            <>
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                Vous n'avez pas encore de favoris
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    color: "#fff",
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Link
                    to="/shop"
                    style={{ textDecoration: "none", color: "#fff" }}
                  >
                    Découvrir nos produits
                  </Link>
                </Button>
              </Box>
            </>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {favorites.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <CardProduct
                    {...(product.discount
                      ? { promotion: `-${product.discount} €` }
                      : {})}
                    name={product.nom}
                    description={product.description}
                    image={product.medias?.imageUrls?.[0]}
                    status={product.stock > 0 ? "En stock" : "Rupture de stock"}
                    {...(product.prix ? { price: `${product.prix} €` } : {})}
                    {...(product.newPrice
                      ? { reduction: `${product.newPrice} €` }
                      : {})}
                    id={product.id}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default Favorites;
