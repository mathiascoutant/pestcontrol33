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
import LoopIcon from "@mui/icons-material/Loop";
import { Link } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
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
                color: "#f0e2d1",
                fontSize: "1.5rem",
              }}
            >
              PestControl33
            </span>
          </Typography>
          <Grid container spacing={3} sx={{ mb: 4 }}>
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
              <Link style={{ textDecoration: "none" }} to="/ongoingorders">
                <StatCard
                  title="Commandes en cours"
                  value={stats.totalOrders}
                  icon={<LoopIcon sx={{ color: "orange" }} />}
                  color="#cfaf69"
                />
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link style={{ textDecoration: "none" }} to="/completedorders">
                <StatCard
                  title="Commandes terminées"
                  value={`${stats.totalRevenue}`}
                  icon={<CheckIcon sx={{ color: "#4caf50" }} />}
                  color="#4caf50"
                />
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link style={{ textDecoration: "none" }} to="/invoices">
                <StatCard
                  title="Mes factures"
                  value={stats.activeUsers}
                  icon={<LibraryBooksOutlinedIcon sx={{ color: "#f44336" }} />}
                  color="#f44336"
                />
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link style={{ textDecoration: "none" }} to="/reviews">
                <StatCard
                  title="Mes avis"
                  value={stats.activeUsers}
                  icon={<StarBorderIcon sx={{ color: "#f2fa02" }} />}
                  color="#f1e447"
                />
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link style={{ textDecoration: "none" }} to="/tableusers">
                <StatCard
                  title="Les utilisateurs"
                  value={stats.activeUsers}
                  icon={<GroupIcon sx={{ color: "purple" }} />}
                  color="#976ffa"
                />
              </Link>
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
