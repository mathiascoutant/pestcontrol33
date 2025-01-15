import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const Banner = () => {
  return (
    <Box sx={{ mt: 5, p: 6, bgcolor: "#F9F1E7", textAlign: "center" }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={3}>
          <StarBorderOutlinedIcon
            fontSize="large"
            sx={{ fontSize: "40px", mb: 1 }}
          />
          <Typography variant="body2">Haute qualité</Typography>
        </Grid>
        <Grid item xs={3}>
          <VerifiedOutlinedIcon
            fontSize="large"
            sx={{ fontSize: "40px", mb: 1 }}
          />
          <Typography variant="body2">Satisfaction garantie</Typography>
        </Grid>
        <Grid item xs={3}>
          <LocalShippingOutlinedIcon
            fontSize="large"
            sx={{ fontSize: "40px", mb: 1 }}
          />
          <Typography variant="body2">Livraison rapide</Typography>
        </Grid>
        <Grid item xs={3}>
          <SupportAgentIcon fontSize="large" sx={{ fontSize: "40px", mb: 1 }} />
          <Typography variant="body2">Support 24/7</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Banner;
