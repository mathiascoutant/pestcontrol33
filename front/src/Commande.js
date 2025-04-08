import {
  Box,
  Typography,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function Commande() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://pestcontrol33.com/api/v1/payments/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des factures");
      }

      const data = await response.json();
      setFactures(data.paiements || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFacture = (urlInvoice) => {
    window.open(urlInvoice, "_blank");
  };

  const parseProducts = (productsString) => {
    try {
      return JSON.parse(productsString);
    } catch (error) {
      console.error("Erreur lors du parsing des produits:", error);
      return [];
    }
  };

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

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 150px)",
        display: "flex",
        flexDirection: "column",
        pb: 4,
        mt: 10,
      }}
    >
      <Typography variant="h4" sx={{ textAlign: "center", mt: 5, mb: 4 }}>
        {t("commande.title", { defaultValue: "Mes commandes" })}
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ width: "80%", mx: "auto", mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && factures.length === 0 && (
        <Alert severity="info" sx={{ width: "80%", mx: "auto", mb: 3 }}>
          {t("commande.noOrders", {
            defaultValue: "Aucune commande disponible",
          })}
        </Alert>
      )}

      {!loading && !error && factures.length > 0 && (
        <Box sx={{ px: 4, py: 2, flexGrow: 1 }}>
          <Grid container spacing={3}>
            {factures.map((facture) => {
              const products = parseProducts(facture.products);

              return (
                <Grid item xs={12} md={6} lg={4} key={facture.id}>
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
                          {t("commande.order", { defaultValue: "Commande" })} #
                          {facture.id}
                        </Typography>
                        <Chip
                          label={`${parseFloat(facture.totalPrice).toFixed(2)}${
                            facture.currency
                          }`}
                          color="primary"
                          sx={{ fontWeight: "bold" }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {formatDate(facture.createdAt)}
                      </Typography>

                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                      >
                        {t("commande.invoice", {
                          defaultValue: "Référence de facture",
                        })}
                        :
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {facture.invoice}
                      </Typography>

                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                      >
                        {t("commande.products", { defaultValue: "Produits" })}:
                      </Typography>

                      {products.map((product, index) => (
                        <Box key={index} sx={{ mb: 1 }}>
                          <Typography variant="body2">
                            {product.name} x{product.quantity} ({product.price}
                            {t("commande.unit", { defaultValue: "€/unité" })})
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
                          <strong>
                            {t("commande.transport", {
                              defaultValue: "Frais de transport",
                            })}
                            :
                          </strong>{" "}
                          {facture.fraisTransport}
                          {t("commande.unit", { defaultValue: "€" })}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Button
                          variant="contained"
                          onClick={() => downloadFacture(facture.urlInvoice)}
                          fullWidth
                        >
                          {t("commande.viewInvoice", {
                            defaultValue: "Voir la facture",
                          })}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
}

export default Commande;
