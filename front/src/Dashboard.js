import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from "@mui/material";
import LoopIcon from "@mui/icons-material/Loop";
import { Link } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import GroupIcon from "@mui/icons-material/Group";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    totalProducts: 0,
    totalReviews: 0,
    totalDiscounts: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users`)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setStats((prev) => ({ ...prev, totalUsers: data.length }));
      })
      .catch((error) => console.error("Erreur:", error));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products`)
      .then((response) => response.json())
      .then((data) => {
        setStats((prev) => ({ ...prev, totalProducts: data.length }));
      })
      .catch((error) => console.error("Erreur:", error));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/comment/latest`)
      .then((response) => response.json())
      .then((data) => {
        setStats((prev) => ({ ...prev, totalReviews: data.length }));
      })
      .catch((error) => console.error("Erreur:", error));
  }, []);

  const handleDeleteUser = (userId) => {
    const token = localStorage.getItem("token");

    // Appel à l'API de suppression avec le token
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Ajout du token dans l'en-tête
      },
    })
      .then((response) => response.json()) // On récupère la réponse sous forme JSON
      .then((data) => {
        if (data.message === "Utilisateur supprimé avec succès") {
          // Si la suppression a réussi, on met à jour la liste des utilisateurs
          setUsers(users.filter((user) => user.id !== userId));
        } else {
          console.error(
            "Erreur lors de la suppression de l'utilisateur :",
            data.message
          );
        }
      })
      .catch((error) => console.error("Erreur lors de la suppression:", error));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.REACT_APP_API_BASE_URL}/discountShopping`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Discount data received:", data);
        console.log("Total discounts:", data.stats.total);
        setStats((prev) => {
          const newStats = {
            ...prev,
            totalDiscounts: Number(data.stats.total),
          };
          console.log("Updated stats:", newStats);
          return newStats;
        });
      })
      .catch((error) => console.error("Erreur:", error));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/subCategories`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Categories data:", data);
        setStats((prev) => ({ ...prev, totalCategories: data.count }));
        console.log("Updated stats:", stats);
      })
      .catch((error) => console.error("Erreur:", error));
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography color="text.secondary" variant="subtitle2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: "50%",
              p: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1, py: 3, mt: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Dashboard{" "}
            <span
              style={{
                fontWeight: "bold",
                color: "#B6DEDD",
                fontSize: "1.5rem",
              }}
            >
              PestControl33
            </span>
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Link style={{ textDecoration: "none" }} to="/allcategory">
                <StatCard
                  title={`Les catégories`}
                  value={stats.totalCategories}
                  icon={<GroupIcon sx={{ color: "purple" }} />}
                  color="#976ffa"
                />
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link style={{ textDecoration: "none" }} to="/allproduct">
                <StatCard
                  title="Produits"
                  value={stats.totalProducts}
                  icon={
                    <NotificationsNoneOutlinedIcon sx={{ color: "#2196f3" }} />
                  }
                  color="#2196f3"
                />
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link style={{ textDecoration: "none" }} to="/adddiscount">
                <StatCard
                  title="Code promo"
                  value={stats.totalDiscounts}
                  icon={
                    <NotificationsNoneOutlinedIcon sx={{ color: "#2196f3" }} />
                  }
                  color="#2196f3"
                />
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link style={{ textDecoration: "none" }} to="/completedorders">
                <StatCard
                  title="Les commandes"
                  value={`${stats.totalRevenue}`}
                  icon={<LibraryBooksOutlinedIcon sx={{ color: "#f44336" }} />}
                  color="#4caf50"
                />
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link style={{ textDecoration: "none" }} to="/reviews">
                <StatCard
                  title={`Mes avis`}
                  value={stats.totalReviews}
                  icon={<StarBorderIcon sx={{ color: "#f2fa02" }} />}
                  color="#f1e447"
                />
              </Link>
            </Grid>
          </Grid>
          <Paper sx={{ p: 3, display: { xs: "none", md: "block" } }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Utilisateurs Récents
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Pseudo</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Date d'inscription</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{`${user.prenom} ${user.nom}`}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.pseudo}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.admin === 1 ? "Admin" : "Utilisateur"}
                          color={user.admin === 1 ? "primary" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteUser(user.id)} // Appel à la fonction de suppression
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </>
  );
}

export default Dashboard;
