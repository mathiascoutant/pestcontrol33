import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
} from "@mui/material";
import { Link } from "react-router-dom";
import fondImage from "../src/Assets/fond.png";

function TableUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}users`
      );
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);
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
          Table des utilisateurs
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
          <Typography sx={{ color: "#000" }}>Table des utilisateurs</Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 3, width: "95%", margin: "auto", p: 3 }}>
        <TableContainer component={Paper}>
          <Table sx={{ p: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Pseudo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nom</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Prénom</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Téléphone</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Adresse</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Code postal</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Ville</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Pays</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.pseudo}</TableCell>
                  <TableCell>{user.nom}</TableCell>
                  <TableCell>{user.prenom}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.telephone}</TableCell>
                  <TableCell>{user.adresse}</TableCell>
                  <TableCell>{user.codePostal}</TableCell>
                  <TableCell>{user.ville}</TableCell>
                  <TableCell>{user.pays}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default TableUsers;
