/* global grecaptcha */ // Déclare grecaptcha en tant que variable globale

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
// import ReCAPTCHA from "react-google-recaptcha"; // Commenté pour le moment

function RegisterForm() {
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
  const [captchaToken, setCaptchaToken] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleCaptchaChange = (token) => { // Commenté pour le moment
  //   setCaptchaToken(token);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // Si le captcha n'est pas rempli
    //if (!captchaToken) {
      //setError("Veuillez compléter le CAPTCHA");
      //return;
    //}

    try {
      // Exécution de reCAPTCHA pour obtenir le token
      // const token = await grecaptcha.enterprise.execute( // Commenté pour le moment
      //   "6LdLC8gqAAAAACsAj4AJq9kSgny3tz1Nv4uoMN-R",
      //   { action: "register" }
      // );

      // Création des données du formulaire
      const data = {
        email: formData.email,
        password: formData.password,
        pseudo: formData.username,
        nom: formData.lastName,
        prenom: formData.firstName,
        // captchaToken: captchaToken, // Inclus le token reCAPTCHA ici (même s'il est vide pour le moment)
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
              Inscription
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              required
              fullWidth
              label="Nom"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              label="Prénom"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Pseudo"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              label="Mot de passe"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              label="Confirmer le mot de passe"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {/* reCAPTCHA intégré */}
            {/* <ReCAPTCHA
              sitekey="6LdLC8gqAAAAACsAj4AJq9kSgny3tz1Nv4uoMN-R"
              onChange={handleCaptchaChange}
            /> */}

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
                S'inscrire
              </Button>
              <Button
                component={Link}
                to="/connexion"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Retour
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
