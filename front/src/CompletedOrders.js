import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import fondImage from "../src/Assets/fond.png";

function CompletedOrders() {
  return (
    <Box sx={{ mt: 8, textAlign: "center" }}>
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
          sx={{ mb: 2, fontWeight: "semibold", mt: 0.5 }}
        >
          Commandes terminées
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography sx={{ color: "#000" }}>
            <Link
              to="/dashboard"
              style={{ textDecoration: "none", color: "#000" }}
            >
              Dashboard
            </Link>
          </Typography>
          <Typography sx={{ color: "#000" }}>{">"}</Typography>
          <Typography sx={{ color: "#000" }}>Commandes terminées</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default CompletedOrders;
