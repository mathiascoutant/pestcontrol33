import React from "react";
import { Box, Typography } from "@mui/material";
import backgroundImage from "../../Assets/landing.png";
import backgroundPhone from "../../Assets/landingPhone.png";

function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundImage: {
          xs: `url(${backgroundPhone})`,
          sm: `url(${backgroundImage})`,
        },
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 7,
        mb: { xs: 12, sm: 2 },
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: "black",
          textAlign: "center",
          fontSize: { xs: "2rem", sm: "3rem", md: "3rem" },
          borderBottom: 1.5,
          pb: 0.5,
        }}
      >
        PestControl33
      </Typography>
    </Box>
  );
}

export default LandingPage;
