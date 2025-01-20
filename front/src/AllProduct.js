import {
  Box,
  IconButton,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Modal,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

function AllProduct() {
  const [products, setProducts] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Fetch des produits au chargement
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        "http://37.187.225.41:3002/api/v1/products/"
      );
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  // Suppression d'un produit
  const handleDelete = async (id) => {
    try {
      // Récupérer le jeton d'accès depuis le stockage local
      const token = localStorage.getItem("token");

      if (!token) {
        setSnackbarMessage(
          "Vous devez être connecté pour supprimer un produit."
        );
        setOpenSnackbar(true);
        return;
      }

      const response = await fetch(
        `http://37.187.225.41:3002/api/v1/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Inclure le jeton d'accès dans l'en-tête
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      // Mettre à jour l'état des produits après la suppression
      setProducts(products.filter((product) => product.id !== id));
      setSnackbarMessage("Produit supprimé avec succès !");
      setOpenSnackbar(true);
    } catch (error) {
      setSnackbarMessage("Erreur lors de la suppression : " + error.message);
      setOpenSnackbar(true);
    }
  };

  // Ouvrir le modal de modification
  const handleOpenModal = (product) => {
    setCurrentProduct(product);
    setOpenModal(true);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentProduct(null);
  };

  // Modifier un produit
  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSnackbarMessage(
          "Vous devez être connecté pour modifier un produit."
        );
        setOpenSnackbar(true);
        return;
      }

      // Vérifiez que l'ID est correct
      if (!currentProduct || !currentProduct.id) {
        throw new Error("Aucun produit sélectionné pour la mise à jour.");
      }

      const simplifiedProduct = {
        id: currentProduct.id,
        nom: currentProduct.nom,
        prix: currentProduct.prix,
        description: currentProduct.description,
        stock: currentProduct.stock,
        conseilsUtilisation: currentProduct.conseilsUtilisation || "",
        newPrice: currentProduct.newPrice || null,
        discount: currentProduct.discount || null,
      };

      console.log("Données à envoyer :", simplifiedProduct);

      const response = await fetch(
        `http://37.187.225.41:3002/api/v1/products/${currentProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(simplifiedProduct),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorMessage}`);
      }

      // Mettre à jour la liste des produits
      setProducts(
        products.map((product) =>
          product.id === currentProduct.id ? currentProduct : product
        )
      );

      setSnackbarMessage("Produit modifié avec succès !");
      setOpenSnackbar(true);
      handleCloseModal();
    } catch (error) {
      setSnackbarMessage("Erreur lors de la modification : " + error.message);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box
      sx={{
        mt: 12,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          component={Link}
          to="/dashboard"
          sx={{ alignSelf: "flex-start", ml: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: "semibold", mt: 0.5 }}
        >
          Tous les produits
        </Typography>
      </Box>
      <Button
        component={Link}
        to="/addproduct"
        variant="contained"
        sx={{ alignSelf: "flex-end", mt: 2, mr: 10 }}
      >
        Ajouter un Produit
      </Button>
      <TableContainer component={Paper} sx={{ maxWidth: "90%", mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Image
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Nom du Produit
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Prix (€)
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Stock
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Description
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell align="center">
                  <img
                    src={product.medias?.imageUrls?.[0]}
                    alt={product.nom}
                    style={{ width: "70px", height: "70px" }}
                  />
                </TableCell>
                <TableCell align="left">{product.nom}</TableCell>
                <TableCell align="center">{product.prix}</TableCell>
                <TableCell align="center">{product.stock}</TableCell>
                <TableCell
                  align="left"
                  sx={{
                    lineHeight: "1.5",
                    textAlign: "justify",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {product.description}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleOpenModal(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)}>
                    <DeleteIcon sx={{ color: "#B88E2F" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Modifier le Produit
          </Typography>
          {currentProduct && (
            <>
              <TextField
                label="Nom"
                value={currentProduct.nom || ""}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, nom: e.target.value })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={currentProduct.description || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    description: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                label="Conseils d'utilisation"
                value={currentProduct.conseilsUtilisation || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    conseilsUtilisation: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Prix"
                value={currentProduct.prix || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    prix: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Nouveau Prix"
                value={currentProduct.newPrice || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    newPrice: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Stock"
                type="number"
                value={currentProduct.stock || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    stock: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Remise (%)"
                type="number"
                value={currentProduct.discount || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    discount: e.target.value,
                  })
                }
                fullWidth
                margin="normal"
              />
              <Button
                onClick={handleUpdateProduct}
                variant="contained"
                sx={{ mt: 2 }}
              >
                Enregistrer
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}

export default AllProduct;
