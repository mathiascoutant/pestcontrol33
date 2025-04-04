import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
function Footer() {
  const { t } = useTranslation();
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: "auto",
        backgroundColor: "#B6DEDD",
        textAlign: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box />
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", my: 1, fontSize: { xs: "1rem" } }}
        >
          {t("footer.title", "PestControl33")}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t("footer.description", "Votre solution professionnelle pour un environnement sans termites.")}
        </Typography>
        <Divider sx={{ my: 2 }} variant="fullWidth" />
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} {t("footer.copyright", "PestControl33")}. {t("footer.rights", "Tous droits réservés.")}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
