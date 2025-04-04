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
import { useTranslation } from "react-i18next";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Pour gérer la couleur de la Snackbar
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const { t } = useTranslation();
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
        setCartItems([]);
        setTotal(0);
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
            medias: productDetails ? productDetails.medias : null, // Ajout des médias
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
      // Prendre le premier élément car l'API renvoie un tableau
      const product = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      return product;
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

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      // Trouver l'élément à mettre à jour
      const itemToUpdate = cartItems.find((item) => item.id === id);
      if (!itemToUpdate) return;

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token non trouvé");
        return;
      }

      // Calcul de la différence de quantité
      const quantityDifference = newQuantity - itemToUpdate.quantity;

      // Si la quantité n'a pas changé, ne rien faire
      if (quantityDifference === 0) return;

      // Préparer le corps de la requête pour l'API
      const requestBody = {
        productId: itemToUpdate.productId,
        quantity: Math.abs(quantityDifference), // Utiliser la valeur absolue de la différence
      };

      // Mettre à jour la quantité sur le serveur
      if (quantityDifference > 0) {
        // Ajouter des produits si la quantité augmente
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/shopping/`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Supprimer des produits si la quantité diminue
        await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/shopping/`, {
          data: requestBody,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      // Mettre à jour l'état local après la réussite de la requête API
      const updatedCart = cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );

      setCartItems(updatedCart);
      calculateTotal(updatedCart);

      // Déclencher l'événement de mise à jour du panier
      window.dispatchEvent(new Event("cartUpdate"));

      // Afficher une notification de succès
      setSnackbarMessage("Quantité mise à jour avec succès !");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la quantité :", error);
      setSnackbarMessage("Erreur lors de la mise à jour de la quantité");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
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

  const applyDiscount = async () => {
    const token = localStorage.getItem("token");

    if (!couponCode.trim()) {
      setSnackbarMessage("Veuillez entrer un code promo");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Récupérer les codes promos déjà utilisés depuis le localStorage
    const usedCoupons = JSON.parse(localStorage.getItem("usedCoupons")) || [];

    if (usedCoupons.includes(couponCode.toUpperCase())) {
      setSnackbarMessage("Vous avez déjà utilisé ce code promo !");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/discountShopping`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const validCode = response.data.discountCodes.find(
        (code) => code.code === couponCode.toUpperCase()
      );

      if (validCode) {
        const now = new Date();
        const startDate = new Date(validCode.startDate);
        const endDate = new Date(validCode.endDate);

        if (now < startDate || now > endDate) {
          setSnackbarMessage("Ce code promo n'est pas valide");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        if (
          !validCode.multiUsage &&
          validCode.nbrUsed >= validCode.nbrAutorisationUsage
        ) {
          setSnackbarMessage("Ce code promo a atteint sa limite d'utilisation");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
          return;
        }

        const discount = parseFloat(validCode.discount);
        setDiscountAmount(discount);
        const discountedTotal = total * (1 - discount / 100);
        setTotal(discountedTotal);

        // Stocker les informations de réduction dans localStorage pour la page de paiement
        localStorage.setItem("appliedCoupon", couponCode.toUpperCase());
        localStorage.setItem("discountAmount", discount.toString());
        localStorage.setItem("discountedTotal", discountedTotal.toString());

        setSnackbarMessage(
          `Code promo appliqué ! -${discount}% sur votre commande`
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Ajouter le code promo à la liste des codes utilisés
        usedCoupons.push(couponCode.toUpperCase());
        localStorage.setItem("usedCoupons", JSON.stringify(usedCoupons));
      } else {
        setSnackbarMessage("Code promo invalide");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code promo:", error);
      setSnackbarMessage("Erreur lors de la vérification du code promo");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
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
          {t("shoppingCart.title", "Panier")}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography sx={{ color: "#000" }}>
            <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
              {t("navigation.home", "Accueil")}
            </Link>
          </Typography>
          <Typography sx={{ color: "#000" }}>{">"}</Typography>
          <Typography sx={{ color: "#000" }}>
            {t("shoppingCart.title", "Panier")}
          </Typography>
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
              {t("shoppingCart.empty", "Votre panier est vide")}
            </Typography>
            <Typography sx={{ mb: 3, color: "text.secondary" }}>
              {t("shoppingCart.emptyDescription", "Ajoutez des produits à votre panier pour les voir apparaître ici")}
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
                style={{ textDecoration: "none", color: "black" }}
              >
                {t("shoppingCart.continueShopping", "Continuer mes achats")}
              </Link>
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexDirection: { xs: "column", md: "row" }, // Empile en colonnes sur mobile, en ligne sur desktop
            }}
          >
            <Box sx={{ flex: 1 }}>
              <TableContainer
                component={Paper}
                sx={{
                  bgcolor: "#FAF4F4",
                  overflow: "auto",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  maxWidth: "100%",
                  mb: { xs: 3, sm: 0 }, // Ajoute une marge en bas sur mobile
                }}
              >
                <Table
                  sx={{
                    minWidth: { xs: 280, sm: 650 },
                  }}
                >
                  <TableHead
                    sx={{ display: { xs: "none", sm: "table-header-group" } }}
                  >
                    {" "}
                    {/* Masque l'en-tête sur mobile */}
                    <TableRow>
                      <TableCell>{t("shoppingCart.products", "Produits")}</TableCell>
                      <TableCell align="center">{t("shoppingCart.price", "Prix")}</TableCell>
                      <TableCell align="center">{t("shoppingCart.quantity", "Quantité")}</TableCell>
                      <TableCell align="center">{t("shoppingCart.subtotal", "Sous-Total")}</TableCell>
                      <TableCell align="center">{t("shoppingCart.action", "Action")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow
                        key={item.id}
                        sx={{
                          "&:not(:last-child)": {
                            borderBottom: {
                              xs: "8px solid #e0e0e0",
                              sm: "1px solid rgba(224, 224, 224, 1)",
                            },
                          },
                          py: { xs: 2, sm: 1 },
                        }}
                      >
                        <TableCell
                          sx={{
                            display: { xs: "table-cell", sm: "table-cell" },
                            py: { xs: 2, sm: 1 },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: { xs: "column", sm: "row" },
                              alignItems: { xs: "flex-start", sm: "center" },
                              gap: { xs: 2, sm: 2 },
                              width: "100%", // Utilise toute la largeur disponible
                            }}
                          >
                            <Box
                              sx={{
                                width: { xs: "100px", sm: "80px" },
                                height: { xs: "100px", sm: "80px" },
                                borderRadius: 1,
                                overflow: "hidden",
                                bgcolor: "#fff",
                                border: "1px solid #eaeaea",
                                flexShrink: 0, // Empêche l'image de rétrécir
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
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: { xs: "100%", sm: "auto" }, // Prend toute la largeur sur mobile
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: { xs: "1rem", sm: "1rem" },
                                  fontWeight: "500",
                                  mb: { xs: 1, sm: 0 },
                                }}
                              >
                                {item.name}
                              </Typography>
                              {/* Informations supplémentaires visibles uniquement sur mobile */}
                              <Box
                                sx={{
                                  display: { xs: "flex", sm: "none" },
                                  flexDirection: "column",
                                  mt: 1,
                                  gap: 1.5,
                                  width: "100%",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                    pb: 1,
                                    borderBottom: "1px dashed #e0e0e0",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {t("shoppingCart.unitPrice", "Prix unitaire")}
                                  </Typography>
                                  <Typography variant="body1" fontWeight="500">
                                    {item.price}
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                    pb: 1,
                                    borderBottom: "1px dashed #e0e0e0",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {t("shoppingCart.quantity", "Quantité")}
                                  </Typography>
                                  <TextField
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      updateQuantity(
                                        item.id,
                                        parseInt(e.target.value) || 1
                                      )
                                    }
                                    InputProps={{
                                      inputProps: { min: 1 },
                                      sx: {
                                        borderRadius: 1,
                                        height: "36px",
                                        bgcolor: "#fff",
                                      },
                                    }}
                                    size="small"
                                    sx={{ width: "80px" }}
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                    pb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {t("shoppingCart.subtotal", "Sous-Total")}
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    color="primary"
                                  >
                                    {(
                                      parseFloat(
                                        item.price.replace
                                          ? item.price.replace("€", "").trim()
                                          : item.price
                                      ) * item.quantity
                                    ).toFixed(2)}
                                    €
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ display: { xs: "none", sm: "table-cell" } }}
                        >
                          {item.price}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ display: { xs: "none", sm: "table-cell" } }}
                        >
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            InputProps={{
                              inputProps: { min: 1 },
                              sx: {
                                borderRadius: 1,
                                height: "36px",
                              },
                            }}
                            size="small"
                            sx={{ width: "70px" }}
                          />
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ display: { xs: "none", sm: "table-cell" } }}
                        >
                          {(
                            parseFloat(
                              item.price.replace
                                ? item.price.replace("€", "").trim()
                                : item.price
                            ) * item.quantity
                          ).toFixed(2)}
                          €
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            display: { xs: "table-cell", sm: "table-cell" },
                            position: { xs: "absolute", sm: "static" },
                            right: { xs: 16, sm: "auto" },
                            top: { xs: "auto", sm: "auto" },
                          }}
                        >
                          <IconButton
                            onClick={() => removeItem(item.id)}
                            color="error"
                            sx={{
                              padding: { xs: 1, sm: 1 },
                              bgcolor: {
                                xs: "rgba(255,255,255,0.5)",
                                sm: "transparent",
                              },
                              "&:hover": {
                                bgcolor: {
                                  xs: "rgba(255,0,0,0.05)",
                                  sm: "rgba(255,0,0,0.05)",
                                },
                              },
                            }}
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

            <Box
              sx={{
                width: { xs: "100%", md: 300 },
                bgcolor: "#FAF4F4",
                p: { xs: 3, sm: 3 },
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                border: "1px solid #eaeaea",
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, fontWeight: "500" }}>
                {t("shoppingCart.total", "Total panier")}
              </Typography>

              <Box
                sx={{
                  py: 2,
                  px: 2,
                  bgcolor: "#fff",
                  borderRadius: 2,
                  mb: 3,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography color="text.secondary">{t("shoppingCart.subtotal", "Sous-Total")}</Typography>
                  <Typography>{total.toFixed(2)}€</Typography>
                </Box>

                {discountAmount > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                      pb: 2,
                      borderBottom: "1px dashed #e0e0e0",
                    }}
                  >
                    <Typography color="text.secondary">{t("shoppingCart.discount", "Réduction")}</Typography>
                    <Typography color="error">-{discountAmount}%</Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    pt: discountAmount > 0 ? 1 : 0,
                    borderTop:
                      discountAmount > 0 ? "none" : "1px dashed #e0e0e0",
                  }}
                >
                  <Typography fontWeight="500">{t("shoppingCart.total", "Total")}</Typography>
                  <Typography
                    sx={{
                      color: "#B88E2F",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    {total.toFixed(2)}€
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: "500" }}
                >
                  {t("shoppingCart.promoCode", "Code promo")}
                </Typography>
                <TextField
                  fullWidth
                  placeholder={t("shoppingCart.promoCodePlaceholder", "Entrez votre code")}
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setDiscountError("");
                  }}
                  error={!!discountError}
                  helperText={discountError}
                  sx={{
                    mb: 1.5,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#fff",
                      borderRadius: 1,
                    },
                  }}
                />
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={applyDiscount}
                  sx={{
                    mb: 0,
                    py: 1,
                    borderRadius: 1,
                    borderColor: "#B88E2F",
                    color: "#B88E2F",
                    "&:hover": {
                      borderColor: "#9A7526",
                      bgcolor: "rgba(184, 142, 47, 0.04)",
                    },
                  }}
                >
                  {t("shoppingCart.applyDiscount", "Appliquer le code")}
                </Button>
              </Box>

              <Button
                variant="contained"
                component={Link}
                to="/payment"
                fullWidth
                sx={{
                  bgcolor: "#000",
                  color: "#fff",
                  py: { xs: 1.5, sm: 1.5 },
                  fontSize: { xs: "1rem", sm: "1rem" },
                  fontWeight: "500",
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "#333",
                  },
                }}
              >
                {t("shoppingCart.proceedToPayment", "Procéder au paiement")}
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
