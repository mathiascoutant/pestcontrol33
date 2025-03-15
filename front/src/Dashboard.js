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
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Récupérer le nombre total de commandes
    fetch(`https://pestcontrol33.com/api/v1/payments/getall`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.paiements) {
          setStats((prev) => ({
            ...prev,
            totalOrders: data.paiements.length,
          }));
        }
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des commandes:", error)
      );
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDeleteUser = (userId) => {
    const token = localStorage.getItem("token");

    console.log("Tentative de suppression utilisateur ID:", userId);

    // Appel à l'API de suppression avec le token
    fetch(`https://pestcontrol33.com/api/v1/users/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    })
      .then((response) => {
        console.log("Statut de la réponse:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Réponse de suppression:", data);
        // Vérification basée sur le message exact que vous recevez
        if (data.message === "Utilisateur supprimé avec succès.") {
          // Si la suppression a réussi, on met à jour la liste des utilisateurs
          setUsers(users.filter((user) => user.id !== userId));
          setSnackbar({
            open: true,
            message: "Utilisateur supprimé avec succès",
            severity: "success",
          });
        } else {
          console.error(
            "Erreur lors de la suppression de l'utilisateur :",
            data.message
          );
          setSnackbar({
            open: true,
            message: `Erreur: ${data.message || "Échec de suppression"}`,
            severity: "error",
          });
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression:", error);
        setSnackbar({
          open: true,
          message: "Erreur lors de la suppression",
          severity: "error",
        });
      });
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
                  value={stats.totalOrders || 0}
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
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

export default Dashboard;
