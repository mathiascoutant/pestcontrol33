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
import { useTranslation } from "react-i18next";
function Profil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { t } = useTranslation();
  const [user, setUser] = useState({
    nom: "",
    prenom: "",
    pseudo: "",
    email: "",
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
        console.log("Données reçues de l'API:", userData);
        if (userData) {
          setUser({
            nom: userData.nom || "",
            prenom: userData.prenom || "",
            pseudo: userData.pseudo || "",
            email: userData.email || "",
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "80vh",
        width: "100%",
        mt: { xs: 12, sm: 4, md: 16 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Header />
      {error && <Typography color="error">{error}</Typography>}
      <Box
        sx={{
          width: "100%",
          maxWidth: { xs: "95%", sm: "80%", md: "600px" },
          my: { xs: 4, sm: 6, md: 8 },
          mx: "auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, sm: 4 },
            textAlign: "center",
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            fontWeight: "bold",
          }}
        >
          {t("profil.title", { defaultValue: "Bienvenue sur votre profil" })}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            width: "100%",
            p: { xs: 2, sm: 3, md: 4 },
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        >
          <TextField
            label={t("profil.nom", { defaultValue: "Nom" })}
            name="nom"
            value={user.nom || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label={t("profil.prenom", { defaultValue: "Prénom" })}
            name="prenom"
            value={user.prenom || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label={t("profil.pseudo", { defaultValue: "Pseudo" })}
            name="pseudo"
            value={user.pseudo || ""}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label={t("profil.email", { defaultValue: "Email" })}
            name="email"
            value={user.email || ""}
            onChange={handleChange}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdate}
            sx={{
              mt: 3,
              py: 1.5,
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            {t("profil.modifier", { defaultValue: "Modifier" })}
          </Button>
        </Box>
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
  );
}

export default Profil;
