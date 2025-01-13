import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

const IconCircle = styled(Box)({
  width: 150,
  height: 150,
  borderRadius: "50%",
  border: "2px solid black",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.1)",
  },
});

const PestIcons = () => {
  const pests = [
    { name: "Taupe", path: "/taupe", icon: "🦫" },
    { name: "Cafard", path: "/cafard", icon: "🪲" },
    { name: "Termites", path: "/termites", icon: "🐜" },
  ];

  return (
    <Box sx={{ py: 8, px: 2 }}>
      <Typography variant="h2" align="center" gutterBottom>
        Des Produits Performants pour un Espace Sain
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
        {pests.map((pest) => (
          <Grid item key={pest.name}>
            <Link
              to={pest.path}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <IconCircle>
                <Typography variant="h1" sx={{ fontSize: "50px" }}>
                  {pest.icon}
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {pest.name}
                </Typography>
              </IconCircle>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PestIcons;
