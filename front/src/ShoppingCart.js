import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "./components/Layouts/Header";
import Footer from "./components/Layouts/Footer";
import fondImage from "./Assets/fond.png";
import { Link } from "react-router-dom";

function ShoppingCart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
    calculateTotal(cart);
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => {
      const price = parseFloat(item.price.replace("€", ""));
      return acc + price * item.quantity;
    }, 0);
    setTotal(sum);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    window.dispatchEvent(new Event("cartUpdate"));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    window.dispatchEvent(new Event("cartUpdate"));
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
        }}
      >
        <Typography
          variant="h3"
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
                                src="https://i.ebayimg.com/images/g/lnIAAOSwrudm12oS/s-l1600.webp"
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
                            parseFloat(item.price.replace("€", "")) *
                            item.quantity
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
      <Footer />
    </>
  );
}

export default ShoppingCart;
