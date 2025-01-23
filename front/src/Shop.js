import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Header from "./components/Layouts/Header";
import CardProduct from "./components/Layouts/CardProduct";
import fondImage from "./Assets/fond.png";
import { Link } from "react-router-dom";
import Banner from "./components/UI/Banner";

function Shop() {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/products/`
        );
        const data = await response.json();
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

  const filteredProducts = products.filter((product) => {
    const price = parseFloat(product.prix);
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    const matchesPrice = price >= min && price <= max;
    const matchesAvailability = onlyAvailable ? product.stock > 0 : true;

    return matchesPrice && matchesAvailability;
  });

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
          Nos produits
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography sx={{ color: "#000" }}>
            <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
              Accueil
            </Link>
          </Typography>
          <Typography sx={{ color: "#000" }}>{">"}</Typography>
          <Typography sx={{ color: "#000" }}>Nos produits</Typography>
        </Box>
      </Box>
      <Box sx={{ py: 5 }}>
        <Typography
          variant="body1"
          sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}
        >
          Filtrer les produits
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            label="Prix min"
            variant="outlined"
            size="small"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            sx={{ width: "150px" }}
          />
          <TextField
            label="Prix max"
            variant="outlined"
            size="small"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            sx={{ width: "150px" }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
              />
            }
            label="En stock uniquement"
          />
        </Box>
      </Box>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {filteredProducts.map((product) => (
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
      <Banner />
    </Box>
  );
}

export default Shop;
