import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Divider,
  Container,
} from "@mui/material";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import fondImage from "../../Assets/fond.png";
import { useTranslation } from "react-i18next";

function ConnexionForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        formData
      );

      // Stockage du token dans le localStorage
      localStorage.setItem("token", response.data.token);

      setOpenSnackbar(true);
      setError("");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t("errors.default", "Une erreur est survenue")
      );
    }
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: "100vh",
          width: "100vw",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Formulaire côté gauche */}
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            backgroundColor: "white", // Ajout d'un fond blanc sur mobile pour plus de lisibilité
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              maxWidth: "500px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Typography variant="h4" sx={{ textAlign: "center", mb: 4 }}>
              {t("auth.login", "Connexion")}
            </Typography>

            <TextField
              fullWidth
              label={t("auth.email", "Email")}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label={t("auth.password", "Mot de passe")}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                gap: 2,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  fontSize: "1.2em",
                  padding: "12px",
                }}
              >
                {t("auth.loginButton", "Se connecter")}
              </Button>
              <Typography
                component={Link}
                to="/updatepassword"
                variant="body2"
                sx={{
                  textDecoration: "none",
                  color: "black",
                  "&:hover": { color: "primary.main" },
                }}
              >
                {t(
                  "auth.forgotPassword",
                  "Vous avez oublié votre mot de passe ?"
                )}
              </Typography>
              <Divider sx={{ width: "100%", my: 1 }} />
              <Typography variant="body1">
                {t("auth.noAccount", "Vous n'avez pas de compte ?")}
                <Typography
                  component={Link}
                  to="/register"
                  variant="body2"
                  sx={{
                    textDecoration: "none",
                    color: "primary.main",
                    ml: 1,
                  }}
                >
                  {t("auth.register", "Inscription")}
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Image côté droit */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: "50%",
            height: "100vh",
            backgroundImage: `url(${fondImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {t("auth.loginSuccess", "Connexion réussie")}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={() => setError("")}
        >
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default ConnexionForm;
