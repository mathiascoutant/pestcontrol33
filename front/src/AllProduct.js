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
  InputAdornment,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import fondImage from "../src/Assets/fond.png";

function AllProduct() {
  const [products, setProducts] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch des produits au chargement
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/products/`
        );
        const data = await response.json();

        // Récupérer le nombre d'avis pour chaque produit
        const productsWithReviews = await Promise.all(
          data.map(async (product) => {
            const reviewResponse = await fetch(
              `${process.env.REACT_APP_API_BASE_URL}/comment/${product.id}`
            );
            const reviewData = await reviewResponse.json();
            return { ...product, reviewCount: reviewData.commentCount || 0 };
          })
        );

        setProducts(productsWithReviews);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };

    fetchProducts();
  }, []);

  // Suppression d'un produit
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSnackbarMessage(
          "Vous devez être connecté pour supprimer un produit."
        );
        setOpenSnackbar(true);
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

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

      if (!currentProduct || !currentProduct.id) {
        throw new Error("Aucun produit sélectionné pour la mise à jour.");
      }

      // S'assurer que tous les champs numériques sont bien des nombres
      const simplifiedProduct = {
        nom: currentProduct.nom?.trim(),
        prix: currentProduct.prix ? Number(currentProduct.prix) : 0,
        description: currentProduct.description?.trim(),
        stock: currentProduct.stock ? Number(currentProduct.stock) : 0,
        conseilsUtilisation: currentProduct.conseilsUtilisation?.trim() || "",
        newPrice: currentProduct.newPrice
          ? Number(currentProduct.newPrice)
          : null,
        discount: currentProduct.discount
          ? Number(currentProduct.discount)
          : null,
        status: 1, // Ajout du status si nécessaire
      };

      // Vérifier qu'aucune valeur n'est NaN
      if (
        isNaN(simplifiedProduct.prix) ||
        isNaN(simplifiedProduct.stock) ||
        (simplifiedProduct.newPrice !== null &&
          isNaN(simplifiedProduct.newPrice)) ||
        (simplifiedProduct.discount !== null &&
          isNaN(simplifiedProduct.discount))
      ) {
        throw new Error("Les valeurs numériques sont invalides");
      }

      console.log("Données à envoyer :", simplifiedProduct);

      const updateResponse = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/products/${currentProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(simplifiedProduct),
        }
      );

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(
          errorData.message || "Erreur lors de la mise à jour du produit"
        );
      }

      const data = await updateResponse.json();
      console.log("API Response:", data);

      // Mise à jour de la liste des produits
      setProducts(
        products.map((product) =>
          product.id === currentProduct.id
            ? { ...product, ...simplifiedProduct }
            : product
        )
      );

      setSnackbarMessage("Produit mis à jour avec succès !");
      setOpenSnackbar(true);
      handleCloseModal();

      // Navigation après succès
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Erreur de mise à jour du produit :", error);
      setSnackbarMessage("Erreur lors de la mise à jour : " + error.message);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundImage: `url(${fondImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mb: 5,
          mt: 8,
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 2, fontWeight: "semibold", mt: 0.5 }}
        >
          Les produits
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography sx={{ color: "#000" }}>
            <Link
              to="/dashboard"
              style={{ textDecoration: "none", color: "#000" }}
            >
              Dashboard
            </Link>
          </Typography>
          <Typography sx={{ color: "#000" }}>{">"}</Typography>
          <Typography sx={{ color: "#000" }}>Les produits</Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "300px", marginLeft: 10 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          component={Link}
          to="/addproduct"
          variant="contained"
          sx={{ alignSelf: "flex-end", mt: 2, mr: 10 }}
        >
          Ajouter un Produit
        </Button>
      </Box>
      <TableContainer
        component={Paper}
        sx={{ maxWidth: "95%", mt: 2, ml: 4.5 }}
      >
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
                Avis
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
            {products
              .filter((product) =>
                product.nom.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product) => {
                return (
                  <TableRow key={product.id}>
                    <TableCell align="center">
                      <img
                        src={product.medias?.imageUrls?.[0]}
                        alt={product.nom}
                        style={{
                          width: "90px",
                          height: "90px",
                          borderRadius: 5,
                        }}
                      />
                    </TableCell>
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
                      {product.nom}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      {product.prix} €
                    </TableCell>
                    <TableCell align="center">{product.reviewCount}</TableCell>
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
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      >
        <Alert severity="success">Produit supprimé avec succès !</Alert>
      </Snackbar>
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
                label="Réduction (%)"
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
