import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Snackbar,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import fondImage from "../src/Assets/fond.png";
import DeleteIcon from "@mui/icons-material/Delete";
import MuiAlert from "@mui/material/Alert";

function AllCategory() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/subCategories`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.subCategories);
      })
      .catch((error) => console.error("Erreur:", error));
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbar({
          open: true,
          message: "Vous devez être connecté pour supprimer une catégorie",
          severity: "error",
        });
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/subCategories/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setSnackbar({
            open: true,
            message: "Session expirée, veuillez vous reconnecter",
            severity: "error",
          });
          return;
        }
        throw new Error("Erreur lors de la suppression");
      }

      // Mise à jour de la liste des catégories
      setCategories(categories.filter((category) => category.id !== id));

      setSnackbar({
        open: true,
        message: "Catégorie supprimée avec succès",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundImage: `url(${fondImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: { xs: "200px", sm: "250px", md: "300px" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mb: { xs: 2, sm: 3, md: 5 },
          mt: { xs: 6, sm: 7, md: 8 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: "semibold",
            mt: 0.5,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          Les catégories
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
          <Typography sx={{ color: "#000" }}>Les catégories</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          width: "100%",
          justifyContent: "space-between",
          gap: { xs: 2, sm: 0 },
          px: { xs: 2, sm: 5, md: 10 },
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: "100%", sm: "250px", md: "300px" },
            marginLeft: { xs: 0, sm: 0, md: 0 },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          component={Link}
          to="/addcategory"
          variant="contained"
          sx={{
            alignSelf: { xs: "center", sm: "flex-end" },
            mt: { xs: 0, sm: 2 },
            mr: { xs: 0, sm: 0 },
          }}
        >
          Ajouter une catégorie
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          maxWidth: { xs: "95%", sm: "95%", md: "95%" },
          mx: "auto",
          overflow: "auto",
          my: 2,
        }}
      >
        {/* Vue mobile */}
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Image
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Nom
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Description
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories
                .filter((category) =>
                  category.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((category) => (
                  <TableRow key={category.id}>
                    <TableCell align="center">
                      <img
                        src={category.picture}
                        alt={category.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: 5,
                          objectFit: "cover",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">{category.name}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        lineHeight: "1.5",
                        maxWidth: { xs: "100px", sm: "150px", md: "200px" },
                        textTransform: "capitalize",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {category.description}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleDelete(category.id)}
                        sx={{
                          color: "error.main",
                          "&:hover": {
                            backgroundColor: "rgba(211, 47, 47, 0.04)",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>

        {/* Vue desktop */}
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Image
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Nom de la catégorie
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Description
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Date de création
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories
                .filter((category) =>
                  category.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((category) => (
                  <TableRow key={category.id}>
                    <TableCell align="center">
                      <img
                        src={category.picture}
                        alt={category.name}
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: 5,
                          objectFit: "cover",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        lineHeight: "1.5",
                        maxWidth: { xs: "100px", sm: "150px", md: "200px" },
                        textTransform: "capitalize",
                      }}
                    >
                      {category.name}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        lineHeight: "1.5",
                        maxWidth: { xs: "100px", sm: "150px", md: "200px" },
                        textTransform: "capitalize",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {category.description}
                    </TableCell>
                    <TableCell align="center">
                      {new Date(category.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleDelete(category.id)}
                        sx={{
                          color: "error.main",
                          "&:hover": {
                            backgroundColor: "rgba(211, 47, 47, 0.04)",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}

export default AllCategory;
