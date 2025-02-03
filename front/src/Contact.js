import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

function Contact() {
  const [formData, setFormData] = useState({
    email: "",
    type: "",
    message: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/contact/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            to: "technique@pestcontrol33.com",
            subject: formData.type,
            text: formData.message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message");
      }

      setSnackbar({
        open: true,
        message: "Message envoyé avec succès !",
        severity: "success",
      });
      setFormData({ email: "", type: "", message: "" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors de l'envoi du message. Veuillez réessayer.",
        severity: "error",
      });
    }
  };

  const contactTypes = [
    { value: "commande", label: "Commande" },
    { value: "livraison", label: "Livraison" },
    { value: "paiement", label: "Paiement" },
    { value: "renseignement", label: "Renseignement produit" },
  ];

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 15 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 8,
          p: 4,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            color: "#ba9b73",
            fontWeight: "bold",
            mb: 3,
          }}
          gutterBottom
        >
          Contactez-nous
        </Typography>

        <TextField
          required
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#2C5545",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#2C5545",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#2C5545",
              },
          }}
        />

        <TextField
          required
          fullWidth
          select
          label="Type de demande"
          name="type"
          value={formData.type}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#2C5545",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#2C5545",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#2C5545",
              },
          }}
        >
          {contactTypes.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          required
          fullWidth
          multiline
          rows={4}
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#2C5545",
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#2C5545",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#2C5545",
              },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            mt: 2,
            py: 1,
            fontSize: "1rem",
            fontWeight: "bold",
            textTransform: "none",
            boxShadow: "0 2px 8px rgb(44 85 69 / 0.3)",
          }}
        >
          Envoyer votre message
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            "&.MuiAlert-standardSuccess, &.MuiAlert-filledSuccess": {
              backgroundColor: "#2C5545",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Contact;
