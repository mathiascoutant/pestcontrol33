import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: "auto",
        backgroundColor: "white",
        textAlign: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box />
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", my: 1, fontSize: { xs: "1rem" } }}
        >
          PestControl33
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Votre solution professionnelle pour un environnement sans termites.
        </Typography>
        <Divider sx={{ my: 2 }} variant="fullWidth" />
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} PestControl33. Tous droits réservés.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
