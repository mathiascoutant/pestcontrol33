import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import fondImage from "../src/Assets/fond.png";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        "http://localhost:3002/api/v1/comment/latest"
      );
      const data = await response.json();
      console.log("Données récupérées :", data);
      setReviews(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des avis:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3002/api/v1/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error(
          "Token non trouvé. Vous devez être connecté pour supprimer un commentaire."
        );
        return;
      }

      const response = await fetch(`http://localhost:3002/api/v1/comment/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          commentId: id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        setReviews(reviews.filter((review) => review.id !== id));
      } else {
        console.error("Erreur lors de la suppression :", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const filteredReviews = reviews.filter((review) =>
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Avis filtrés :", filteredReviews);

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
          Mes avis
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
          <Typography sx={{ color: "#000" }}>Mes avis</Typography>
        </Box>
      </Box>

      <Box sx={{ px: 4, py: 3 }}>
        <TextField
          fullWidth
          label="Rechercher un avis"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Produit</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Contenu</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Note</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReviews.map((review) => {
                const product = products.find((p) => p.id === review.productId);
                return (
                  <TableRow key={review.id}>
                    <TableCell
                      sx={{
                        lineHeight: "1.5",
                        textAlign: "justify",
                        maxWidth: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {product ? product.nom : "Produit inconnu"}
                    </TableCell>
                    <TableCell>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{review.comment}</TableCell>
                    <TableCell>{review.notation}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDelete(review.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default Reviews;
