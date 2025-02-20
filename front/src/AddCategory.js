import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  IconButton,
  Fade,
  Divider,
  Snackbar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import fondImage from "../src/Assets/fond.png";
import MuiAlert from "@mui/material/Alert";

function AddCategory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({
        open: true,
        message: "Vous devez être connecté pour créer une catégorie",
        severity: "error",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [navigate]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        // 5MB limit
        setSnackbar({
          open: true,
          message: "L'image est trop volumineuse. Taille maximum : 5MB",
          severity: "error",
        });
        return;
      }
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSnackbar({
        open: true,
        message: "Image téléchargée avec succès",
        severity: "success",
      });
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    setSnackbar({
      open: true,
      message: "Image supprimée",
      severity: "info",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbar({
        open: true,
        message: "Vous devez être connecté pour créer une catégorie",
        severity: "error",
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    if (!formData.name || !formData.description || !image) {
      setError("Veuillez remplir tous les champs et ajouter une image");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("picture", image);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/subCategories/add`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setSnackbar({
            open: true,
            message: "Session expirée, veuillez vous reconnecter",
            severity: "error",
          });
          localStorage.removeItem("token");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          return;
        }
        throw new Error(
          result.message || "Erreur lors de la création de la catégorie"
        );
      }

      setSnackbar({
        open: true,
        message: "Catégorie créée avec succès !",
        severity: "success",
      });

      setFormData({
        name: "",
        description: "",
      });
      setImage(null);
      setPreviewUrl(null);

      setTimeout(() => {
        navigate("/allcategory");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Box
        sx={{
          backgroundImage: `url(${fondImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: { xs: "200px", sm: "250px", md: "300px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          mb: { xs: 2, sm: 3, md: 5 },
          mt: { xs: 6, sm: 7, md: 8 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: "600",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            color: "#2c3e50",
          }}
        >
          Ajouter une catégorie
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography sx={{ color: "#34495e" }}>
            <Link
              to="/allcategory"
              style={{
                textDecoration: "none",
                color: "#34495e",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <ArrowBackIcon fontSize="small" /> Retour au catégories
            </Link>
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mt: 3,
              borderRadius: 2,
              backgroundColor: "white",
              boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
            }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 1 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    color: "#2c3e50",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  Informations de la catégorie
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <TextField
                  fullWidth
                  label="Nom de la catégorie"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2c3e50",
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#2c3e50",
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 4, textAlign: "center" }}>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      mb: 2,
                      px: 3,
                      py: 1.5,
                      borderColor: "#2c3e50",
                      color: "#2c3e50",
                      "&:hover": {
                        borderColor: "#2c3e50",
                        backgroundColor: "rgba(44, 62, 80, 0.04)",
                      },
                    }}
                  >
                    Choisir une image
                  </Button>
                </label>

                {previewUrl && (
                  <Box
                    sx={{
                      mt: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      width: "fit-content",
                      margin: "0 auto",
                    }}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt="Aperçu"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <IconButton
                        onClick={removeImage}
                        sx={{
                          ml: 1,
                          color: "#dc3545",
                          "&:hover": {
                            backgroundColor: "rgba(220, 53, 69, 0.1)",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Paper>
                  </Box>
                )}
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  component={Link}
                  to="/allcategory"
                  variant="outlined"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderColor: "#2c3e50",
                    color: "#2c3e50",
                    "&:hover": {
                      borderColor: "#2c3e50",
                      backgroundColor: "rgba(44, 62, 80, 0.04)",
                    },
                  }}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Créer la catégorie
                </Button>
              </Box>
            </form>
          </Paper>
        </Fade>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default AddCategory;
