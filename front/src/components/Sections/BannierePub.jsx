import { Box, Typography, Button } from "@mui/material";
import React, { useState, useEffect } from "react";

function BannierePub() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/122`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  if (!product) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        padding: { xs: 2, md: 4 },
        backgroundColor: "#B6DEDD",
        my: { xs: 4, md: 8 },
      }}
    >
      <Box
        sx={{
          flex: 1,
          pr: { xs: 0, md: 4 },
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          mx: { xs: 2, md: 5 },
          width: "100%",
          py: { xs: 2, md: 0 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", md: "2.125rem" },
          }}
          gutterBottom
        >
          {product.nom}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            textAlign: "center",
            mx: { xs: 2, md: 10 },
            my: 2,
          }}
        >
          {product.description}
        </Typography>
        {product.discount && (
          <Typography variant="h6" color="error" gutterBottom>
            -{product.discount}% : {product.newPrice}€
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          href={`/product/${product.id}`}
          sx={{
            mt: 2,
            backgroundColor: "#00AAB7",
            color: "white",
            px: 5,
          }}
        >
          ACHETER
        </Button>
      </Box>
      <Box
        sx={{
          flex: 1,
          width: "100%",
          mt: { xs: 3, md: 0 },
        }}
      >
        <img
          src={product.medias.imageUrls[0]}
          alt={product.nom}
          style={{
            width: "100%",
            maxHeight: { xs: "200px", md: "300px" },
            objectFit: "contain",
          }}
        />
      </Box>
    </Box>
  );
}

export default BannierePub;
