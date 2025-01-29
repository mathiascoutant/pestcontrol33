import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function AddProduct() {
  const { id } = useParams();
  const [productName, setProductName] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState(0);
  const [description, setDescription] = useState("");
  const [usageAdvice, setUsageAdvice] = useState("");
  const [images, setImages] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const product = response.data;
          setProductName(product.nom);
          setStock(product.stock);
          setPrice(product.prix);
          setStatus(product.status);
          setDescription(product.description);
          setUsageAdvice(product.conseilsUtilisation);
          setImages(product.mediaUrls.imageUrls);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération du produit:", error);
          setSnackbarMessage("Erreur lors de la récupération du produit.");
          setOpenSnackbar(true);
        });
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nom", productName);
    formData.append("stock", stock);
    formData.append("prix", price);
    formData.append("status", status);
    formData.append("description", description);
    formData.append("conseilsUtilisation", usageAdvice);

    // Add images to FormData
    for (let i = 0; i < images.length; i++) {
      formData.append("mediaUrls.imageUrls", images[i]);
    }

    try {
      if (id) {
        // Update product
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/products/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("success");
      } else {
        // Add new product
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/products/add`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSnackbarMessage(response.data.message);
        setSnackbarSeverity("success");
        setTimeout(() => {
          navigate("/allproduct");
        }, 1000);
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout ou de la mise à jour du produit:",
        error
      );
      setSnackbarMessage(
        "Erreur lors de l'ajout ou de la mise à jour du produit."
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2, mt: 8 }}>
      <IconButton component={Link} to="/dashboard" sx={{ ml: 1 }}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 4 }}>
        Ajouter un produit
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", mt: 2 }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            margin: "auto",
          }}
        >
          <TextField
            label="Nom du produit"
            variant="outlined"
            value={productName}
            type="text"
            onChange={(e) => setProductName(e.target.value)}
            sx={{ width: "100%" }}
          />
          <TextField
            label="Stock"
            variant="outlined"
            value={stock}
            type="number"
            onChange={(e) => setStock(e.target.value)}
            sx={{ width: "100%" }}
          />
          <TextField
            label="Prix"
            variant="outlined"
            value={price}
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            sx={{ width: "100%" }}
          />
          <TextField
            label="Statut"
            variant="outlined"
            value={status}
            type="number"
            inputProps={{ min: 0, max: 1 }}
            onChange={(e) => setStatus(e.target.value)}
            sx={{ width: "100%" }}
          />
          <TextField
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            sx={{ width: "100%" }}
          />
          <TextField
            type="file"
            inputProps={{ multiple: true }}
            onChange={(e) => setImages(e.target.files)}
            sx={{ width: "100%" }}
          />
          <TextField
            label="Conseils d'utilisation"
            variant="outlined"
            value={usageAdvice}
            onChange={(e) => setUsageAdvice(e.target.value)}
            multiline
            rows={4}
            sx={{ width: "100%" }}
          />
          <Button variant="contained" type="submit">
            Ajouter
          </Button>
        </form>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        ContentProps={{
          sx: {
            backgroundColor: snackbarSeverity === "success" ? "green" : "red",
          },
        }}
      />
    </Box>
  );
}

export default AddProduct;
