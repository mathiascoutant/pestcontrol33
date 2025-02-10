import React from "react";
import { Box, Typography, Grid, useMediaQuery } from "@mui/material";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const Banner = () => {
  // Vérifie si l'écran est de type mobile (taille xs)
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        mt: 5,
        p: isMobile ? 4 : 6, // Réduit le padding sur mobile
        bgcolor: "#F9F1E7",
        textAlign: "center",
      }}
    >
      <Grid
        container
        spacing={isMobile ? 4 : 2} // Augmente l'espacement entre les items sur mobile
        justifyContent="center"
      >
        <Grid item xs={6} sm={3}>
          <StarBorderOutlinedIcon
            fontSize="large"
            sx={{ fontSize: "40px", mb: 1 }}
          />
          <Typography variant="body2">Haute qualité</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <VerifiedOutlinedIcon
            fontSize="large"
            sx={{ fontSize: "40px", mb: 1 }}
          />
          <Typography variant="body2">Satisfaction garantie</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <LocalShippingOutlinedIcon
            fontSize="large"
            sx={{ fontSize: "40px", mb: 1 }}
          />
          <Typography variant="body2">Livraison rapide</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <SupportAgentIcon fontSize="large" sx={{ fontSize: "40px", mb: 1 }} />
          <Typography variant="body2">Support 24/7</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Banner;
