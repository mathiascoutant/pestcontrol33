import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  Snackbar,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import fondImage from "../../Assets/landing.jpg";
import { useTranslation } from "react-i18next";

function RegisterForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      // Création des données du formulaire
      const data = {
        email: formData.email,
        password: formData.password,
        pseudo: formData.username,
        nom: formData.lastName,
        prenom: formData.firstName,
        recaptchaDisabled: true,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setSuccessMessage(
          `Bienvenue ${formData.firstName} ${formData.lastName} !`
        );
        setOpenSnackbar(true);
        setError("");
        setTimeout(() => {
          navigate("/connexion");
        }, 1000);
      } else {
        const data = await response.json();
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      setError("Erreur de connexion au serveur");
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Image côté gauche */}
        <Box
          sx={{
            width: { xs: "0", md: "50%" }, // Masque l'image sur mobile
            height: "100vh",
            display: { xs: "none", md: "block" },
            backgroundImage: `url(${fondImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Formulaire côté droit */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "400px", md: "500px" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mt: { xs: 14, md: 0 },
            }}
          >
            <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
              {t("auth.register", "Inscription")}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {t("errors.default", "Une erreur est survenue")}
              </Alert>
            )}

            <TextField
              required
              fullWidth
              label={t("auth.lastName", "Nom")}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              label={t("auth.firstName", "Prénom")}
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label={t("auth.username", "Pseudo")}
              name="username"
              value={formData.username}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              label={t("auth.email", "Email")}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              label={t("auth.password", "Mot de passe")}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              label={t("auth.confirmPassword", "Confirmer le mot de passe")}
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mb: { xs: 10, md: 0 },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                {t("auth.registerButton", "S'inscrire")}
              </Button>
              <Button
                component={Link}
                to="/connexion"
                variant="contained"
                sx={{ mt: 2 }}
              >
                {t("auth.backToLogin", "Retour")}
              </Button>
            </Box>
          </Box>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default RegisterForm;
