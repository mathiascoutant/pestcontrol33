import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Gérer la recherche quand searchTerm change
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        // Récupérer tous les produits
        const response = await fetch(
          "https://pestcontrol33.com/api/v1/products/"
        );
        if (!response.ok) throw new Error("Erreur lors de la recherche");
        const products = await response.json();

        // Filtrer les produits qui correspondent à la recherche
        const filteredProducts = products.filter((product) =>
          product.nom.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setSearchResults(filteredProducts);
      } catch (error) {
        console.error("Erreur de recherche:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce la recherche pour éviter trop de requêtes
    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        backgroundColor: "#00AAB7",
        mt: { xs: 10, sm: 11 },
        padding: "12px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: 2,
        }}
      >
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <IconButton onClick={handleMenuClick} sx={{ color: "black" }}>
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={Link} to="/" onClick={handleClose}>
              Accueil
            </MenuItem>
            <MenuItem component={Link} to="/about" onClick={handleClose}>
              À propos
            </MenuItem>
            <MenuItem component={Link} to="/shop" onClick={handleClose}>
              Nos produits
            </MenuItem>
            <MenuItem component={Link} to="/contact" onClick={handleClose}>
              Contact
            </MenuItem>
          </Menu>
        </Box>

        <TextField
          variant="outlined"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: "80%", sm: "500px" },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              height: "40px",
              "& fieldset": {
                borderColor: "white",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
              "& input": {
                padding: "8px 14px",
              },
            },
          }}
        />
      </Box>

      {/* Résultats de recherche */}
      {searchResults.length > 0 && (
        <Paper
          sx={{
            width: { xs: "80%", sm: "300px" },
            maxHeight: "300px",
            overflow: "auto",
            position: "absolute",
            top: "100%",
            zIndex: 1000,
            mt: 1,
          }}
        >
          <List>
            {searchResults.map((product) => (
              <ListItem
                key={product.id}
                component={Link}
                to={`/product/${product.id}`}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <ListItemText
                  primary={product.nom}
                  secondary={`${product.prix}€`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default SearchBar;
