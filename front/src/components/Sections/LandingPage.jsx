import React from "react";
import { Box, Card, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import backgroundImage from "../../Assets/landingpage.jpg";

function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "95vh",
        width: "100%",
        margin: 0,
        padding: 0,
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          maxWidth: 500,
          padding: 4,
          marginRight: 8,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Bienvenue chez
        </Typography>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="primary"
          sx={{ fontWeight: "bold" }}
        >
          PestControl33
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 4 }}>
          Experts en désinsectisation, nous vous accompagnons dans la lutte
          contre les nuisibles. Nos produits sont de haute qualité et
          garantissent une efficacité maximale.
        </Typography>
        <Button
          component={Link}
          to="/shop"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            padding: "10px 30px",
            color: "#FFF",
          }}
        >
          Découvrir nos produits
        </Button>
      </Card>
    </Box>
  );
}

export default LandingPage;
