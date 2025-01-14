import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useParams } from "react-router-dom";

function Product() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  console.log("Product component - ID reçu:", id);

  useEffect(() => {
    console.log("Fetching product data for ID:", id);
    fetch(`https://pestcontrol33.vercel.app/api/v1/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Product data received:", data);
        setProduct(data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  if (!product) return <div>Chargement...</div>;

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Colonne de gauche - Images */}
        <Box sx={{ width: "40%" }}>
          <img
            src={product.image || "/default-product-image.jpg"}
            alt={product.nom}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
        </Box>

        {/* Colonne de droite - Informations */}
        <Box sx={{ width: "60%" }}>
          <Typography variant="h4" gutterBottom>
            {product.nom}
          </Typography>

          <Typography variant="h5" gutterBottom>
            {product.newPrice || product.prix}€
          </Typography>

          {product.discount && (
            <Typography variant="body2" color="error">
              -{product.discount}% de réduction
            </Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography sx={{ ml: 1 }}>
              Stock disponible: {product.stock}
            </Typography>
          </Box>

          {/* Quantité et bouton d'ajout au panier */}
          <Box sx={{ display: "flex", gap: 2, my: 3 }}>
            <TextField
              type="number"
              defaultValue={1}
              InputProps={{ inputProps: { min: 1, max: product.stock } }}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              disabled={product.stock === 0}
            >
              Ajouter au panier
            </Button>
          </Box>

          {/* Description */}
          <Typography variant="body1" sx={{ mt: 4 }}>
            {product.description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Product;
