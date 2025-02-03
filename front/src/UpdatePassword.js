import {
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState } from "react";

function UpdatePassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [resetId, setResetId] = useState(null);

  const handleEmailSubmit = async () => {
    try {
      const response = await fetch(
        "https://pestcontrol33.com/api/v1/forgetpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi de l'email");
      }

      setResetId(data.forgetpassword.id);
      setStep(1);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCodeSubmit = async () => {
    console.log(
      "Vérification du code avec resetId:",
      resetId,
      "et code:",
      code
    );
    try {
      const response = await fetch(
        `https://pestcontrol33.com/api/v1/forgetpassword/check/${resetId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Erreur de réponse:", data);
        throw new Error(
          data.message || "Erreur lors de la vérification du code"
        );
      }

      setStep(2);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordReset = async () => {
    try {
      const response = await fetch(
        `https://pestcontrol33.com/api/v1/forgetpassword/reset/${resetId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la réinitialisation du mot de passe"
        );
      }

      setOpenSnackbar(true);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const steps = ["Adresse e-mail", "Code reçu", "Nouveau mot de passe"];

  return (
    <Box
      sx={{
        mt: 8,
        mx: 10,
        my: 12,
        p: 8,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="h4" sx={{ textAlign: "center", my: 5 }}>
        Récupération de mot de passe
      </Typography>
      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ color: "#1976d2" }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {step === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            label="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ my: 5 }} // Marge en bas
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEmailSubmit}
          >
            Envoyer le code
          </Button>
        </Box>
      )}
      {step === 1 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            label="Code reçu"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            sx={{ mb: 2 }} // Marge en bas
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCodeSubmit}
          >
            Vérifier le code
          </Button>
        </Box>
      )}
      {step === 2 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            label="Nouveau mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }} // Marge en bas
          />
          <TextField
            label="Confirmer le mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            sx={{ mb: 2 }} // Marge en bas
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handlePasswordReset}
          >
            Réinitialiser le mot de passe
          </Button>
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Mot de passe réinitialisé avec succès !
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default UpdatePassword;
