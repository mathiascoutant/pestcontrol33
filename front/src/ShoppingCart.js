import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "./components/Layouts/Header";
import fondImage from "./Assets/fond.png";
import { Link } from "react-router-dom";
import axios from "axios";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Pour gérer la couleur de la Snackbar

  const fetchCartItems = useCallback(async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/shopping/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cartItems = response.data;

      // Vérifiez si le panier est vide
      if (cartItems.length === 0) {
        setCartItems([]); // Assurez-vous de définir un tableau vide si aucun produit
        setTotal(0); // Réinitialisez le total
        return;
      }

      // Récupérer les détails des produits pour chaque article du panier
      const itemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const productDetails = await fetchProductDetails(item.productId);
          return {
            ...item,
            price: productDetails ? productDetails.prix : 0,
            name: productDetails ? productDetails.nom : "Produit non trouvé",
          };
        })
      );

      setCartItems(itemsWithDetails);
      calculateTotal(itemsWithDetails);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const fetchProductDetails = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du produit :",
        error
      );
      return null;
    }
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => {
      const price =
        item.price && typeof item.price === "string"
          ? parseFloat(item.price.replace("€", "").trim())
          : parseFloat(item.price) || 0;

      return acc + price * (item.quantity || 0);
    }, 0);
    setTotal(sum);
  };

  const fetchProductById = async (userId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/shopping/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      return [];
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    window.dispatchEvent(new Event("cartUpdate"));

    const userId = 5;
    const products = await fetchProductById(userId);
    console.log(products);
  };

  const removeItemFromAPI = async (productId, quantity) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token non trouvé");
      return;
    }

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/shopping/`,
        {
          data: {
            productId,
            quantity, // Assurez-vous d'envoyer la quantité
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Produit supprimé avec succès :", response.data);
      } else {
        console.error("Erreur lors de la suppression :", response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  const removeItem = async (id) => {
    if (!id || typeof id !== "number") {
      console.error("ID invalide :", id);
      return;
    }

    // Récupérer l'élément correspondant à l'ID dans le panier
    const itemToRemove = cartItems.find((item) => item.id === id);
    if (!itemToRemove) {
      console.error("Produit non trouvé dans le panier");
      return;
    }

    // Suppression de l'élément dans l'API avec l'ID et la quantité
    await removeItemFromAPI(itemToRemove.productId, itemToRemove.quantity);

    // Mise à jour du panier local après suppression
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);

    // Mise à jour du localStorage pour refléter les modifications
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Recalcul du total
    calculateTotal(updatedCart);

    // Déclenchement d'un événement de mise à jour du panier
    window.dispatchEvent(new Event("cartUpdate"));

    // Afficher la Snackbar après la suppression
    setSnackbarMessage("Produit supprimé avec succès !");
    setSnackbarSeverity("success"); // Définir le type de notification
    setSnackbarOpen(true);
  };

  // Fonction pour fermer la Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Header />
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
          sx={{
            color: "#000",
            mb: 2,
            fontWeight: "bold",
          }}
        >
          Panier
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography sx={{ color: "#000" }}>
            <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
              Accueil
            </Link>
          </Typography>
          <Typography sx={{ color: "#000" }}>{">"}</Typography>
          <Typography sx={{ color: "#000" }}>Panier</Typography>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mb: 5 }}>
        {cartItems.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              borderRadius: 1,
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Votre panier est vide
            </Typography>
            <Typography sx={{ mb: 3, color: "text.secondary" }}>
              Ajoutez des produits à votre panier pour les voir apparaître ici
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{
                color: "#fff",
              }}
            >
              <Link
                to="/shop"
                style={{ textDecoration: "none", color: "#fff" }}
              >
                Continuer mes achats
              </Link>
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: "flex", gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <TableContainer component={Paper} sx={{ bgcolor: "#FAF4F4" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produits</TableCell>
                      <TableCell>Prix</TableCell>
                      <TableCell>Quantiter</TableCell>
                      <TableCell>Sous-Total</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: "80px",
                                height: "80px",
                                borderRadius: 1,
                                overflow: "hidden",
                                bgcolor: "#fff",
                              }}
                            >
                              <img
                                src={
                                  (item.medias &&
                                    item.medias.imageUrls &&
                                    item.medias.imageUrls[0]) ||
                                  "default-image-url.jpg"
                                }
                                alt={item.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </Box>
                            <Typography>{item.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            InputProps={{ inputProps: { min: 1 } }}
                            size="small"
                            sx={{ width: "70px" }}
                          />
                        </TableCell>
                        <TableCell>
                          {(
                            parseFloat(
                              item.price.replace
                                ? item.price.replace("€", "").trim()
                                : item.price
                            ) * item.quantity
                          ).toFixed(2)}
                          €
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => removeItem(item.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box sx={{ width: 300, bgcolor: "#FAF4F4", p: 3, borderRadius: 1 }}>
              <Typography variant="h5" sx={{ mb: 3 }}>
                Total panier
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography>Sous-total</Typography>
                <Typography>{total.toFixed(2)}€</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography>Total</Typography>
                <Typography sx={{ color: "#B88E2F", fontWeight: "bold" }}>
                  {total.toFixed(2)}€
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                sx={{ mb: 2, bgcolor: "#fff" }}
              />
              <Button
                variant="contained"
                component={Link}
                to="/payment"
                fullWidth
                sx={{
                  bgcolor: "#000",
                  color: "#fff",
                  "&:hover": {
                    bgcolor: "#333",
                  },
                }}
              >
                Paiement
              </Button>
            </Box>
          </Box>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{
            width: "100%",
            bgcolor: snackbarSeverity === "success" ? "green" : "red",
            color: "#fff",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ShoppingCart;
