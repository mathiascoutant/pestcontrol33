import { Box, Container, Typography } from "@mui/material";
import React from "react";
import Header from "./components/Layouts/Header";

function Profil() {
  return (
    <Box sx={{ mt: 10 }}>
      <Header />
      <Box sx={{ flexGrow: 1, py: 3, mt: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 5, textAlign: "center" }}>
            Profil
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Profil;
