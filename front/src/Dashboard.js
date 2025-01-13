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
} from "@mui/material";
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";
import Header from "./components/Layouts/Header";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    fetch("https://pestcontrol33.vercel.app/api/v1/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setStats((prev) => ({ ...prev, totalUsers: data.length }));
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
      <Header />
      <Box sx={{ flexGrow: 1, py: 3, mt: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Dashboard{" "}
            <span
              style={{
                fontWeight: "bold",
                color: "#f0e2d1",
                fontSize: "1.5rem",
              }}
            >
              PestControl33
            </span>
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Utilisateurs Total"
                value={stats.totalUsers}
                icon={<PeopleIcon sx={{ color: "#2196f3" }} />}
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Commandes"
                value={stats.totalOrders}
                icon={<ShoppingCartIcon sx={{ color: "#4caf50" }} />}
                color="#4caf50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Revenu"
                value={`${stats.totalRevenue}€`}
                icon={<AttachMoneyIcon sx={{ color: "#ff9800" }} />}
                color="#ff9800"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Utilisateurs Actifs"
                value={stats.activeUsers}
                icon={<TimelineIcon sx={{ color: "#f44336" }} />}
                color="#f44336"
              />
            </Grid>
          </Grid>
          <Paper sx={{ p: 3 }}>
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
