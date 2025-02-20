import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  const [categoryId, setCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState([]);

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

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/subCategories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubCategories(response.data.subCategories);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des sous-catégories:",
          error
        );
        setSnackbarMessage(
          "Erreur lors de la récupération des sous-catégories"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };

    fetchSubCategories();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Validation des champs requis
    if (!productName || !price || !stock || !description || !categoryId) {
      setSnackbarMessage(
        "Veuillez remplir tous les champs obligatoires (nom, prix, stock, description et catégorie)"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    // Formatage et ajout des données au FormData
    formData.append("nom", productName.trim());
    formData.append("description", description.trim());
    formData.append("prix", parseFloat(price));
    formData.append("stock", parseInt(stock));
    formData.append("status", parseInt(status) || 1);
    formData.append("conseilsUtilisation", usageAdvice.trim());
    formData.append("subCategoryId", categoryId);

    // Vérification et ajout des images
    if (images && images.length > 0) {
      Array.from(images).forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      const url = id
        ? `${process.env.REACT_APP_API_BASE_URL}/products/${id}`
        : `${process.env.REACT_APP_API_BASE_URL}/products/add`;

      const method = id ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSnackbarMessage(
        id ? "Produit modifié avec succès" : "Produit ajouté avec succès"
      );
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // Redirection après succès
      setTimeout(() => {
        navigate("/allproduct");
      }, 2000);
    } catch (error) {
      console.error("Erreur détaillée:", error.response?.data || error.message);
      setSnackbarMessage(
        error.response?.data?.message ||
          "Erreur lors de l'ajout ou de la mise à jour du produit. Vérifiez les champs saisis."
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
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="subcategory-label">Sous-catégorie</InputLabel>
            <Select
              labelId="subcategory-label"
              id="subcategory-select"
              value={categoryId}
              label="Sous-catégorie"
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {subCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
