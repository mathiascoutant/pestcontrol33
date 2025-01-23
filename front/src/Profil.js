import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import Header from "./components/Layouts/Header";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

function Profil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [user, setUser] = useState({
    nom: "",
    prenom: "",
    pseudo: "",
    email: "",
    telephone: "",
    adresse: "",
    codePostal: "",
    ville: "",
    pays: "",
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}`)
      .then((response) => response.json())
      .then((userData) => {
        if (userData) {
          setUser({
            nom: userData.nom || "",
            prenom: userData.prenom || "",
            pseudo: userData.pseudo || "",
            email: userData.email || "",
            telephone: userData.telephone || "",
            adresse: userData.adresse || "",
            codePostal: userData.codePostal || "",
            ville: userData.ville || "",
            pays: userData.pays || "",
          });
        } else {
          setError("Utilisateur non trouvé");
        }
      })
      .catch(() => {
        setError("Erreur lors de la récupération des informations");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/users/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(user),
          }
        );

        if (!response.ok)
          throw new Error("Erreur lors de la mise à jour des informations");

        setSnackbar({
          open: true,
          message: "Informations mises à jour avec succès !",
          severity: "success",
        });
      } catch {
        setSnackbar({
          open: true,
          message: "Erreur lors de la mise à jour des informations.",
          severity: "error",
        });
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 10 }}>
      <Header />
      {error && <Typography color="error">{error}</Typography>}
      <Box
        sx={{
          my: 22,
          Width: "100vh",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 5, textAlign: "center", fontSize: 30 }}
        >
          Bienvenue sur votre profil
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 600,
            margin: "0 auto",
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        >
          <TextField
            label="Nom"
            name="nom"
            value={user.nom || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Prénom"
            name="prenom"
            value={user.prenom || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Pseudo"
            name="pseudo"
            value={user.pseudo || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={user.email || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Téléphone"
            name="telephone"
            value={user.telephone || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Adresse"
            name="adresse"
            value={user.adresse || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Code postal"
            name="codePostal"
            value={user.codePostal || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Ville"
            name="ville"
            value={user.ville || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Pays"
            name="pays"
            value={user.pays || ""}
            onChange={handleChange}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            sx={{ mt: 2 }}
          >
            Modifier
          </Button>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default Profil;
