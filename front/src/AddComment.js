import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  Typography,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function AddComment() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [notation, setNotation] = useState("");
  const [comment, setComment] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
    try {
      const token = localStorage.getItem("token");
      const payload = {
        productId,
        notation: Number(notation),
        comment: comment.trim(),
      };
      console.log("Données envoyées:", payload);
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/comment/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSnackbarMessage("Commentaire ajouté avec succès !");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate(`/product/${productId}`);
      }, 2000);
    } catch (error) {
      console.error(
        "Erreur lors de l'ajout du commentaire:",
        error.response.data
      );
      setSnackbarMessage("Erreur lors de l'ajout du commentaire.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: { xs: 2, sm: 4 },
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: { xs: "100%", sm: 500, md: 600 },
          p: { xs: 1, sm: 2 },
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              mb: 4,
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
            }}
            gutterBottom
          >
            <IconButton
              component={Link}
              to={`/product/${productId}`}
              sx={{ ml: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
            Ajouter un Avis
          </Typography>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              margin: "auto",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                  key={star}
                  onClick={() => setNotation(star)}
                  sx={{
                    color: notation >= star ? "#f5e969" : "default",
                    fontSize: 30,
                  }}
                >
                  ★
                </IconButton>
              ))}
            </Box>
            <TextField
              label="Commentaire"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              multiline
              rows={4}
              sx={{
                width: "100%",
                mb: 2,
                "& .MuiInputBase-root": {
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                },
              }}
            />
            <Button type="submit" variant="contained" color="primary">
              Soumettre
            </Button>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AddComment;
