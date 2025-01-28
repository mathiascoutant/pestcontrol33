import { Box, Container, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./components/Layouts/Header";
import CardProduct from "./components/Layouts/CardProduct";
import fondImage from "../src/Assets/fond.png";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token d'utilisateur non trouvé");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}products/likes`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(
            `Erreur lors de la récupération des produits likés : ${errorMessage}`
          );
        }

        const data = await response.json();
        console.log("Produits likés récupérés :", data);

        if (Array.isArray(data.favorites)) {
          setFavorites(data.favorites);
        } else {
          console.error("Les produits likés ne sont pas un tableau");
          setFavorites([]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des produits likés :", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedProducts();
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
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              Vous n'avez pas encore de favoris
            </Typography>
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
