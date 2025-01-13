import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      const decodedToken = jwtDecode(token);
      console.log("Token décodé:", decodedToken);

      fetch("https://pestcontrol33.vercel.app/api/v1/users")
        .then((response) => response.json())
        .then((users) => {
          const currentUser = users.find(
            (user) => user.id === decodedToken.userId
          );

          if (currentUser) {
            const fullName = `${currentUser.prenom} ${currentUser.nom}`;
            setUserName(fullName);
            setIsAdmin(currentUser.admin === 1);
          } else {
            setUserName("Utilisateur non trouvé");
          }
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des utilisateurs:",
            error
          );
        });
    }
  }, []);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setSnackbar({
      open: true,
      message: "Vous avez été déconnecté",
      severity: "success",
    });
    setTimeout(() => {
      navigate("/connexion");
    }, 1000);
    handleClose();
  };

  return (
    <AppBar color="default">
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Pestcontroll33
            </Typography>
          </Link>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              component={Link}
              to="/"
              color="inherit"
              sx={{ textTransform: "capitalize" }}
            >
              Accueil
            </Button>
            <Button
              component={Link}
              to="/about"
              color="inherit"
              sx={{ textTransform: "capitalize" }}
            >
              À propos
            </Button>
            <Button
              component={Link}
              to="/shop"
              color="inherit"
              sx={{ textTransform: "capitalize" }}
            >
              Nos produits
            </Button>
            <Button
              component={Link}
              to="/contact"
              color="inherit"
              sx={{ textTransform: "capitalize" }}
            >
              Contact
            </Button>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" component={Link} to="/favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton color="inherit" component={Link} to="/shopping">
              <ShoppingCartIcon />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleProfileClick}
              aria-controls={Boolean(anchorEl) ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl)}
            >
              <PersonIcon />
            </IconButton>
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: 2,
                  minWidth: 200,
                },
              }}
            >
              {isAuthenticated
                ? [
                    <MenuItem
                      key="user-info"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        py: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", textAlign: "center" }}
                      >
                        {userName ? userName : "Chargement..."}
                      </Typography>
                      {isAdmin && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "primary.main",
                            fontWeight: "bold",
                            mt: 0.5,
                          }}
                        >
                          Admin
                        </Typography>
                      )}
                    </MenuItem>,
                    <Divider key="divider-1" />,
                    isAdmin && (
                      <MenuItem
                        key="dashboard"
                        component={Link}
                        to="/dashboard"
                        onClick={handleClose}
                        sx={{
                          display: "flex",
                          gap: 1,
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <SettingsIcon
                          fontSize="small"
                          sx={{ color: "#728996" }}
                        />
                        <Typography>Dashboard</Typography>
                      </MenuItem>
                    ),
                    <MenuItem
                      key="profile"
                      component={Link}
                      to="/profil"
                      onClick={handleClose}
                      sx={{
                        display: "flex",
                        gap: 1,
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <SettingsIcon
                        fontSize="small"
                        sx={{ color: "#728996" }}
                      />
                      <Typography>Profil</Typography>
                    </MenuItem>,
                    <Divider key="divider-2" />,
                    <MenuItem
                      key="logout"
                      onClick={handleLogout}
                      sx={{
                        display: "flex",
                        gap: 1,
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <LogoutIcon fontSize="small" sx={{ color: "#d50000" }} />
                      <Typography>Déconnexion</Typography>
                    </MenuItem>,
                  ]
                : [
                    <MenuItem
                      key="login"
                      component={Link}
                      to="/connexion"
                      onClick={handleClose}
                      sx={{ "&:hover": { bgcolor: "action.hover" } }}
                    >
                      Connexion
                    </MenuItem>,
                    <MenuItem
                      key="register"
                      component={Link}
                      to="/register"
                      onClick={handleClose}
                      sx={{ "&:hover": { bgcolor: "action.hover" } }}
                    >
                      Inscription
                    </MenuItem>,
                  ]}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity="error"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppBar>
  );
}

export default Header;
