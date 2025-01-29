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

function ConnexionForm() {
  const navigate = useNavigate();
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
      setError(err.response?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Formulaire côté gauche */}
        <Box
          sx={{
            width: "50%",
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
              maxWidth: "500px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Typography variant="h3" sx={{ textAlign: "center", mb: 4 }}>
              Connexion
            </Typography>

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Mot de passe"
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
                sx={{ fontSize: "1.2em" }}
              >
                Se connecter
              </Button>
              <Typography variant="body2">
                Vous avez oublié votre mot de passe ?
              </Typography>
              <Divider sx={{ width: "100%", my: 2 }} />
              <Typography variant="body1">
                Vous n'avez pas de compte ?
                <Typography
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{ textDecoration: "none", color: "primary.main", ml: 1 }}
                >
                  Inscription
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Image côté droit */}
        <Box
          sx={{
            width: "50%",
            height: "100vh",
            display: { xs: "none", md: "block" },
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
            Connexion réussie
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
