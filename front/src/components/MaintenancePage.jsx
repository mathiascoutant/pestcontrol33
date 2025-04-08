import React from "react";
import { Box, Typography, Container } from "@mui/material";
import Header from "./Layouts/Header";
import fondImage from "../Assets/fond.png";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function MaintenancePage() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
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
          sx={{
            color: "#000",
            mb: 2,
            fontWeight: "bold",
          }}
        >
          {t("maintenance.title", "Page en maintenance")}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography sx={{ color: "#000" }}>
            <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
              {t("navigation.home", "Accueil")}
            </Link>
          </Typography>
          <Typography sx={{ color: "#000" }}>{">"}</Typography>
          <Typography sx={{ color: "#000" }}>
            {t("maintenance.title", "Page en maintenance")}
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 5 }}>
        <Box
          sx={{
            textAlign: "center",
            py: 5,
            borderRadius: 1,
            bgcolor: "#FAF4F4",
            p: 4,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            {t(
              "maintenance.message",
              "Cette page est temporairement indisponible"
            )}
          </Typography>
          <Typography sx={{ mb: 3, color: "text.secondary" }}>
            {t(
              "maintenance.description",
              "Nous travaillons actuellement sur l'amélioration de cette fonctionnalité. Merci de votre patience."
            )}
          </Typography>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography
              sx={{
                color: "#B88E2F",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {t("maintenance.returnHome", "Retour à l'accueil")}
            </Typography>
          </Link>
        </Box>
      </Container>
    </>
  );
}

export default MaintenancePage;
