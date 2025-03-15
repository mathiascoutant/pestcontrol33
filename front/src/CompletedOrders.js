import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import fondImage from "../src/Assets/fond.png";
import axios from "axios";

function CompletedOrders() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Token d'authentification non trouvé");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://pestcontrol33.com/api/v1/payments/getall",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPayments(response.data.paiements);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des paiements:", err);
        setError("Erreur lors de la récupération des commandes");
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const parseProducts = (productsString) => {
    try {
      return JSON.parse(productsString);
    } catch (error) {
      console.error("Erreur lors du parsing des produits:", error);
      return [];
    }
  };

  return (
    <Box sx={{ mt: 8, textAlign: "center" }}>
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
          Commandes terminées
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
          <Typography sx={{ color: "#000" }}>Commandes terminées</Typography>
        </Box>
      </Box>

      {/* Affichage des commandes */}
      <Box sx={{ px: 4, py: 2 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : payments.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Aucune commande trouvée
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {payments.map((payment) => {
              const products = parseProducts(payment.products);

              return (
                <Grid item xs={12} md={6} lg={4} key={payment.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ flex: "1 0 auto", textAlign: "left" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" fontWeight="bold">
                          Commande #{payment.id}
                        </Typography>
                        <Chip
                          label={`${payment.totalPrice}€`}
                          color="primary"
                          sx={{ fontWeight: "bold" }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {formatDate(payment.createdAt)}
                      </Typography>

                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        sx={{ mb: 1 }}
                      >
                        Client: {payment.user.prenom} {payment.user.nom}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 2 }}>
                        <strong>Adresse:</strong> {payment.user.adresse},{" "}
                        {payment.user.codePostale} {payment.user.ville},{" "}
                        {payment.user.pays}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Email:</strong> {payment.user.email}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 2 }}>
                        <strong>Téléphone:</strong> {payment.user.telephone}
                      </Typography>

                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                      >
                        Produits:
                      </Typography>

                      {products.map((product, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            {product.name} x{product.quantity} ({product.price}
                            €/unité)
                          </Typography>
                        </Box>
                      ))}

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Frais de transport:</strong>{" "}
                          {payment.fraisTransport}€
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Button
                          variant="contained"
                          href={payment.urlInvoice}
                          target="_blank"
                          fullWidth
                        >
                          Voir la facture
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

export default CompletedOrders;
