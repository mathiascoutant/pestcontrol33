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
  Drawer,
} from "@mui/material";
import {
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import UpdateIcon from "@mui/icons-material/Update";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";

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
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      // Charger les informations de l'utilisateur
      fetch(`${process.env.REACT_APP_API_BASE_URL}/users`)
        .then((response) => response.json())
        .then((users) => {
          const currentUser = users.find((user) => user.id === userId);

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

  // Nettoyer le panier lié à l'utilisateur lors de la déconnexion
  const handleLogout = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      localStorage.removeItem(`cart_${userId}`); // Supprimer le panier spécifique à cet utilisateur
    }

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

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar color="default">
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            onClick={toggleDrawer(true)}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  display: { xs: "none", md: "block" },
                }}
              >
                PestControl33
              </Typography>
            </Link>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              justifyContent: "center",
              flexGrow: 15,
            }}
          >
            <Button
              component={Link}
              to="/"
              color="inherit"
              sx={{ textTransform: "capitalize", color: "black" }}
            >
              Accueil
            </Button>
            <Button
              component={Link}
              to="/about"
              color="inherit"
              sx={{ textTransform: "capitalize", color: "black" }}
            >
              À propos
            </Button>
            <Button
              component={Link}
              to="/shop"
              color="inherit"
              sx={{ textTransform: "capitalize", color: "black" }}
            >
              Nos produits
            </Button>
            <Button
              component={Link}
              to="/contact"
              color="inherit"
              sx={{ textTransform: "capitalize", color: "black" }}
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
                          sx={{ color: "primary.main" }}
                        />
                        <Typography>Dashboard</Typography>
                      </MenuItem>
                    ),
                    isAdmin && (
                      <Divider
                        key="divider-dashboard-profile"
                        variant="middle"
                      />
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
                      <UpdateIcon
                        fontSize="small"
                        sx={{ color: "primary.main" }}
                      />
                      <Typography>Profil</Typography>
                    </MenuItem>,
                    <Divider key="divider-2" variant="middle" />,
                    <MenuItem
                      key="commande"
                      component={Link}
                      to="/commande"
                      onClick={handleClose}
                      sx={{
                        display: "flex",
                        gap: 1,
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <LibraryBooksOutlinedIcon
                        fontSize="small"
                        sx={{ color: "primary.main" }}
                      />
                      <Typography>Mes commandes</Typography>
                    </MenuItem>,
                    <Divider key="divider-2" variant="middle" />,
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
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ padding: 2, textAlign: "center" }}>
            Menu
          </Typography>
          <Divider />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              ml: 2,
              mt: 2,
            }}
          >
            <Typography
              component={Link}
              to="/"
              fullWidth
              sx={{ color: "black", textDecoration: "none" }}
            >
              Accueil
            </Typography>
            <Typography
              component={Link}
              to="/about"
              color="inherit"
              fullWidth
              sx={{ color: "black", textDecoration: "none" }}
            >
              À propos
            </Typography>
            <Typography
              component={Link}
              to="/shop"
              color="inherit"
              fullWidth
              sx={{ color: "black", textDecoration: "none" }}
            >
              Nos produits
            </Typography>
            <Typography
              component={Link}
              to="/contact"
              color="inherit"
              fullWidth
              sx={{ color: "black", textDecoration: "none" }}
            >
              Contact
            </Typography>
          </Box>
        </Box>
      </Drawer>
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
