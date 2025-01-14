import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
        "https://pestcontrol33.vercel.app/api/v1/auth/login",
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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 400, mx: "auto", mt: 3 }}
      >
        <Typography
          variant="h4"
          sx={{ textAlign: "center", mt: 5 }}
          gutterBottom
        >
          Connexion
        </Typography>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Mot de passe"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Se connecter
        </Button>
        <Divider sx={{ mt: 3 }} />
        <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
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
  );
}

export default ConnexionForm;
