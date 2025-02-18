import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Snackbar,
  Alert,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import { jwtDecode } from "jwt-decode";

const stripePromise = loadStripe(
  "pk_test_51QlSltB3Wls447R5cDklYX7cNoB2lX86UmHGlmSKIUysLgeU4GujbQGnRRRDHrUaXQRkAaSE152DyZkiQLzGe7aD00gThgaxGp"
);

const PersonalInfoForm = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  address,
  setAddress,
  city,
  setCity,
  postalCode,
  setPostalCode,
  phone,
  setPhone,
}) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" sx={{ mb: 4, fontWeight: 500 }}>
      Informations personnelles
    </Typography>

    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Prénom"
          fullWidth
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Nom"
          fullWidth
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Numéro de téléphone"
          fullWidth
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
            },
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Adresse"
          fullWidth
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Ville"
          fullWidth
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
            },
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Code postal"
          fullWidth
          required
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          variant="outlined"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#fff",
            },
          }}
        />
      </Grid>
    </Grid>
  </Box>
);

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchCartTotal = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/shopping/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const cartItems = await response.json();
        const itemsWithProducts = [];

        for (const item of cartItems) {
          const productResponse = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/products/${item.productId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const product = await productResponse.json();
          const price = parseFloat(product.prix.replace("€", "").trim());
          itemsWithProducts.push({
            ...item,
            product: product,
            totalPrice: price * item.quantity,
          });
        }

        const total = itemsWithProducts.reduce(
          (sum, item) => sum + item.totalPrice,
          0
        );
        setCartTotal(total);
        setCartItems(itemsWithProducts);
      } catch (error) {
        console.error("Erreur lors de la récupération du total:", error);
        setError("Erreur lors de la récupération du montant à payer");
      }
    };

    fetchCartTotal();
  }, []);

  const steps = ["Récapitulatif & Informations", "Paiement", "Confirmation"];

  const handleNext = () => {
    if (activeStep === 0) {
      if (
        !firstName ||
        !lastName ||
        !email ||
        !address ||
        !city ||
        !postalCode ||
        !phone
      ) {
        setError("Veuillez remplir tous les champs obligatoires");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Veuillez entrer une adresse email valide");
        return;
      }
    }
    setError(null);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Créer une intention de paiement côté serveur
      const createIntentResponse = await fetch(
        "https://pestcontrol33.com/api/v1/payments/stripe/clientSecret",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount: Math.round(cartTotal * 100),
            currency: "eur",
            payment_method_types: ["card"],
            setup_future_usage: "off_session",
          }),
        }
      );

      const intentData = await createIntentResponse.json();

      if (!intentData.client_secret) {
        throw new Error(
          "La réponse du serveur ne contient pas de client_secret"
        );
      }

      // 2. Confirmer le paiement avec l'authentification du client
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(intentData.client_secret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: `${firstName} ${lastName}`,
              email: email,
              address: {
                line1: address,
                city: city,
                postal_code: postalCode,
              },
              phone: phone,
            },
          },
          return_url: `${window.location.origin}/payment-confirmation`,
        });

      if (confirmError) {
        // Gérer les erreurs spécifiques à 3D Secure
        if (
          confirmError.type === "card_error" ||
          confirmError.type === "validation_error"
        ) {
          setError(confirmError.message);
        } else {
          setError("Une erreur inattendue s'est produite.");
        }
        return;
      }

      // 3. Vérifier le statut du paiement
      if (paymentIntent.status === "requires_action") {
        // L'authentification 3D Secure est requise
        const { error: actionError } = await stripe.handleCardAction(
          paymentIntent.client_secret
        );

        if (actionError) {
          setError(
            "L'authentification 3D Secure a échoué. Veuillez réessayer."
          );
          return;
        }
      }

      if (paymentIntent.status === "succeeded") {
        // Paiement réussi
        setActiveStep((prevStep) => prevStep + 1);
        setOpenSnackbar(true);
        localStorage.removeItem("cart");
        setCartItems([]);

        setTimeout(() => {
          navigate("/");
        }, 60000);
      }
    } catch (err) {
      console.error("Erreur complète:", err);
      setError(err.message || "Une erreur est survenue lors du paiement");
    } finally {
      setIsLoading(false);
    }
  };

  const OrderSummary = () => (
    <Box sx={{ mb: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, textAlign: "center", fontWeight: "700" }}
      >
        Récapitulatif de votre commande
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "0.5fr 2fr 1fr",
          gap: 2,
          mb: 2,
          borderBottom: "1px solid #ddd",
          pb: 1,
          fontWeight: "bold",
        }}
      >
        <Typography>Qté</Typography>
        <Typography>Produit</Typography>
        <Typography>Prix</Typography>
      </Box>
      {cartItems.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "grid",
            gridTemplateColumns: "0.5fr 2fr 1fr",
            gap: 2,
            mb: 1,
            alignItems: "center",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          <Typography>{item.quantity}</Typography>
          <Typography
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.product.nom}
          </Typography>
          <Typography>{item.totalPrice.toFixed(2)}€</Typography>
        </Box>
      ))}
      <Box
        sx={{
          borderTop: "2px solid #000",
          mt: 4,
          pt: 1,
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
          Total:
        </Typography>
        <Typography variant="h6" sx={{ mt: 1 }}>
          {cartTotal.toFixed(2)}€
        </Typography>
      </Box>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <PersonalInfoForm
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                address={address}
                setAddress={setAddress}
                city={city}
                setCity={setCity}
                postalCode={postalCode}
                setPostalCode={setPostalCode}
                phone={phone}
                setPhone={setPhone}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <OrderSummary />
              </Paper>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                maxWidth: "600px",
                width: "100%",
                mx: "auto",
              }}
            >
              <Typography
                variant="h5"
                sx={{ mb: 3, fontWeight: "500", textAlign: "center" }}
              >
                Informations de paiement
              </Typography>

              <Box sx={{ mb: 3, textAlign: "center" }}>
                <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
                  Montant à payer: <strong>{cartTotal.toFixed(2)}€</strong>
                </Typography>
              </Box>

              <Box
                sx={{
                  mb: 3,
                  p: 3,
                  backgroundColor: "#fff",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 2, color: "#424770", fontWeight: 500 }}
                >
                  Carte bancaire
                </Typography>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                        backgroundColor: "#fff",
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                🔒 Paiement sécurisé via Stripe
              </Typography>
            </Paper>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: "center", my: 10 }}>
            <Typography variant="h5" sx={{ mb: 2, color: "success.main" }}>
              Merci pour votre commande !
            </Typography>
            <Typography variant="body1">
              Un email de confirmation vous a été envoyé à {email}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{
                mt: 4,
                mb: 4,
                color: "#000",
                borderColor: "#ddd",
                "&:hover": {
                  borderColor: "#999",
                  backgroundColor: "#f5f5f5",
                },
              }}
              onClick={() => {
                alert("Téléchargement de la facture...");
                console.log("Téléchargement de la facture...");
              }}
            >
              Télécharger la facture
            </Button>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Paper sx={{ maxWidth: 800, mx: "auto", mt: 8, p: 4, my: 12 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {getStepContent(activeStep)}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button
          disabled={activeStep === 0 || activeStep === 2}
          onClick={handleBack}
        >
          Retour
        </Button>
        {activeStep === steps.length - 1 ? null : (
          <Button
            variant="contained"
            onClick={activeStep === 1 ? handleSubmit : handleNext}
            disabled={activeStep === 1 && (!stripe || isLoading)}
          >
            {activeStep === 1 ? "Payer" : "Suivant"}
          </Button>
        )}
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Paiement effectué avec succès !
        </Alert>
      </Snackbar>
    </Paper>
  );
};

const PaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default PaymentPage;
